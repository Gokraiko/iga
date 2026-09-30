# Blog dil kopyaları: içerik ve SEO değerlendirmesi

Denetim tarihi: 30 Eylül 2026. Kaynak kodunda 25 İngilizce blog yazısı var. Her yazının TR, ZH ve AR URL'si bulunuyor; toplam 75 yazı kopyası. Üç blog liste sayfası bu sayıya dahil değil.

## URL sınıflandırması

1. **Ana gövdesi İngilizce kalan kopyalar: 75.** Üretilen sayfaların her birindeki `.article-content` metni İngilizce asıl yazı ile aynı. Yerel sayfa arayüzü, bazı H1/list başlıkları ve “yazının tam metni İngilizcedir” uyarısı yerelleştirilmiş; bunlar makalenin çevirisi sayılmaz.
2. **Gerçekten çevrilmiş yazı: 0.** Bu nedenle 75 URL'den hiçbiri hreflang kümesine alınmıyor.
3. **Eski/tekrarlı olma ihtimali incelenecek içerikler:** 2025 etiketi taşıyan 9 asıl yazının 27 yerel kopyası güncellik kontrolü adayı. İçerik karşılaştırmasında aynı gövdeye sahip yazı bulunmadı. Benzer konu kümeleri olası editoryal birleştirme adayıdır; kopya oldukları kanıtlanmış değildir.

