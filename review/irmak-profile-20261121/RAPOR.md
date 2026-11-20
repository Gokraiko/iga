# Irmak Gürer Aksöz — dört dilde mesleki profil

21 Kasım 2026. Uygulama ve yerel doğrulamalar tamamlandı. Üretime yayın, push veya merge yapılmadı.

## Mimari ve kapsam

Mevcut sitede bağımsız profil URL’si bulunmuyordu; Team sayfasındaki `#irmak-gurer-aksoz` bölümü kullanılıyordu. Mevcut `pathFor(lang,page,sub)` yapısı ile dört dilde `/team/irmak-gurer-aksoz/` oluşturuldu. Eski Team sayfaları ve bölüm kimlikleri kaldırılmadı. Başka avukat profili veya Çin semineri yazısı oluşturulmadı.

## Oluşturulan ve değiştirilen dosyalar

| Dosya | Değişiklik |
|---|---|
| attorney-profile.js (yeni) | Sağlanan EN/TR metinleri, eşdeğer ZH/AR çevirileri; profil şablonu, zaman çizelgesi, LinkedIn, mevcut makale/hizmet bağlantıları |
| attorney-profile.css (yeni) | Yalnızca `.irmak-profile` kapsamında mevcut renk ve yazı tiplerini kullanan masaüstü/mobil/RTL düzen |
| app.js | Profil route render işlemi; ana sayfa/Team/About kartındaki Irmak bağlantıları; mevcut hizmet ve makale yazar bağlantıları; seminer yazısı sonrasında tek profil bağlantısı |
| schema-content.js | Mevcut kişi kimliğinin yeni profile bağlanması; yeni ProfilePage, Person biyografik alanları ve breadcrumb |
| index.html | Yeni profil modülü ve CSS için şablon referansları (derlemede yalnızca profil sayfalarında tutulur) |
| generate-static.js | Dört yeni route, profil kaynakları ve portreli Open Graph; mevcut sitemap mekanizması kullanılır |
| seo-config.json | Dört yeni profil kaydı; mevcut kayıtlarda yalnızca Irmak Person.url alanı yeni profile bağlanır |
| review/irmak-profile-20261121/ | Rapor, metadata, test sonuçları, tam önizlemeler ve diff |

## Profil URL’leri ve metadata

Aşağıdaki adresler yayın için hazırlanmıştır; henüz canlı oldukları iddia edilmemektedir.

### EN

- URL: https://igalawfirm.com/en/team/irmak-gurer-aksoz/
- Meta title: Irmak Gürer Aksöz | Turkish Citizenship Lawyer | IGA
- Meta description: Meet Irmak Gürer Aksöz, founder of IGA Law Firm. Izmir Bar-registered attorney working in Turkish citizenship by investment and foreign nationals law since 2018.
- Yerel önizleme: http://localhost:8797/en/team/irmak-gurer-aksoz/

### TR

- URL: https://igalawfirm.com/tr/team/irmak-gurer-aksoz/
- Meta title: Av. Irmak Gürer Aksöz | IGA Law Firm Kurucu Avukatı
- Meta description: Av. Irmak Gürer Aksöz, İstanbul Üniversitesi mezunu ve İzmir Barosu'na kayıtlıdır. 2018'den beri yabancılar hukuku ve yatırım yoluyla vatandaşlık alanlarında çalışmaktadır.
- Yerel önizleme: http://localhost:8797/tr/team/irmak-gurer-aksoz/

### ZH

- URL: https://igalawfirm.com/zh/team/irmak-gurer-aksoz/
- Meta title: Irmak Gürer Aksöz 律师 | 土耳其投资入籍 | IGA Law Firm
- Meta description: 了解 IGA Law Firm 创始律师 Irmak Gürer Aksöz。自2018年起从事外国人法律事务及土耳其投资入籍相关法律工作。
- Yerel önizleme: http://localhost:8797/zh/team/irmak-gurer-aksoz/

### AR

- URL: https://igalawfirm.com/ar/team/irmak-gurer-aksoz/
- Meta title: المحامية Irmak Gürer Aksöz | الجنسية التركية بالاستثمار
- Meta description: تعرف على المحامية Irmak Gürer Aksöz، مؤسسة IGA Law Firm، والمسجلة في نقابة المحامين بإزمير، والتي تعمل في شؤون الأجانب والجنسية التركية عن طريق الاستثمار منذ عام 2018.
- Yerel önizleme: http://localhost:8797/ar/team/irmak-gurer-aksoz/

## Kimlik ve yapılandırılmış veri

- Dört dilde aynı mevcut `https://igalawfirm.com/#irmak-gurer-aksoz` Person kimliği korunur; makale author referansları değişmez.
- Her yeni profilin ProfilePage.mainEntity alanı bu Person kimliğine işaret eder.
- Mevcut `https://igalawfirm.com/#organization` kurumsal kimliği worksFor üzerinden kullanılır; ikinci bir IGA kuruluş kimliği oluşturulmaz.
- Yeni profillerde eğitim (Istanbul University), İzmir Barosu üyeliği, 14900 sicil numarası, Türkçe/İngilizce dilleri, çalışma alanları ve mevcut portre görünür içerikle uyumludur.
- LinkedIn adresi görünür bağlantı ve sameAs içinde tam olarak sağlandığı biçimde kullanılır. `target="_blank" rel="noopener noreferrer"`, ikon ve erişilebilir metin etiketi eklendi.
- Her dilde self-canonical, karşılıklı en/tr/zh-CN/ar ve x-default, bir H1, uygun HTML lang/dir ve portreli Open Graph mevcut.
- Her profil için Ana sayfa → Team → Irmak breadcrumb sırası kullanılır.
- Yeni yayın veya hukuki inceleme tarihi, sertifika, derece, ödül, yargıçlık görevi ya da doğrulanmamış üyelik eklenmedi.

