# IGA Law Firm SEO/GEO uygulama raporu — 8 Ekim 2026

## Mevcut durum ve kapsam

Statik üretici 15 temel sayfayı ve 25 blog yazısını EN/TR/ZH/AR yollarında üretiyor: toplam 160 URL. 25 yazının gövdesi yalnızca İngilizce; dolayısıyla 75 TR/ZH/AR kopyası çevrilmiş sayılmıyor. Üretim öncesi envanter `SEO_INVENTORY_BEFORE.csv`, güncel çıktı `SEO_INVENTORY_AFTER.csv`; URL başına eski/yeni title, description, H1, canonical, hreflang, indeksleme ve sitemap durumu `SEO_GEO_URL_CHANGELOG.csv` dosyasında.

Canlı `www.igalawfirm.com` kontrolünde istek `https://igalawfirm.com/en/` adresine yönlendi ve yeni site HTML’i döndü. Bu doğrulama canlı URL yönlendirmesini gösterir; yerel değişikliklerin henüz deploy edildiğini göstermez. Web denetleyicisi canlı XML dosyalarını ve rehber sayfasını okuyamadı; sitemap/robots sonuçları bu nedenle üretilen yerel `dist` çıktısına göre raporlanıyor. DNS kayıtlarına dokunulmadı.

## Uygulananlar

