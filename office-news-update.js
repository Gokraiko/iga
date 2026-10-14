// The office announcement already exists in the archive. Keep its URL and
// localized bodies while updating the cover and list formatting in one place.
{
  const slug = 'iga-law-firm-is-growing-a-new-chapter-at-our-new-office';
  const post = window.blogPostContent?.[slug];
  if (post) {
    post.heroImage = '/public/assets/bebek-new-office-2026.avif';
    for (const index of [6, 7, 8, 9, 18, 19, 20, 21, 22, 23, 24, 25]) {
      if (post.blocks[index]) post.blocks[index].type = 'list';
    }
  }
  const localized = window.blogPostTranslations;
  if (localized) {
    const titles = {
      tr: 'IGA Hukuk Bürosu Büyüyor: Bebek’teki Yeni Ofisimiz',
      zh: 'IGA 律师事务所迈入新篇章：贝贝克新办公室',
      ar: 'مكتب IGA للمحاماة ينمو: فصل جديد في مكتبنا الجديد'
    };
    const seoTitles = {
      tr: 'IGA Hukuk Bürosu Bebek’te Yeni Ofisini Açtı | İstanbul',
      zh: 'IGA 律师事务所伊斯坦布尔贝贝克新办公室',
      ar: 'مكتب IGA للمحاماة الجديد في بيبك، إسطنبول'
    };
    const descriptions = {
      tr: 'IGA Hukuk Bürosu’nun İstanbul Bebek’teki yeni ofisini, dört avukattan oluşan ekibini ve vatandaşlık, yatırım ile özel hukuk hizmetlerini tanıyın.',
      zh: '了解 IGA 律师事务所位于伊斯坦布尔贝贝克的新办公室、四名律师组成的团队，以及入籍、投资和私法服务。',
      ar: 'تعرّف على مكتب IGA للمحاماة الجديد في بيبك بإسطنبول وفريقه المكوّن من أربعة محامين وخدماته في الجنسية والاستثمار والقانون الخاص.'
    };
    for (const lang of ['tr', 'zh', 'ar']) {
      const item = localized[lang]?.[slug];
      if (!item) continue;
      item.title = titles[lang];
      item.seoTitle = seoTitles[lang];
      item.metaDescription = descriptions[lang];
      for (const index of [6, 7, 8, 9, 18, 19, 20, 21, 22, 23, 24, 25]) {
        if (item.blocks[index]) item.blocks[index].type = 'list';
      }
      item.imageAlts = {...item.imageAlts, [post.heroImage]: titles[lang]};
    }
    const ar = localized.ar?.[slug];
    if (ar) for (const block of ar.blocks) block.text = block.text.replaceAll('شركة IGA للمحاماة', 'مكتب IGA للمحاماة').replaceAll('شركة IGA Law Firm', 'مكتب IGA للمحاماة');
    const tr = localized.tr?.[slug];
    if (tr) {
      tr.blocks[27].text = 'Bebek’teki Yeni Konak Ofisimizde Bizi Ziyaret Edin';
      tr.blocks[28].text = 'Bebek’teki yeni ofisimiz, Türk ve uluslararası müvekkillerimizi ağırlamak için mahremiyete önem veren, rahat ve profesyonel bir ortam sunan seçkin bir konakta yer alıyor.';
      tr.blocks[31].text = 'Bir sonraki adımınızı güvenle atın.';
    }
    const zh = localized.zh?.[slug];
    if (zh) {
      zh.blocks[0].text = '我们很高兴地宣布，IGA 律师事务所已开始在新办公室接待客户。办公室位于伊斯坦布尔享有国际知名度的贝贝克区一栋雅致宅邸内。';
      zh.blocks[1].text = '自 2018 年起，我们为希望在土耳其投资、居住和申请国籍的土耳其及国际客户提供法律咨询与代理。截至目前，我们已协助来自世界各地的 600 多个家庭办理投资及土耳其入籍事宜，其中不少家庭来自中国。';
      zh.blocks[2].text = '贝贝克新办公室的启用不仅意味着地址变更，也体现了团队持续成长、国际业务经验不断积累，以及我们在专业、友好的环境中提供更全面法律服务的承诺。';
      zh.blocks[27].text = '欢迎来到我们位于贝贝克的新办公室';
      zh.blocks[28].text = '新办公室位于贝贝克一栋雅致宅邸内，为土耳其和国际客户提供兼顾私密性、舒适度与专业性的会面环境。';
      zh.blocks[31].text = '稳妥迈出下一步。';
    }
    if (ar) {
      ar.blocks[0].text = 'يسرّنا أن نعلن أن مكتب IGA للمحاماة بدأ استقبال العملاء في مكتبه الجديد، الواقع في مبنى أنيق في حي بيبك، أحد أحياء إسطنبول المرموقة والمعروفة دولياً.';
      ar.blocks[1].text = 'منذ عام 2018، نقدم المشورة والتمثيل القانوني للعملاء الأتراك والدوليين الراغبين في الاستثمار أو الإقامة أو الحصول على الجنسية في تركيا. وقد ساعدنا حتى اليوم أكثر من 600 عائلة من أنحاء العالم، ولا سيما من الصين، في إجراءات الاستثمار والجنسية التركية.';
      ar.blocks[2].text = 'مكتبنا الجديد في بيبك أكثر من مجرد تغيير للعنوان؛ فهو يعكس نمو فريقنا وتراكم خبرتنا الدولية والتزامنا بتقديم خدمات قانونية أوسع في بيئة مهنية ومرحبة.';
      ar.blocks[27].text = 'زورونا في مكتبنا الجديد في بيبك';
      ar.blocks[28].text = 'يقع مكتبنا الجديد في مبنى أنيق في بيبك، ويوفر مكاناً مريحاً ومهنياً يراعي الخصوصية لاستقبال عملائنا من تركيا وخارجها.';
      ar.blocks[31].text = 'اتخذوا خطوتكم التالية بثقة.';
    }
  }
}