Her 75 URL için kaynak İngilizce yazı, eski/yeni canonical, hreflang, indeksleme, sitemap ve yönlendirme değerleri [URL denetim CSV'sinde](./BLOG_LOCALIZED_URL_AUDIT.csv) bulunuyor.

## Önerilen içerik stratejisi

75 URL'yi şimdilik koru. TR/ZH/AR kopyalarının her biri İngilizce asıl yazıya canonical vermeli, `noindex,follow` taşımalı, hreflang kümesinin ve sitemap'in dışında kalmalı. Bu 75 URL için 301 kullanma. Search Console tıklama/gösterim ve harici bağlantı verisi elimizde olmadığı için bir URL'yi kaldırmanın arama trafiğine veya bağlantı değerine etkisini ölçemiyoruz. Koruma, eski bağlantıları çalışır tutar ve gerçek çeviri yayımlanıncaya kadar yanlış dil sinyali üretmez.

Bu sinyaller 75 URL'de önceki sürümde de doğruydu; bu denetim onları değiştirmedi. Kod tarafındaki tek işlev değişikliği, dil menüsünde çevrilmemiş bir yazı açıkken TR/ZH/AR seçildiğinde çevrilmemiş kopyaya yeni bir iç bağlantı vermek yerine ilgili yerel blog listesine gitmesidir. İngilizce seçimi yazının asıl sayfasını açar. Eski yerel URL'lere doğrudan gelen ziyaretçiler sayfayı hâlâ açabilir ve İngilizce tam metin uyarısını görür.

Gerçek bir çeviri ileride yayımlanırsa, ana makale gövdesi ve hukuki terimleri hedef dilde gözden geçirildikten sonra o URL kendi kendine canonical verip karşılıklı hreflang kümesine alınabilir. Sadece başlık ve şablon çevirisi bu şartı karşılamaz.

## Güncellik ve konu örtüşmesi için editoryal inceleme

2025 olarak etiketlenmiş kaynak yazılar (her biri üç dil kopyasıyla birlikte inceleme adayı):

- `iga-law-firm-is-growing-a-new-chapter-at-our-new-office` — ofis bilgisi hâlâ güncel mi?
- `step-by-step-guide-turkish-id-card-passport-appointment-after-citizenship-approval` — randevu süreci/işleyiş güncel mi?
- `turkish-citizenship-through-bes-a-secure-path-for-foreign-investors` — BES program ayrıntıları güncel mi?
- `turkish-citizenship-by-bank-deposit-2025-complete-and-detailed-process-guide` — mevduat süreci ve koşulları güncel mi?
- `crs-reporting-in-turkey-turkish-citizenship-by-investment-what-investors-should-know` — vergi ve CRS açıklamaları hukukçu tarafından yeniden doğrulanmalı.
- `turkish-citizenship-by-bank-deposit-real-case-study-after-3-years-500-000-usd-600-000-usd` — vaka ve rakamların yayımlanma izni/bağlamı teyit edilmeli.
- `2025-tl-deposit-usd-yield-full-return-analysis-for-foreign-investors-exiting-kkm-in-february-2025` — tarihsel analiz olarak etiketlenmesi uygun olabilir.
- `turkey-china-immigration-investment-cooperation` — haber niteliği ve işbirliği bilgisinin hâlâ geçerliliği kontrol edilmeli.
- `success-stories-newly-approved-turkish-citizenship-turkish-id-cards` — vaka/başarı iddiaları için güncel doğrulama ve yayın izni kontrolü.

Benzer konu içeren yazılar: Çinli başvuranların belge rehberi ile doğum belgesi olmayan başvurular; BES/Allianz stratejisi ve fon yapısı; mevduat rehberleri ile getiri vaka analizleri; gayrimenkul seçimi, İstanbul bölgeleri ve üç yıl sonrası satış. Gövde karşılaştırması bu yazıların aynı metin olduğunu göstermiyor. Birleştirme/301 için içerik sorumlusu, kaynaklar ve Search Console verileri incelenmeli.

## Doğrulanmış teknik sonuçlar

- Her yerel kopya ilk HTML'de tek H1, `<main>`, makalenin İngilizce gövdesi ve yerel dil uyarısı içeriyor.
- Her canonical ilgili `/en/blog/{slug}/` URL'sine gidiyor; English article URL'si sitemap'te canonical olarak yer alıyor.
- 75 kopyada `noindex,follow` var; hreflang yok; sitemap'e eklenmemiş; URL'yi İngilizce asla yönlendiren 301 yok.
- Sitemap 85 URL içeriyor (60 temel dil sayfası ve 25 İngilizce asıl makale). `robots.txt`, sitemap yolunu bildiriyor ve blog kopyalarını engellemiyor.
- JSON-LD makale canonical'ı ile eşleşiyor; doğrulanmamış yazar veya kesin yayın tarihi eklenmiyor.

Vatandaşlık rehberindeki yatırım tutarları ve yedi uygunluk kurumu, resmî [İngilizce program sayfası](https://www.invest.gov.tr/en/investmentguide/pages/acquiring-property-and-citizenship.aspx) ve [Türkçe program sayfası](https://www.invest.gov.tr/tr/investmentguide/sayfalar/acquiring-property-and-citizenship.aspx) ile kontrol edildi: gayrimenkul için USD 400.000, diğer uygunluk yollarının ilgili olanlarında USD 500.000, istihdam için 50 kişi ve ilgili üç yıllık tutma/şerh koşulları sayfadaki resmî açıklamayla uyumlu. Rehber sayfaları kaynağı ve Eylül 2026 kontrol ayını görünür gösteriyor. Bu kontrol blog kopyalarını çevirmez ve blog içeriklerine yeni hukuki iddia eklemez.

## Karar bekleyen noktalar

- 2025 kaynak yazılarını güncelleme, tarihsel olarak arşivleme veya birleştirme kararları içerik/hukuk ekibine ait.
- Gerçek çeviri üretimi ve yayın önceliği editoryal kaynak gerektiriyor. Çin odaklı mevcut içerik nedeniyle ZH ilk aday, ardından TR; AR önceliği GSC verisiyle belirlenebilir.
- 301 kararı ancak Search Console performansı, geri bağlantılar ve içerik sorumlusu incelemesinden sonra verilmelidir.
- İndekslenme, sıralama ya da yapay zekâ sistemlerinde gösterim garantisi verilmez.