## Fotoğraf ve bağlantılar

Ana sayfadaki `/public/assets/media/b7935952b6d8df3c.jpg` aynen yeniden kullanıldı. Orijinal 386×440 ölçüleri, yükseklik/genişlik bilgileri ve doğal oran korundu. Yeni görsel dosyası oluşturulmadı; diğer görseller değiştirilmedi.

Ana sayfa, Team ve About içindeki Irmak adı profile gider. Ana sayfadaki mevcut profil bağlantısı da güncellendi. Vatandaşlık avukatı hizmetinin dört dilindeki mevcut Irmak bağlantısı ve İngilizce gayrimenkul hukuki inceleme sayfasındaki “Meet Irmak” bağlantısı yeni profile yönlenir. Diğer avukat bağlantıları ve Editorial Team yazarlıkları korunur. Zaten Irmak’a atfedilen makalelerin görünür yazar bağlantıları güncellendi.

Profiller mevcut üç ilgili yazıya (E-2 rehberi, gayrimenkul yoluyla vatandaşlık rehberi, taşınmazın vatandaşlığa uygunluğu rehberi), iki hukuki hizmet sayfasına ve nötr iletişim CTA’sına bağlanır. Bağlantılar her dilde o dilin mevcut canonical adresini kullanır.

İngilizce profil mevcut İngilizce Çin seminerleri yazısına, Çince profil mevcut Çince seminer yazısına gider. Türkçe ve Arapça seminer yazısı mevcut olmadığından bu profillerde İngilizce yazıya, dil açıkça belirtilerek bağlantı verildi. İki mevcut seminer yazısının ana metnine dokunulmadan, yazı sonuna tek kısa profil bağlantısı eklendi. Fotoğraf galerileri ve blog metinleri kopyalanmadı.

## Çalıştırılan doğrulamalar

- Derleme: 257 yerelleştirilmiş sayfa ve 257 sitemap kaydı.
- Mevcut yapılandırılmış veri testleri: 26/26.
- Ek profil doğrulaması: dört profil, 253 mevcut sayfanın metadata/schema karşılaştırması; canonical/hreflang, kişi kimliği, kuruluş ilişkisi, LinkedIn eşitliği, görsel ölçüleri, tek H1 ve bağlantılar geçti.
- 253 mevcut sayfada başlıklar, açıklamalar, canonical, hreflang ve diğer SEO alanları aynı; JSON-LD’de yalnızca kurucunun url alanı güncellenir. Service ve Organization verileri korunur.
- Mevcut tüm makale gövdeleri ve article-content-history.json birebir aynı. Yayın ve güncelleme tarihleri değişmedi.
- Önceki 253 sitemap kaydı birebir aynı; dört profil eklendi. robots.txt, vercel.json, yönlendirmeler, mevcut blog slug listesi ve genel styles.css değişmedi.
- Dört dil × iki ekran genişliği (1440 ve 390): sekiz Chrome kontrolü. Yatay taşma yok; portre yükleniyor ve oranı doğru; dil menüsü aynı kişinin diğer dildeki profiline gidiyor; mobil menü çalışıyor.
- Mevcut 34 site bağlantısı canlıda HTTP 200, yönlendirmesiz ve doğru canonical ile doğrulandı.
- JavaScript sözdizimi ve git diff boşluk kontrolü tamamlandı.
- Yeni route’ların HTTP erişimi yerel sunucuda doğrulandı; üretimde yeni route doğrulaması henüz yapılmadı, çünkü yayınlanmadı.
- Schema.org ProfilePage ve Person tanımları incelendi; JSON ve kimlik tutarlılığı yerel testlerle doğrulandı. Google rich-result uygunluğu veya arama sıralaması iddia edilmez; harici Rich Results Test çalıştırılmadı.

## Manuel doğrulama / sınırlar

1. İzmir Barosu 14900, İstanbul Üniversitesi ve AİHM 2017–2018 stajı, kullanıcının sağladığı biyografik bilgiler temel alınarak işlendi. Diploma, baro kaydı ve staj belgesi bağımsız olarak doğrulanmadı.
2. LinkedIn URL’si aynen eklendi; otomatik istek HTTP 999 ile engellendi. Hesabın içeriği ve oturum açılmış tarayıcıda erişimi manuel doğrulanmalıdır.
3. TBB’nin güncel yayımladığı Reklam Yasağı Yönetmeliğinin özellikle 7(d) ve 7(e) hükümleri incelendi. Profilin seminer anlatımı, LinkedIn dış bağlantısı ve arama motoru sunumunun meslek kurallarına uygunluğu yayın öncesi avukat tarafından değerlendirilmelidir. Bu çalışma hukuki uygunluk onayı değildir; başarı, üstünlük veya sıralama vaadi eklenmedi.
4. Tarayıcıda mevcut `Missing related guide tr` hatası yine gözlendi; önceki üretim sürümünde bulunan property-eligibility-post.js kaynaklı bu hata görev kapsamı dışında bırakıldı. Profilin statik içeriği, görseli, dil ve mobil menü işlevleri testleri geçti.

Resmî referanslar:
- https://d.barobirlik.org.tr/mevzuat/avukata_ozel/yonetmelikler/2011/reklam_yas_yon.pdf
- https://schema.org/ProfilePage
- https://schema.org/Person

## Önizlemeler

`en-1440.png`, `tr-390.png`, `zh-1440.png`, `ar-390.png` ve diğer ekran görüntüleri bu klasördedir. Metadata/bağlantı ayrıntıları `validation.json`, `live-links.json` ve `browser.json` içindedir. `website-changes.patch` incelenebilir tam kaynak farkıdır.
