# E-2 rehberi: TR / ZH / AR yayını

19 Kasım 2026. Onaylanmış İngilizce rehber bütünüyle Türkçe, Basitleştirilmiş Çince ve Arapçaya çevrildi. Yazar dört dilde Irmak Gürer Aksöz; mevcut profil bağlantısı, fotoğraf ve unvan kullanıldı. Hukuki incelemeyi yapan kişi veya tarih hakkında yeni bir iddia eklenmedi.

## Kapsam

- `e2-visa-post.js`: Üç tam çeviri (her biri 176 içerik bloğu, 239 çeviri birimi, iki tablo ve 10 SSS), yerelleştirilmiş başlık/açıklama ve dil bazlı içerik kaydı. Her dilde yedi dahili bağlantı ve dokuz resmî kaynak bağlantısı korunmuştur.
- `generate-static.js`: E-2 modülünün yalnızca yeni dil sürümlerinde ve ilgili blog listelerinde yüklenmesi için mevcut koşul genişletildi. İngilizce sekiz mevcut geri bağlantının kapsamı korunmuştur.
- `seo-config.json`: Üç yeni sayfanın SEO/BlogPosting verisi; yalnızca mevcut İngilizce E-2 rehberine üç karşılıklı hreflang eklendi.
- `article-content-history.json`: Üç yeni çevirinin kayıtları. Önceki kayıtlar ve tarihleri aynen korundu.
- `review/e2-translations-20261119/`: Tam önizlemeler ve doğrulama raporları.

## Doğrulama

- Üretim derlemesi: 253 canonical sayfa ve 253 sitemap kaydı.
- Yapılandırılmış veri testleri: 26/26.
- JavaScript sözdizimi ve `git diff --check`: geçti.
- Dört dilde 1440 ve 390 piksel: sekiz görünüm kontrol edildi; yatay sayfa taşması yok. Arapça RTL, yazar bağlantıları ve tablolar doğrulandı.
- 28 dahili bağlantı: canlı HTTP 200, yönlendirmesiz, doğru self-canonical.
- Her dilde iki tablo ve 16 içerik bağlantısı; self-canonical ve beş alternate (dört dil + x-default).
- İngilizce makalenin gövdesi birebir aynı. Mevcut içerik tarihleri aynı. Mevcut SEO kayıtlarından yalnızca İngilizce E-2 rehberinin alternate alanı değişti.
- Mevcut canonical HTML sayfalarından sadece TR/ZH/AR blog listeleri ve EN E-2 rehberinin dil bağlantıları değişti; diğer 246 canonical sayfa birebir korundu. Yardımcı HTML dosyaları da değişmedi.
- Mevcut sitemap kayıtlarından sadece EN E-2 dil alternatifleri değişti; diğer 249 kayıt birebir korundu.
- Tarayıcıda önceden de bulunan `Missing related guide tr` hatası gözlendi. Hata mevcut `property-eligibility-post.js` kaynaklıdır; görev dışındaki bileşene müdahale edilmedi. Yeni E-2 içeriği, bağlantıları ve mobil görünümü doğrulandı.

## Hukuki anlamın korunması

Üç yıllık şart pasaportun yaşı olarak çevrilmedi. Finansal yatırımla vatandaşlık edinimi, daha önce E statüsü verilmemiş olması, başvuru öncesi kesintisiz üç yıllık domicile, önceki sürelerin kabulüne ilişkin belirsizlik, Türk taşınmazını satmama şartının ayrılığı, bağımsız ABD işletme yatırımı, Çin/Hindistan vatandaşlık sonuçları ve onay garantisi bulunmaması tüm çevirilerde korundu. Mevcut diğer dillerdeki makaleler değiştirilmedi.

Tam önizlemeler: `tr-preview.md`, `zh-preview.md`, `ar-preview.md`.
