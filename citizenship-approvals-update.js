// Refresh the existing 2025 client milestone story; keep its established URL and last position.
{
  const slug = 'success-stories-newly-approved-turkish-citizenship-turkish-id-cards';
  const imagePaths = [1, 2, 3, 4].map(i => `/public/assets/citizenship-approval-sample-${i}.avif`);
  const guideUrls = {
    en: 'https://igalawfirm.com/en/blog/step-by-step-guide-turkish-id-card-passport-appointment-after-citizenship-approval/',
    tr: 'https://igalawfirm.com/tr/blog/step-by-step-guide-turkish-id-card-passport-appointment-after-citizenship-approval/',
    zh: 'https://igalawfirm.com/zh/blog/step-by-step-guide-turkish-id-card-passport-appointment-after-citizenship-approval/',
    ar: 'https://igalawfirm.com/ar/blog/step-by-step-guide-turkish-id-card-passport-appointment-after-citizenship-approval/'
  };
  const copy = {
    en: {
      title: 'Celebrating Our Clients’ Success: Turkish Citizenship Approvals Are In!',
      seoTitle: 'Turkish Citizenship Approval Letters: Client Successes',
      metaDescription: 'See anonymized Turkish citizenship approval letter samples from IGA Law Firm client matters and learn the next steps for Turkish ID card and passport applications.',
      intro: 'IGA Law Firm is pleased to share a new milestone for clients whose Turkish citizenship applications have been approved. The approval letter marks the end of an important administrative stage and the beginning of the next steps in Türkiye.',
      samples: 'The four approval-letter samples accompanying this article are presented with personal information concealed to respect client privacy.',
      journeyH: 'A journey built on trust and careful preparation',
      journeyP: 'From the initial investment review to document preparation and application follow-up, our team worked alongside clients and their families. Each file required attention to the investor’s circumstances and the relevant official requirements.',
      timelineP: 'Some of the client cases described here reached approval in approximately six to seven months. Processing times vary and no individual application can be promised the same timeline or result.',
      letterH: 'What does a citizenship approval letter mean?',
      letterP: 'An approval letter confirms that the relevant citizenship decision has been issued. The recipient should follow the instructions of the competent authority and complete the civil-registration, Turkish ID card and passport steps that apply to their case.',
      guideP: 'For a practical explanation of the next stage, read our guide to Turkish ID card and passport appointments after citizenship approval.',
      guideLink: 'Read the Turkish ID card and passport appointment guide',
      thanksH: 'Thank you to our clients',
      thanksP: 'We thank our clients for placing their trust in IGA Law Firm and for cooperating throughout the application process. We congratulate everyone whose approval has arrived and look forward to supporting their next steps in Türkiye.',
      ending: 'Welcome to this new chapter in Türkiye.'
    },
    tr: {
      title: 'Müvekkillerimizin Başarısını Kutluyoruz: Türk Vatandaşlığı Onayları Geldi',
      seoTitle: 'Türk Vatandaşlığı Onay Yazıları: Müvekkil Örnekleri',
      metaDescription: 'IGA Hukuk Bürosu müvekkillerinin kişisel bilgileri gizlenmiş Türk vatandaşlığı onay yazısı örneklerini ve kimlik ile pasaport başvurusunda sonraki adımları görün.',
      intro: 'IGA Hukuk Bürosu, Türk vatandaşlığı başvuruları onaylanan müvekkilleri için önemli bir gelişmeyi paylaşmaktan memnuniyet duyuyor. Onay yazısı, idari sürecin önemli bir aşamasının tamamlandığını ve Türkiye’deki sonraki adımların başladığını gösterir.',
      samples: 'Bu yazıya eşlik eden dört onay yazısı örneğinde, müvekkil mahremiyetini korumak amacıyla kişisel bilgiler gizlenmiş olarak sunulmaktadır.',
      journeyH: 'Güven ve dikkatli hazırlıkla yürütülen bir süreç',
      journeyP: 'İlk yatırım değerlendirmesinden belge hazırlığına ve başvurunun takibine kadar ekibimiz müvekkillerimiz ve aileleriyle birlikte çalıştı. Her dosyada yatırımcının kişisel koşullarının ve ilgili resmî şartların dikkatle incelenmesi gerekti.',
      timelineP: 'Burada aktarılan bazı müvekkil dosyalarında onay yaklaşık altı ila yedi ayda geldi. İşlem süreleri değişir; hiçbir başvuru için aynı süre veya sonuç vaat edilemez.',
      letterH: 'Vatandaşlık onay yazısı ne anlama gelir?',
      letterP: 'Onay yazısı, ilgili vatandaşlık kararının verildiğini teyit eder. Yazıyı alan kişinin yetkili makamın talimatlarını izleyerek kendi durumuna uygun nüfus tescili, Türk kimlik kartı ve pasaport işlemlerini tamamlaması gerekir.',
      guideP: 'Sonraki aşamanın pratik açıklaması için vatandaşlık onayından sonra Türk kimlik kartı ve pasaport randevusu rehberimizi okuyabilirsiniz.',
      guideLink: 'Türk kimlik kartı ve pasaport randevu rehberini okuyun',
      thanksH: 'Müvekkillerimize teşekkür ederiz',
      thanksP: 'IGA Hukuk Bürosuna güvendikleri ve başvuru boyunca iş birliği yaptıkları için müvekkillerimize teşekkür ediyoruz. Onayı gelen herkesi kutluyor, Türkiye’deki sonraki adımlarında da yanlarında olmayı diliyoruz.',
      ending: 'Türkiye’deki yeni döneminiz hayırlı olsun.'
    },
    zh: {
      title: '庆祝客户取得土耳其国籍批准：最新申请成果',
      seoTitle: '土耳其国籍批准函样本与获批后身份证办理',
      metaDescription: '查看IGA律师事务所客户土耳其国籍批准函的隐去个人信息样本，了解获批后办理土耳其身份证和护照的下一步。',
      intro: 'IGA律师事务所很高兴分享客户土耳其国籍申请获批这一重要进展。批准函标志着一项重要行政阶段的完成，也开启了在土耳其的后续手续。',
      samples: '本文附有四份批准函样本，展示时隐去了个人资料，以尊重客户隐私。',
      journeyH: '以信任和细致准备为基础的历程',
      journeyP: '从最初的投资审查、文件准备到申请跟进，我们的团队与客户及其家人密切合作。每份申请都需要结合投资者的具体情况和相关官方要求进行审查。',
      timelineP: '本文所述部分客户案件约在六至七个月内获批。处理时间因个案而异，不能保证其他申请获得相同进度或结果。',
      letterH: '国籍批准函意味着什么？',
      letterP: '批准函确认有关国籍决定已作出。收件人应遵照主管机关指示，完成适用于本人情况的民事登记、土耳其身份证和护照手续。',
      guideP: '若需了解后续步骤，请阅读我们关于国籍获批后预约土耳其身份证和护照的指南。',
      guideLink: '阅读土耳其身份证及护照预约指南',
      thanksH: '感谢我们的客户',
      thanksP: '感谢客户对IGA律师事务所的信任，以及在整个申请过程中的配合。我们祝贺每一位获得批准的客户，并期待继续协助他们完成在土耳其的下一步。',
      ending: '欢迎开启在土耳其的新篇章。'
    },
    ar: {
      title: 'نحتفل بنجاح عملائنا: صدور موافقات الجنسية التركية',
      seoTitle: 'نماذج خطابات الموافقة على الجنسية التركية لعملائنا',
      metaDescription: 'اطّلع على نماذج خطابات الموافقة على الجنسية التركية بعد إخفاء البيانات الشخصية، وتعرّف على خطوات بطاقة الهوية والجواز بعد الموافقة.',
      intro: 'يسرّ مكتب IGA للمحاماة أن يشارك محطة مهمة لعملائنا الذين صدرت الموافقة على طلبات حصولهم على الجنسية التركية. يشير خطاب الموافقة إلى اكتمال مرحلة إدارية مهمة وبداية الخطوات التالية في تركيا.',
      samples: 'تُعرض مع هذا المقال أربع عينات من خطابات الموافقة بعد إخفاء البيانات الشخصية احتراماً لخصوصية العملاء.',
      journeyH: 'رحلة تقوم على الثقة والتحضير الدقيق',
      journeyP: 'من مراجعة الاستثمار الأولى إلى إعداد المستندات ومتابعة الطلب، عمل فريقنا إلى جانب العملاء وأسرهم. وتطلّب كل ملف مراعاة ظروف المستثمر والمتطلبات الرسمية ذات الصلة.',
      timelineP: 'وصلت الموافقة في بعض الحالات المذكورة هنا خلال نحو ستة إلى سبعة أشهر. تختلف مدد المعالجة بين الحالات، ولا يمكن التعهد بالمدة أو النتيجة نفسها لأي طلب آخر.',
      letterH: 'ماذا يعني خطاب الموافقة على الجنسية؟',
      letterP: 'يؤكد خطاب الموافقة صدور القرار المتعلق بالجنسية. وعلى من يتسلمه اتباع تعليمات الجهة المختصة واستكمال إجراءات التسجيل المدني وبطاقة الهوية التركية وجواز السفر المناسبة لحالته.',
      guideP: 'لشرح عملي للمرحلة التالية، اقرأ دليلنا لمواعيد بطاقة الهوية وجواز السفر التركي بعد الموافقة على الجنسية.',
      guideLink: 'اقرأ دليل مواعيد الهوية التركية وجواز السفر',
      thanksH: 'شكراً لعملائنا',
      thanksP: 'نشكر عملاءنا على ثقتهم بمكتب IGA للمحاماة وتعاونهم طوال إجراءات الطلب. ونهنئ كل من وصلته الموافقة، ونتطلع إلى دعم خطواتهم التالية في تركيا.',
      ending: 'مرحباً بكم في فصل جديد في تركيا.'
    }
  };
  const imageAlts = {
    en: imagePaths.map((_, i) => `Turkish citizenship approval letter sample ${i + 1}, with client details concealed`),
    tr: imagePaths.map((_, i) => `Kişisel bilgileri gizlenmiş Türk vatandaşlığı onay yazısı örneği ${i + 1}`),
    zh: imagePaths.map((_, i) => `已隐藏客户个人信息的土耳其国籍批准函样本 ${i + 1}`),
    ar: imagePaths.map((_, i) => `نموذج ${i + 1} لخطاب الموافقة على الجنسية التركية بعد إخفاء بيانات العميل`)
  };
  const p = text => ({ type: 'paragraph', text });
  const h = text => ({ type: 'heading', level: 2, text });
  function blocks(t, lang) {
    return [p(t.intro), p(t.samples), h(t.journeyH), p(t.journeyP), p(t.timelineP),
      h(t.letterH), p(t.letterP), p(t.guideP),
      { type: 'source', text: t.guideLink, url: guideUrls[lang] },
      h(t.thanksH), p(t.thanksP), p(t.ending)];
  }
  const post = window.blogPostContent?.[slug];
  if (post) {
    post.title = copy.en.title;
    post.blocks = blocks(copy.en, 'en');
    post.heroImage = imagePaths[0];
    post.images = imagePaths.map((src, i) => ({ src, alt: imageAlts.en[i] }));
  }
  if (window.blogPostTranslations) {
    for (const lang of ['tr', 'zh', 'ar']) {
      const t = copy[lang];
      window.blogPostTranslations[lang][slug] = {
        title: t.title, seoTitle: t.seoTitle, metaDescription: t.metaDescription,
        blocks: blocks(t, lang),
        imageAlts: Object.fromEntries(imagePaths.map((src, i) => [src, imageAlts[lang][i]]))
      };
    }
  }
}
