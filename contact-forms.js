// One handler for every website form. No provider credentials belong in this file.
(function () {
  const messages = {
    en: { success: 'Thank you. Your inquiry has been sent to our team.', error: 'We could not confirm that your inquiry was sent. Your details are still here; please try again.', invalid: 'Please check your details. Your inquiry must be 10,000 characters or fewer.', rate: 'Too many attempts. Please wait 10 minutes and try again.', sending: 'Sending…' },
    tr: { success: 'Teşekkür ederiz. Talebiniz ekibimize gönderildi.', error: 'Talebinizin gönderildiğini doğrulayamadık. Bilgileriniz formda duruyor; lütfen tekrar deneyin.', invalid: 'Lütfen bilgilerinizi kontrol edin. Mesajınız en fazla 10.000 karakter olabilir.', rate: 'Çok fazla deneme yapıldı. Lütfen 10 dakika bekleyip tekrar deneyin.', sending: 'Gönderiliyor…' },
    zh: { success: '谢谢，您的咨询已发送给我们的团队。', error: '我们无法确认咨询是否已发送。您填写的信息仍保留在表单中，请重试。', invalid: '请检查填写的信息。咨询内容不得超过 10,000 个字符。', rate: '尝试次数过多，请等待10分钟后重试。', sending: '正在发送…' },
    ar: { success: 'شكراً لك. تم إرسال استفسارك إلى فريقنا.', error: 'تعذر تأكيد إرسال استفسارك. ما زالت بياناتك في النموذج؛ يرجى المحاولة مجدداً.', invalid: 'يرجى مراجعة بياناتك. يجب ألا تتجاوز الرسالة 10,000 حرف.', rate: 'محاولات كثيرة. يرجى الانتظار 10 دقائق ثم المحاولة مجدداً.', sending: 'جارٍ الإرسال…' }
  };
  const state = new WeakMap();
  function uuid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  document.addEventListener('submit', async function (event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    event.preventDefault();
    let current = state.get(form);
    if (current?.busy) return;
    if (!form.reportValidity()) return;
    const lang = (document.documentElement.lang || 'en').split('-')[0];
    const text = messages[lang] || messages.en;
    let note = form.querySelector('[data-form-status], .form-note');
    if (!note) {
      note = document.createElement('p');
      note.className = 'form-note wide';
      form.appendChild(note);
    }
    note.setAttribute('role', 'status');
    note.setAttribute('aria-live', 'polite');
    let controls = [];
    try {
      const fd = new FormData(form);
      const fields = [];
      for (const [name, value] of fd.entries()) {
        if (name === '_iga_website') continue;
        if (typeof value !== 'string') throw new Error('Unsupported field');
        fields.push({ name, value });
      }
      const values = name => fd.get(name) || '';
      const data = {
        fields,
        website: String(values('_iga_website')),
        pageUrl: location.href,
        pageTitle: document.querySelector('main h1')?.textContent.trim() || document.title,
        language: document.documentElement.lang || 'en',
        service: String(values('service') || values('selected_service') || values('selectedService'))
      };
      const fingerprint = JSON.stringify(data);
      // Retry the same submission safely; changed fields start a new submission.
      if (!current || current.fingerprint !== fingerprint || Date.now() - new Date(current.payload.submittedAt).getTime() >= 23 * 60 * 60 * 1000) {
        current = { fingerprint, payload: { ...data, submissionId: uuid(), submittedAt: new Date().toISOString() } };
        state.set(form, current);
      }
      current.busy = true;
      form.setAttribute('aria-busy', 'true');
      controls = Array.from(form.querySelectorAll('button[type="submit"], input[type="submit"]')).map(control => ({ control, disabled: control.disabled }));
      controls.forEach(({ control }) => { control.disabled = true; });
      note.textContent = text.sending;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      let response, result;
      try {
        response = await fetch('/api/contact', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(current.payload), signal: controller.signal });
        result = await response.json();
      } finally { clearTimeout(timer); }
      if (!response.ok || result.ok !== true) {
        note.textContent = response.status === 429 ? text.rate : [400, 413].includes(response.status) ? text.invalid : text.error;
        return;
      }
      note.textContent = text.success;
      form.reset();
      state.delete(form);
    } catch {
      note.textContent = text.error;
    } finally {
      if (current) current.busy = false;
      form.removeAttribute('aria-busy');
      controls.forEach(({ control, disabled }) => { control.disabled = disabled; });
    }
  });
})();
