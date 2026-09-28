# IGA Law — WPBakery aktarım dosyaları

Bu klasörde WordPress sayfa içeriğine yapıştırılabilen WPBakery kısa kodları ve siteye özel CSS bulunur. Yapı, WPBakery’nin standart `[vc_row]`, `[vc_column]`, `[vc_custom_heading]`, `[vc_column_text]` ve `[vc_btn]` elemanlarını kullanır.

## Dosyalar

- `homepage-en.txt` — İngilizce ana sayfa
- `homepage-tr.txt` — Türkçe ana sayfa
- `homepage-zh.txt` — Çince ana sayfa
- `custom.css` — Üç sayfanın ortak görsel stilleri

## Kurulum

1. WordPress’te ilgili ana sayfayı açıp WPBakery Backend Editor’a geçin.
2. Sayfa içeriğini Text/Classic görünümünde açın ve ilgili `.txt` dosyasındaki kısa kodların tamamını yapıştırın. WPBakery sayfayı kaydedince kendi elemanlarına dönüştürür.
3. `custom.css` içeriğini **WPBakery Page Builder → General Settings → Custom CSS** alanına ya da child theme’in `style.css` dosyasına ekleyin.
4. Üretilen `public/assets/bosphorus-editorial.png` görselini WordPress Medya Kütüphanesi’ne yükleyin. Her dosyadaki `[vc_single_image image="0" ...]` alanında `0` yerine bu görselin ve portrelerin WordPress medya ek numaralarını girin.
5. Dil eklentinizin (WPML veya Polylang) çeviri eşlemesini kullanarak üç ana sayfayı birbirine bağlayın. Menü, header ve footer tema/çeviri eklentisi tarafında yönetilir.

Ana sayfa hero ve ekip portreleri kaynak sitedeki görsel adreslerini kullanır; bunları Medya Kütüphanesi’ne alırsanız dış kaynağa bağımlılık kalmaz. İngilizce ve Türkçe kaynak sayfalarda ofis adresi farklı göründüğünden, yayın öncesinde doğru adresi seçip tüm dillerde aynı hale getirin.

WPBakery’nin kısa kodları ve Raw HTML / Text Block kullanımı resmi dokümantasyonda açıklanmıştır: [Content elements](https://kb.wpbakery.com/docs/learning-more/content-elements/), [3rd-party shortcode kullanımı](https://kb.wpbakery.com/docs/faq/can-i-insert-3rd-party-shortcodes/).
