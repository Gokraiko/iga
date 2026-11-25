const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8');
const config = source.split('\n').filter(line => /^const (CONTACT_CONFIG|contactUi)=/.test(line)).join('\n');
const handler = source.split('\n').find(line => line.startsWith('function wireFloatingContact()'));
const markup = source.split('\n').find(line => line.startsWith('function floatingContactMarkup('));
let checks = 0;
(async () => {
  for (const lang of ['en', 'tr', 'zh', 'ar']) {
    for (const userAgent of ['Desktop', 'Mozilla/5.0 (iPhone)', 'Mozilla/5.0 (Linux; Android 14)']) {
      for (const mode of ['clipboard', 'fallback', 'failure']) {
        const elements = {};
        let copied = null;
        let timers = 0;
        const element = () => ({ hidden: false, style: {}, events: {}, attrs: {}, textContent: '', addEventListener(k, fn) { this.events[k] = fn; }, setAttribute(k, v) { this.attrs[k] = v; }, focus() { doc.activeElement = this; }, select() {}, remove() {} });
        for (const id of ['wechat-trigger','wechat-modal','wechat-close','wechat-copy','wechat-copy-status','wechat-qr-image','wechat-qr-fallback']) elements[id] = element();
        elements['wechat-modal'].hidden = true;
        elements['wechat-qr-fallback'].hidden = true;
        const dialog = element();
        dialog.querySelectorAll = () => [elements['wechat-close'],elements['wechat-copy']];
        elements['wechat-modal'].querySelector = () => dialog;
        const doc = { activeElement: elements['wechat-trigger'], events: {}, getElementById: id => elements[id], addEventListener(k, fn) { this.events[k] = fn; }, createElement: element, body: { appendChild(input) { copied = input.value; } }, execCommand() { return mode !== 'failure'; } };
        const context = vm.createContext({ document: doc, navigator: { userAgent, clipboard: mode === 'clipboard' ? { async writeText(v) { copied = v; } } : null }, window: { isSecureContext: true, get location() { throw Error('Navigation must never be attempted'); } }, locale: lang, setTimeout() { timers++; return timers; }, clearTimeout() {} });
        vm.runInContext(config + '\n' + markup + '\n' + handler + '\nwireFloatingContact();', context);
        const html = vm.runInContext(`floatingContactMarkup('${lang}')`, context);
        assert.ok(!html.includes('weixin:') && !html.includes('wechat-launch'));
        assert.ok(html.includes('/public/assets/wechat-qr.png') && html.includes('igalawfirm'));
        elements['wechat-trigger'].events.click();
        assert.equal(elements['wechat-modal'].hidden, false);
        assert.equal(timers, 0, 'Modal must open synchronously without navigation or delayed fallback');
        assert.equal(doc.activeElement, elements['wechat-close']);
        await elements['wechat-copy'].events.click();
        assert.equal(copied, 'igalawfirm');
        assert.ok(elements['wechat-copy-status'].textContent);
        assert.equal(elements['wechat-modal'].hidden, false);
        elements['wechat-qr-image'].events.error();
        assert.equal(elements['wechat-qr-fallback'].hidden, false);
        doc.events.keydown({ key: 'Escape', preventDefault() {} });
        assert.equal(elements['wechat-modal'].hidden, true);
        assert.equal(doc.activeElement, elements['wechat-trigger']);
        checks++;
      }
    }
  }
  console.log(JSON.stringify({ passed: checks, environments: 'Mock desktop/iOS/Android user agents; not physical devices', realMessagesSent: 0 }));
})().catch(error => { console.error(error); process.exitCode = 1; });
