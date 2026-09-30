# SEO ve GEO uygulama notu — 30 Eylül 2026

## Envanter ve öncelikli bulgular

`SEO_INVENTORY_BEFORE.csv` ve `SEO_INVENTORY_AFTER.csv`, üretilen 160 URL'nin her biri için dil, title, description, H1, canonical, hreflang, sitemap ve ilk HTML'deki ana içeriği gösterir. 160 URL'nin 60'ı temel sayfa, 100'ü blog yazısı URL'sidir (25 yazı × 4 dil). Başlangıçta temel sayfaların her birinde H1 ve ilk HTML'de ana içerik vardı. Ancak genel sayfa türlerinde tekrarlanan açıklamalar, İngilizce gövdeli blog yazılarının dil sinyalleri ve ülkeye göre değişen kök yönlendirmesi sorun oluşturuyordu.

| Öncelik | Bulgu | Uygulama |
| --- | --- | --- |
| Yüksek | 75 TR/ZH/AR blog URL'sinin ana metni İngilizceydi. | Bu URL'ler İngilizce asıl yazıya canonical verir ve `noindex,follow` taşır. Blog liste ve öne çıkan kartlar asıl İngilizce yazıya bağlanır. Çevrilmiş gibi hreflang verilmez; eski doğrudan URL'ler çalışmaya devam eder. |
| Yüksek | `/` IP ülkesine göre farklı dil sürümüne yönleniyordu. | Kök adres kararlı biçimde `/en/` sayfasına geçici yönlenir. EN/TR/ZH/AR dil seçici görünür; çevrilmiş temel sayfalar kendi URL'sinde erişilebilir. |
| Yüksek | Genel sayfalarda benzer meta açıklamaları vardı. | Başlık ve açıklamalar sayfanın gerçek içeriğinden ve dilinden türetilir. Blog yazılarının açıklamaları yazının ilk anlamlı paragrafından gelir. |
| Orta | Temel sayfaların alternatif dil kümesinde `x-default` yoktu. | 60 temel sayfanın HTML ve sitemap hreflang kümelerine `/en/` karşılığı `x-default` eklendi. Çince kodu HTML ve hreflang'da `zh-CN`. |
| Orta | Vatandaşlık konu kümesindeki bağlantılar ve yatırım yetkili kurumları eksikti. | Hizmetler, ilgili gayrimenkul hizmeti, footer ve ilgili blog yazıları rehber/hizmet sayfalarına bağlandı; rehberde yedi yolun yetkili kurumu gösterildi. |
| Orta | İstanbul görseli yaklaşık 2,4 MB PNG idi. | Görünümü koruyan JPEG sürümü yaklaşık 0,5 MB; ana sayfadaki mevcut görsel kompozisyonu korunur. |

## Çıktı kontrolü

- Statik üretim: 160 sayfa; sitemap: 85 canonical ve indekslenebilir URL. 75 çevrilmemiş blog kopyası sitemap dışında ve `noindex`.
- İndekslenebilir sayfalarda benzersiz title, description ve H1; tek H1 ve ilk HTML'de `<main>`.
- Canonical adreslerin tamamı `https://igalawfirm.com` altında; sitemap, HTML hreflang ve karşılıklı alternatifler eşleşiyor.
- İç bağlantı hedefleri, JSON-LD sözdizimi ve JSON-LD WebPage URL/canonical eşleşmesi denetlendi.
- Schema'da doğrulanmamış adres, yazar ve yayın tarihi eklenmedi. Organization, WebSite, WebPage ve yazılar için BlogPosting kullanılıyor. Sayfada görünen gerçek SSS haricinde FAQPage işaretlemesi yok.
- `https://igalawfirm.com/robots.txt` içinde sitemap adresi `https://igalawfirm.com/sitemap.xml` olarak üretiliyor.

## Editoryal doğrulama gerekenler

1. EN/AR sürümleri ofisi **Bebek, Beşiktaş**; TR/ZH sürümleri **Esentepe, Şişli** olarak gösteriyor. Hangi adresin güncel olduğu kullanıcıdan doğrulanmalı. Doğrulama gelene kadar adres kodu ve adresli schema değiştirilmedi.
2. Blog yazılarında doğrulanmış yazar ve tam yayın/güncelleme tarihi yok. BlogPosting'e bunlar eklenmedi. Gerçek editoryal kayıtlar edinildiğinde yazı bazında eklenmeli.
3. Vatandaşlık rehberinde resmî kaynağın kontrol ayı görünüyor; avukat tarafından son hukuki gözden geçirme tarihi doğrulanmadı. Gerçek tarih ve inceleyen avukat bilgisi sağlandığında profiliyle birlikte eklenmeli.
4. Google Search Console ve Analytics verileri bu kod tabanında bulunmuyor. İndekslenme, Google'ın seçtiği canonical, gösterim, trafik ve sıralama sonuçları hakkında iddiada bulunulmuyor.

## Search Console teslimi

Önce `https://igalawfirm.com/sitemap.xml` gönderin. Ardından URL Denetimi'nde aşağıdaki adresleri ayrı ayrı inceleyin; canlı URL testi isteyin ve **Kullanıcı tarafından belirtilen canonical**, **Google tarafından seçilen canonical**, indekslenebilirlik, taranan HTML ve hreflang durumunu karşılaştırın:

- `https://igalawfirm.com/en/`
- `https://igalawfirm.com/tr/`
- `https://igalawfirm.com/zh/`
- `https://igalawfirm.com/ar/`
- `https://igalawfirm.com/en/turkish-citizenship-by-investment/`
- `https://igalawfirm.com/en/turkish-citizenship-by-investment-lawyer/`
- `https://igalawfirm.com/tr/yatirim-yoluyla-turk-vatandasligi/`
- `https://igalawfirm.com/tr/yatirim-yoluyla-turk-vatandasligi-avukati/`
- `https://igalawfirm.com/zh/tuerqi-touzi-ruji/`
- `https://igalawfirm.com/zh/tuerqi-touzi-ruji-lushi/`
- `https://igalawfirm.com/ar/turkish-citizenship-by-investment/`
- `https://igalawfirm.com/ar/turkish-citizenship-by-investment-lawyer/`
- `https://igalawfirm.com/en/blog/`
- `https://igalawfirm.com/en/blog/turkish-citizenship-by-investment-2026-legal-process-investment-options/`

TR/ZH/AR blog yazısı URL'lerinden birkaçını ayrıca denetleyin: Google'ın İngilizce asıl yazıyı canonical olarak kabul edip etmediğine bakın. Yeniden tarama ve indeksleme Google'ın takvimine bağlıdır; belirli bir sıralama veya görünürlük garantisi yoktur.

Kaynaklar: [Google title link önerileri](https://developers.google.com/search/docs/appearance/title-link), [çok dilli URL/hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions), [AI özellikleri ve SEO](https://developers.google.com/search/docs/appearance/ai-features), [Türkiye Cumhuriyeti Cumhurbaşkanlığı Yatırım Ofisi](https://www.invest.gov.tr/en/investmentguide/pages/acquiring-property-and-citizenship.aspx).