- Temel sayfa türleri için EN/TR/ZH/AR ayrı, içerikle uyumlu title, meta description ve H1 tanımlandı. Blog title’ları arama görünümünde kısaltıldı; açıklamalar yazı gövdesindeki anlamlı ilk paragraftan üretiliyor.
- Vatandaşlık rehberi ve vatandaşlık avukatlığı sayfaları ayrı arama niyetlerine göre tutuldu. Rehberin başına doğrudan cevap özeti eklendi ve resmî Yatırım Ofisi kaynağına bağlandı. Kaynak kontrol tarihi sayfada gösteriliyor.
- 75 İngilizce gövdeli TR/ZH/AR blog kopyası İngilizce asıl URL’lerine canonical veriyor, `noindex,follow` taşıyor ve hreflang/sitemap dışında kalıyor. Bunları 301’e çevirmek yerine var olan URL’leri korumak seçildi; 301 gerektirecek içerik kararı ve eski bağlantı gereksinimi kanıtlanmadı.
- 60 özgün temel sayfanın canonical’ı kendine; EN/TR/ZH/AR alternate’ları karşılıklı ve `x-default` EN sürümüne gidiyor. Çince için `zh-CN`; HTML lang değerinde de `zh-CN` kullanılıyor. İngilizce blog yazılarında self-canonical, çevrilmemiş kopyalarda İngilizce canonical var.
- `/` için ülkeye/ziyaretçi IP’sine göre zorunlu dil seçimi yok. Vercel’de kararlı varsayılan `/en/` yönlendirmesi ve sayfada görünür dil menüsü korunuyor.
- Organization/WebSite ve uygun hizmet sayfalarında LegalService yapılandırılmış verisi kullanılıyor. Görünür sayfa ile doğrulanmamış adres, yazar, tam yayın tarihi, lisans veya ödül eklenmedi. Blog yazılarında mevcut kayıtlarda yalnızca yıl bulunduğundan yazar ve kesin tarih uydurulmadı.
- Vatandaşlık rehberindeki yatırım seçenekleri, tutarlar ve yetkili makam açıklamaları için [Invest in Türkiye’nin resmî rehberi](https://www.invest.gov.tr/en/investmentguide/pages/acquiring-property-and-citizenship.aspx) ve [Türkçe resmî sürüm](https://www.invest.gov.tr/tr/investmentguide/sayfalar/acquiring-property-and-citizenship.aspx) kaynak gösteriliyor. Program kuralları değişebileceği için yayına almadan önce avukatın güncel hukuki kontrolünü yapması gerekir.

## Üretim kontrolü

- JavaScript sözdizimi kontrolü ve `generate-static.js` başarılı: 160 HTML sayfası ve 85 sitemap URL’si üretildi.
- 85 indekslenebilir URL ve 75 `noindex` kopya; sitemap tam olarak canonical/indekslenebilir URL’leri içeriyor.
- Tüm 160 sayfada title, description, bir H1 ve ilk HTML yanıtında `<main>` içeriği var. İndekslenebilir sayfalarda title ve description değerleri benzersiz.
- 60 temel sayfada 5 hreflang girdisi var; alternate hedefleri mevcut ve karşılıklı. 100 blog URL’sinde hreflang yok; bunlardan 25 EN asıl yazı indekslenebilir, 75 dil kopyası noindex.
- Canonical alan adı her yerde `https://igalawfirm.com`; robots dosyası sitemap olarak `https://igalawfirm.com/sitemap.xml` bildiriyor. JSON-LD parse kontrolü, tek H1, canonical/sitemap uyumu ve hreflang hedefleri denetiminde 0 hata bulundu.
- Canlı tarama verisi, Google’ın seçtiği canonical, gösterim veya sıralama verisi bu çalışma alanında yok. Kod değişiklikleri indekslenmeyi garanti etmez.

## İçerik ekibinin doğrulaması gerekenler

1. EN/AR sayfaları ofis adresini Bebek, Beşiktaş; TR/ZH sayfaları Esentepe, Şişli olarak gösteriyor. Gerçek adres teyit edilene kadar adres ya da adres temelli yapılandırılmış veri değiştirilmedi.
2. Bloglar için gerçek yazar ve kesin yayın/güncelleme tarihleri mevcut veri kaydında yok. Editoryal kayıtlar geldikten sonra yazı bazında eklenebilir.
3. Vatandaşlık rehberindeki görünür resmî kaynak tarihi, avukatın inceleme tarihi değildir. Hukuki inceleme tarihi ve inceleyen kişinin adı doğrulanırsa ayrıca belirtilmeli.

## Google Search Console teslimi

Önce `https://igalawfirm.com/sitemap.xml` gönderin. URL Denetimi’nde canlı testi çalıştırıp kullanıcı canonical’ı, Google canonical’ı, indekslenebilirlik ve taranan HTML’i karşılaştırın. İlk kontrol listesi:

- `https://igalawfirm.com/en/`, `/tr/`, `/zh/`, `/ar/`
- `https://igalawfirm.com/en/turkish-citizenship-by-investment/`
- `https://igalawfirm.com/en/turkish-citizenship-by-investment-lawyer/`
- `https://igalawfirm.com/tr/yatirim-yoluyla-turk-vatandasligi/`
- `https://igalawfirm.com/tr/yatirim-yoluyla-turk-vatandasligi-avukati/`
- `https://igalawfirm.com/zh/tuerqi-touzi-ruji/` ve `/zh/tuerqi-touzi-ruji-lushi/`
- Arapça vatandaşlık rehberi ve avukatlık sayfaları: `https://igalawfirm.com/ar/turkish-citizenship-by-investment/` ve `https://igalawfirm.com/ar/turkish-citizenship-by-investment-lawyer/`
- `https://igalawfirm.com/en/blog/` ve `https://igalawfirm.com/en/blog/turkish-citizenship-by-investment-2026-legal-process-investment-options/`

İngilizce gövdeli bir blog kopyasını da seçip Google’ın İngilizce canonical’ı tanıdığını kontrol edin. Tekrar tarama isteği göndermek mümkün olsa da sonuç ve zamanlama Google’a bağlıdır.

Kaynaklar: [Google title link yönergeleri](https://developers.google.com/search/docs/appearance/title-link), [Google çok dilli sayfa yönergeleri](https://developers.google.com/search/docs/specialty/international/localized-versions), [Google AI özellikleri ve SEO](https://developers.google.com/search/docs/appearance/ai-features), [Invest in Türkiye resmî vatandaşlık rehberi](https://www.invest.gov.tr/en/investmentguide/pages/acquiring-property-and-citizenship.aspx).
