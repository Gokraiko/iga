# IGA — Gayrimenkul başvuru sistemi geliştirme raporu

Durum: geliştirme uygulaması ve yerel testler tamamlandı; canlıya alınmadı. Gerçek e-posta teslim testi ve gizlilik/analitik onay bağlantıları açık. Çalışma dalı `codex/property-review`, üretim tabanı `39ad2ae0626c81db298a69c5407fd769c338b72b`.

## Yapılanlar

- EN/TR/ZH/AR ana sayfalarındaki mevcut gayrimenkul bölümüne iki sorulu kısa akış eklendi. İsim veya iletişim bilgisi toplanmaz. Seçimler mevcut hizmet sayfasındaki `#property-legal-review` formuna aktarılır; ikincil bağlantı soruları atlar.
- Mevcut gayrimenkul sayfasına hizmet, amaç, durum, değer aralığı, konum, ilan URL’si, ad, uluslararası telefon, e-posta, ülke/bölge, WeChat, tercih edilen kanal, mesaj ve aydınlatma teyidi alanları eklendi. Yeni hizmet sayfası oluşturulmadı.
- Değerleme taleplerinde telefon, konum ve değerleme amacı zorunlu. WeChat yok seçeneği desteklenir. Diğer taleplerde e-posta alternatifi vardır. Çin seçilince WeChat alanı vurgulanır.
- Masaüstü ve mobil menüde Our Vision yerine yerel Property Legal Review etiketi kullanılır; mevcut about/Our Vision sayfaları korunur.
- Dört vatandaşlık avukatlığı sayfasına hizmet ve amacı önceden seçen tek kompakt bağlantı eklendi.
- Yeni `/api/property-review` uç noktası mevcut Resend ve Redis altyapısını kullanır. Her hizmet için istenen konu satırı, İngilizce alan etiketleri, müşterinin özgün mesajı, sunucu zamanı ve hizmete özel takip önerisi üretilir. Alıcı sunucuda sabit: info@igalawfirm.com.
- Sunucu doğrulaması, boyut sınırı, honeypot, imzalı form oturumu, 2 saniyelik minimum süre, Redis ile dağıtık hız sınırı, atomik tekrar-gönderim kaydı ve Resend idempotency anahtarı uygulandı. Gizli anahtarlar tarayıcıya gönderilmez. E-postalar düz metindir; header injection girişimleri reddedilir.
- Sağlayıcı teslim için kabulü doğrulanmadan başarı gösterilmez. Hata durumunda form korunur ve tekrar deneme sunulur. Başarılı gönderimden sonra tekrar gönderme kilitlenir; yeni talep ayrı başlatılır.
- İstenen beş analitik olayın kodu hazırdır. Yalnızca açık analitik izin sinyaliyle çalışır; kişisel alanları göndermez. Mevcut Clarity için form maskelendi.

## Test sonuçları

| Kontrol | Sonuç |
|---|---|
| Yeni sunucu güvenlik ve bildirim testleri | 87 kontrol geçti; beş hizmet türü dahil |
| Kısa akış ve analitik izin testleri | 32 kontrol geçti |
| Mevcut form tarayıcı regresyonları | 33 kontrol geçti |
| Mevcut e-posta API regresyonları | 54 kontrol geçti |
| Tam SEO kaydı karşılaştırması | 237 kayıtta 0 değişiklik |
| URL ve yönlendirmeler | Eklenen/silinen rota yok; redirect değişikliği yok |
| Çok dilli statik kontroller | 4 kısa form, 4 tam form, 4 vatandaşlık CTA’sı |
| Responsive tarayıcı kontrolleri | 4 dil × ana sayfa/form × 390/1440 px = 16 kontrol; yatay taşma yok |
| Tarayıcı akışları | Ön seçim, zorunlu telefon, e-posta alternatifi, WeChat, Arapça mobil menü, hata sonrası veri koruma ve tekrar gönderme doğrulandı |
| Gerçek e-posta teslimi | **Yapılmadı**; yerel testlerde sağlayıcı ve Redis simüle edildi |

Form bildirimlerinin konu, alıcı, alanlar, Çince/Arapça karakterler ve takip önerileri test edildi. `sample-notification.txt` yalnızca kurmaca verilerle oluşturulmuş örnektir; gönderilmiş bir e-posta değildir.

## SEO koruması

Başlıklar, açıklamalar, canonical/hreflang, robots, yapılandırılmış veriler ve mevcut yönlendirmeler korunur. Tüm 237 SEO kaydı üretim tabanıyla birebir eşittir. Mevcut gayrimenkul ve vatandaşlık hukuki içerikleri korunmuştur; yalnızca istenen form/CTA ve navigasyon iyileştirmeleri uygulanmıştır. Ana sayfa gayrimenkul bölümü istenen kısa akışla yenilenmiştir.

## Yayın öncesi açık noktalar

1. **Gerçek teslim testi:** Geliştirme sürecinde mevcut Resend/Redis sunucu değişkenlerine erişim yoktur. Bu nedenle beş gerçek test e-postasının info@igalawfirm.com adresine ulaştığı doğrulanmadı. `scripts/test-property-review-delivery.cjs --send-real-test-emails` hazırdır; güvenli ortam değişkenleriyle çalıştırılıp mevcut Resend paneli ve posta kutusunda sonuçları kontrol edilmelidir. Sağlayıcı API kabulü tek başına gelen kutusu teslimi sayılmaz.
2. **Aydınlatma ve saklama:** Büronun mevcut onaylı metni/saklama politikası bulunamadı ve sohbette istendi. Formdaki metin geliştirme taslağıdır. Veri sorumlusu kimliği, hukuki sebepler, alıcılar/yurt dışı aktarım düzeni, saklama süreleri ve haklar prosedürü büronun gerçek uygulamasına göre tamamlanmalıdır. Yeni pazarlama izni veya önceden işaretli kutu yoktur.
3. **Analitik izin bağlantısı:** Depoda doğrulanmış bir consent manager bulunmadı. Yeni olaylar `window.igaConsent.analytics === true` olmadan gönderilmez. Bu sinyal mevcut onay mekanizmasına bağlanmalı; mevcut GTM otomatik toplama ayarları gözden geçirilmelidir. Yeni analitik sağlayıcı eklenmedi.
4. **Avukatlık reklam kuralları:** Yeni metinler garanti, üstünlük, belirli fiyat/süre veya doğrulanmamış akreditasyon iddiası içermez. Nihai hukuki/mesleki değerlendirme büronun onayına tabidir.
5. **Önceden mevcut konsol hatası:** `property-eligibility-post.js` tarayıcıda “Missing related guide tr” hatası üretiyor. Bu görevden önceki üretim kaynak kodunda da aynı guard bulunuyor; kapsam dışı blog modülü değiştirilmedi. Yeni form akışları bu hatadan bağımsız olarak test edildi.

Teknik yapılandırma ve işletim notları: `review/property-review/CONFIGURATION.md`.

## Değişen uygulama dosyaları

- app.js — form, kısa akış, menü ve vatandaşlık CTA entegrasyonu.
- index.html / generate-static.js — yeni içerik, tarayıcı kodu ve CSS kaydı.
- contact-forms.js — yeni özel formların mevcut genel handler tarafından tekrar işlenmesini önler.
- property-review-content.js — dört dilde statik render modülü.
- property-review-forms.js — ön seçim, koşullu alanlar, doğrulama, gönderim ve izinli analitik.
- property-review.css — mevcut tasarıma uyumlu, responsive ve RTL destekli stiller.
- api/property-review.js — sunucu doğrulaması, Resend bildirimi ve Redis korumaları.
- review/property-review/{en,tr,zh,ar}.json ve render.js — düzenlenebilir metin/render kaynakları.
- scripts/prepare-property-review.py — içerik üreticisi.
- scripts/test-property-review-api.cjs / test-property-review-browser.cjs / test-property-review-delivery.cjs — testler.
- scripts/property-review-mock.cjs / property-review-preview.cjs — yalnızca yerel simülasyon.
- scripts/test-contact-browser-logic.cjs — mevcut handler kapsam regresyonu.
- scripts/audit-property-review.py — SEO/dil/rota koruma denetimi.

## Önizleme ve kanıtlar

`preview.html` dosyası masaüstü/mobil ekran görüntülerini ve örnek bildirimi bir araya getirir. `full-form-desktop.png` formun tamamını gösterir. Tarayıcıdaki örnek başarı durumu gerçek teslim değil, yerel simülasyondur.

Yerel geliştirme sunucusunu tekrar açmak için çalışma dalında:

```sh
IGA_REFRESH_POPULARITY=0 node generate-static.js --preserve-routing
node scripts/property-review-preview.cjs
```

Adres: http://127.0.0.1:4178/en/igalawrealestateduediligence/#property-legal-review

Ekli görevdeki “Do not deploy, publish or modify the production website without explicit approval” şartı nedeniyle hiçbir push veya yayın yapılmadı. Açık noktalar tamamlandıktan sonra incelenmiş değişiklik için yayın onayı alınmalıdır.
