// Registration identifiers supplied by the firm. TBB public lookup checked 2026-11-25:
// IRMAK GÜRER, Izmir 14900, TBB 154273. No admission date was displayed.
window.igaProfessionalRegistration = (() => {
 const lookupUrl='https://www.barobirlik.org.tr/AvukatArama/';
 const records={
  "irmak-gurer-aksoz": {
    "barRegistrationNumber": "14900",
    "tbbRegistrationNumber": "154273",
    "jurisdiction": "TR"
  },
  "dilan-caman": {
    "barRegistrationNumber": "66974",
    "jurisdiction": "TR"
  },
  "latife-kucukalpelli": {
    "barRegistrationNumber": "84410",
    "jurisdiction": "TR"
  },
  "idil-dengiz-bucak": {
    "barRegistrationNumber": "7922",
    "jurisdiction": "TR"
  }
};
 const labels={
  "en": {
    "bar": "Bar Association",
    "number": "Bar Registration No.",
    "tbb": "Union of Turkish Bar Associations (TBB) Registration No.",
    "jurisdiction": "Jurisdiction",
    "country": "Türkiye",
    "admission": "Professional Admission Date",
    "heading": "Attorney Registration Verification",
    "explanation": "Professional registration can be checked through the official Union of Turkish Bar Associations attorney directory.",
    "link": "Verify Attorney Registration via TBB",
    "practice": "Advises international clients on Turkish citizenship by investment, foreign nationals law and real estate transactions."
  },
  "tr": {
    "bar": "Kayıtlı Olduğu Baro",
    "number": "Baro Sicil No",
    "tbb": "Türkiye Barolar Birliği (TBB) Sicil No",
    "jurisdiction": "Mesleki Yetki Alanı",
    "country": "Türkiye",
    "admission": "Mesleğe Başlama Tarihi",
    "heading": "Avukat Sicil Kaydı Sorgulama",
    "explanation": "Mesleki kayıt bilgileri Türkiye Barolar Birliğinin resmî avukat arama hizmetinden sorgulanabilir.",
    "link": "TBB Üzerinden Avukat Sicil Kaydını Sorgula",
    "practice": "Uluslararası müvekkillere yatırım yoluyla Türk vatandaşlığı, yabancılar hukuku ve gayrimenkul işlemleri hakkında danışmanlık verir."
  },
  "zh": {
    "bar": "注册律师协会",
    "number": "律师协会注册编号",
    "tbb": "土耳其律师协会联盟（TBB）注册编号",
    "jurisdiction": "执业司法辖区",
    "country": "土耳其",
    "admission": "取得律师执业资格日期",
    "heading": "律师执业注册信息查询",
    "explanation": "可通过土耳其律师协会联盟官方律师名录查询执业注册信息。",
    "link": "通过 TBB 查询律师执业注册信息",
    "practice": "为国际客户提供土耳其投资入籍、外国人法律事务及房地产交易方面的法律咨询。"
  },
  "ar": {
    "bar": "نقابة المحامين",
    "number": "رقم التسجيل في نقابة المحامين",
    "tbb": "رقم التسجيل في اتحاد نقابات المحامين التركية (TBB)",
    "jurisdiction": "نطاق الممارسة القضائي",
    "country": "تركيا",
    "admission": "تاريخ بدء ممارسة المحاماة",
    "heading": "التحقق من تسجيل المحامي",
    "explanation": "يمكن الاستعلام عن التسجيل المهني عبر دليل المحامين الرسمي لاتحاد نقابات المحامين التركية.",
    "link": "الاستعلام عن تسجيل المحامي عبر TBB",
    "practice": "تقدم المشورة للعملاء الدوليين بشأن الجنسية التركية عن طريق الاستثمار وقانون الأجانب والمعاملات العقارية."
  }
};
 const get=slug=>records[slug];
 function rows(slug,lang,bar){
  const p=get(slug),l=labels[lang];if(!p)return [];
  return [[l.bar,bar],[l.number,p.barRegistrationNumber],...(p.tbbRegistrationNumber?[[l.tbb,p.tbbRegistrationNumber]]:[]),...(p.jurisdiction?[[l.jurisdiction,l.country]]:[]),...(p.professionalAdmissionDate?[[l.admission,p.professionalAdmissionDate]]:[])];
 }
 function verification(slug,lang,esc){
  if(!get(slug))return '';const l=labels[lang];
  return `<div class="professional-verification"><h3>${esc(l.heading)}</h3><p>${esc(l.explanation)}</p><p><a href="${get(slug).officialVerificationUrl||lookupUrl}" target="_blank" rel="noopener noreferrer">${esc(l.link)}</a></p></div>`;
 }
 function identifiers(slug,bar){
  const p=get(slug);if(!p)return [];
  return [{'@type':'PropertyValue',propertyID:'Bar Registration Number',value:p.barRegistrationNumber,description:bar+' registration number'},...(p.tbbRegistrationNumber?[{'@type':'PropertyValue',propertyID:'TBB Registration Number',value:p.tbbRegistrationNumber,description:'Union of Turkish Bar Associations registration number'}]:[])];
 }
 return {get,labels,rows,verification,identifiers,lookupUrl};
})();
// Factual biography supplied by the firm; no additional credentials inferred.
window.irmakProfile = (() => {
 const slug="irmak-gurer-aksoz";
 const copy={
  "en": {
    "h1": "Irmak Gürer Aksöz",
    "role": "Founder & Attorney at Law",
    "intro": [
      "Irmak Gürer Aksöz is a Turkish attorney and the founder of IGA Law Firm, established in 2022.",
      "A graduate of Istanbul University, she is registered with the Izmir Bar Association under registration number {barRegistrationNumber}.",
      "European Court of Human Rights (ECtHR) — Study Work, Strasbourg, France (2017).",
      "Since 2018, she has worked in legal matters concerning foreign nationals, with a particular focus on Turkish citizenship by investment.",
      "Her professional practice involves advising foreign individuals and international investors on the legal requirements, documentation and procedures associated with acquiring Turkish citizenship through investment.",
      "In 2022, she founded IGA Law Firm, where she continues her work in citizenship law and legal matters concerning foreign nationals."
    ],
    "sections": [
      {
        "title": "Professional Background",
        "paragraphs": [
          "Her legal practice focuses on assisting international clients with the legal requirements and procedures involved in Turkish citizenship by investment."
        ]
      },
      {
        "title": "International Professional Activities",
        "paragraphs": [
          "In November 2026, Irmak Gürer Aksöz delivered presentations during professional seminars held in Beijing, Hangzhou, Shanghai and Shenzhen.",
          "The seminars addressed Turkish citizenship by investment, property-related legal considerations and legal procedures relevant to international investors.",
          "These activities form part of her professional engagement with individuals considering investment and citizenship-related legal procedures in Türkiye."
        ]
      },
      {
        "title": "Areas of Practice",
        "paragraphs": [
          "- Turkish Citizenship by Investment\n- Turkish Citizenship Law\n- Foreign Nationals Law\n- Legal Procedures Related to Investment-Based Citizenship Applications"
        ]
      },
      {
        "title": "Education and Professional Registration",
        "paragraphs": [
          "**Education:** Istanbul University",
          "**Bar Association:** Izmir Bar Association",
          "**Registration Number:** {barRegistrationNumber}",
          "**Professional Practice:** Foreign nationals law and citizenship by investment since 2018",
          "**Founder:** IGA Law Firm (2022)",
          "**Languages:** Turkish and English"
        ]
      },
      {
        "title": "Legal Assistance for International Clients",
        "paragraphs": [
          "IGA Law Firm provides legal assistance to foreign nationals concerning Turkish citizenship by investment and related legal procedures.",
          "International clients may contact the firm to discuss their circumstances, applicable legal requirements and the appropriate scope of legal representation."
        ]
      }
    ],
    "areas": [
      "Turkish Citizenship by Investment",
      "Turkish Citizenship Law",
      "Foreign Nationals Law",
      "Legal Procedures Related to Investment-Based Citizenship Applications"
    ],
    "facts": [
      [
        "Education",
        "Istanbul University"
      ],
      [
        "Bar Association",
        "Izmir Bar Association"
      ],
      [
        "Registration Number",
        "{barRegistrationNumber}"
      ],
      [
        "International Legal Experience",
        "European Court of Human Rights (ECtHR) — Study Work, Strasbourg, France (2017)."
      ],
      [
        "Professional Practice",
        "Foreign nationals law and citizenship by investment since 2018"
      ],
      [
        "Founder",
        "IGA Law Firm (2022)"
      ],
      [
        "Languages",
        "Turkish and English"
      ]
    ],
    "title": "Irmak Gürer Aksöz | Turkish Citizenship Lawyer | IGA",
    "description": "Meet Irmak Gürer Aksöz, founder of IGA Law Firm. Izmir Bar-registered attorney working in Turkish citizenship by investment and foreign nationals law since 2018.",
    "alt": "Irmak Gürer Aksöz, Founder and Attorney at Law at IGA Law Firm",
    "linkedinLabel": "LinkedIn Profile",
    "profileLabel": "Professional profile",
    "timelineTitle": "Professional Timeline",
    "timeline": [
      "European Court of Human Rights (ECtHR) — Study Work, Strasbourg, France",
      "Beginning of professional work in foreign nationals law and Turkish citizenship by investment",
      "Founded IGA Law Firm",
      "Professional seminars and presentations in Beijing, Hangzhou, Shanghai and Shenzhen"
    ],
    "seminarLabel": "IGA Law Firm’s 2026 China Investment and Citizenship Seminars",
    "articlesTitle": "Published Legal Articles",
    "servicesTitle": "Related Legal Services",
    "serviceLabels": [
      "Turkish citizenship by investment legal assistance",
      "Real estate legal due diligence"
    ],
    "reverseLabel": "Learn more about Irmak Gürer Aksöz and her professional background.",
    "jobTitle": "Founding Attorney"
  },
  "tr": {
    "h1": "Av. Irmak Gürer Aksöz",
    "role": "Kurucu Avukat",
    "intro": [
      "Av. Irmak Gürer Aksöz, 2022 yılında kurulan IGA Law Firm'in kurucusu ve İzmir Barosu'na kayıtlı bir avukattır.",
      "İstanbul Üniversitesi mezunu olan Aksöz, İzmir Barosu'nun {barRegistrationNumber} sicil numaralı üyesidir.",
      "Avrupa İnsan Hakları Mahkemesi (AİHM) — İnceleme çalışması (Study Work), Strazburg, Fransa (2017).",
      "2018 yılından bu yana yabancılar hukuku alanında çalışmakta olup mesleki faaliyetlerini özellikle yatırım yoluyla Türk vatandaşlığının kazanılması süreçleri üzerinde yoğunlaştırmaktadır.",
      "Yabancı gerçek kişilere ve uluslararası yatırımcılara, yatırım yoluyla Türk vatandaşlığının kazanılmasına ilişkin hukuki şartlar, başvuru prosedürleri ve ilgili yasal süreçler hakkında hukuki danışmanlık sunmaktadır.",
      "2022 yılında IGA Law Firm'i kurarak vatandaşlık hukuku ve yabancılar hukukuna ilişkin çalışmalarını kendi hukuk bürosu çatısı altında sürdürmeye başlamıştır."
    ],
    "sections": [
      {
        "title": "Mesleki Geçmiş",
        "paragraphs": [
          "Çalışmaları, yabancı yatırımcıların Türk vatandaşlığına ilişkin yasal şartları, gerekli belgeleri ve başvuru süreçlerini değerlendirmelerine yönelik hukuki danışmanlığı kapsamaktadır."
        ]
      },
      {
        "title": "Uluslararası Mesleki Faaliyetler",
        "paragraphs": [
          "Av. Irmak Gürer Aksöz, Kasım 2026'da Çin'in Pekin (Beijing), Hangzhou, Şanghay (Shanghai) ve Shenzhen şehirlerinde gerçekleştirilen mesleki seminerlerde sunumlar yapmıştır.",
          "Bu etkinliklerde Türkiye'de yatırım yoluyla vatandaşlık, gayrimenkul yatırımlarına ilişkin hukuki konular ve uluslararası yatırımcıların dikkate alması gereken yasal süreçler ele alınmıştır.",
          "Etkinliklerin ayrıntıları ve fotoğrafları IGA Law Firm'in mevcut Çin seminerleri blog yazısında bulunmaktadır."
        ]
      },
      {
        "title": "Çalışma Alanları",
        "paragraphs": [
          "- Yatırım Yoluyla Türk Vatandaşlığının Kazanılması\n- Türk Vatandaşlık Hukuku\n- Yabancılar Hukuku\n- Yatırım Yoluyla Vatandaşlık Başvurularına İlişkin Hukuki İşlemler"
        ]
      },
      {
        "title": "Eğitim ve Mesleki Bilgiler",
        "paragraphs": [
          "**Eğitim:** İstanbul Üniversitesi",
          "**Baro:** İzmir Barosu",
          "**Baro Sicil Numarası:** {barRegistrationNumber}",
          "**Mesleki Çalışmalar:** 2018 yılından bu yana yabancılar hukuku ve yatırım yoluyla vatandaşlık",
          "**IGA Law Firm Kuruluş Yılı:** 2022",
          "**Diller:** Türkçe ve İngilizce"
        ]
      },
      {
        "title": "Uluslararası Müvekkillere Hukuki Danışmanlık",
        "paragraphs": [
          "IGA Law Firm, yatırım yoluyla Türk vatandaşlığı kazanmak isteyen yabancılara ilgili mevzuat, başvuru şartları ve hukuki prosedürler hakkında danışmanlık sunmaktadır.",
          "Yatırım yoluyla vatandaşlık süreçlerine ilişkin hukuki değerlendirme talepleri için hukuk bürosuyla iletişime geçilebilir."
        ]
      }
    ],
    "areas": [
      "Yatırım Yoluyla Türk Vatandaşlığının Kazanılması",
      "Türk Vatandaşlık Hukuku",
      "Yabancılar Hukuku",
      "Yatırım Yoluyla Vatandaşlık Başvurularına İlişkin Hukuki İşlemler"
    ],
    "facts": [
      [
        "Eğitim",
        "İstanbul Üniversitesi"
      ],
      [
        "Baro",
        "İzmir Barosu"
      ],
      [
        "Baro Sicil Numarası",
        "{barRegistrationNumber}"
      ],
      [
        "Uluslararası Hukuk Deneyimi",
        "Avrupa İnsan Hakları Mahkemesi (AİHM) — İnceleme çalışması (Study Work), Strazburg, Fransa (2017)."
      ],
      [
        "Mesleki Çalışmalar",
        "2018 yılından bu yana yabancılar hukuku ve yatırım yoluyla vatandaşlık"
      ],
      [
        "IGA Law Firm Kuruluş Yılı",
        "2022"
      ],
      [
        "Diller",
        "Türkçe ve İngilizce"
      ]
    ],
    "title": "Av. Irmak Gürer Aksöz | IGA Law Firm Kurucu Avukatı",
    "description": "Av. Irmak Gürer Aksöz, İstanbul Üniversitesi mezunu ve İzmir Barosu'na kayıtlıdır. 2018'den beri yabancılar hukuku ve yatırım yoluyla vatandaşlık alanlarında çalışmaktadır.",
    "alt": "Avukat Irmak Gürer Aksöz, IGA Law Firm Kurucusu",
    "linkedinLabel": "LinkedIn Profili",
    "profileLabel": "Mesleki profil",
    "timelineTitle": "Mesleki Zaman Çizelgesi",
    "timeline": [
      "Avrupa İnsan Hakları Mahkemesi (AİHM) — İnceleme çalışması (Study Work), Strazburg, Fransa",
      "Yabancılar hukuku ve yatırım yoluyla Türk vatandaşlığı alanında mesleki çalışmaların başlangıcı",
      "IGA Law Firm'in kuruluşu",
      "Pekin, Hangzhou, Şanghay ve Shenzhen şehirlerinde mesleki seminerler ve sunumlar"
    ],
    "seminarLabel": "IGA Law Firm’in 2026 Çin yatırım ve vatandaşlık seminerleri (İngilizce)",
    "articlesTitle": "Yayımlanmış Hukuki Yazılar",
    "servicesTitle": "İlgili Hukuki Hizmetler",
    "serviceLabels": [
      "Yatırım yoluyla Türk vatandaşlığı için hukuki destek",
      "Gayrimenkul hukuki incelemesi"
    ],
    "reverseLabel": "Irmak Gürer Aksöz’ün mesleki geçmişi hakkında daha fazla bilgi edinin.",
    "jobTitle": "Kurucu Avukat"
  },
  "zh": {
    "h1": "Irmak Gürer Aksöz 律师",
    "role": "创始人及律师",
    "intro": [
      "Irmak Gürer Aksöz是一位土耳其律师，也是2022年成立的IGA Law Firm的创始人。",
      "她毕业于伊斯坦布尔大学，在伊兹密尔律师协会注册，执业登记号为{barRegistrationNumber}。",
      "欧洲人权法院（ECtHR）——研习（Study Work），法国斯特拉斯堡（2017年）。",
      "自2018年起，她从事涉及外国人的法律事务，尤其关注土耳其投资入籍。",
      "她的执业工作包括为外国个人和国际投资者提供有关通过投资取得土耳其国籍所需法律条件、文件及程序的咨询。",
      "2022年，她创立IGA Law Firm，并继续从事国籍法及外国人相关法律事务。"
    ],
    "sections": [
      {
        "title": "专业背景",
        "paragraphs": [
          "她的法律业务主要是协助国际客户了解土耳其投资入籍所涉及的法律要求和程序。"
        ]
      },
      {
        "title": "国际专业活动",
        "paragraphs": [
          "2026年11月，Irmak Gürer Aksöz在北京、杭州、上海和深圳举行的专业研讨会中发表了演讲。",
          "研讨会讨论了土耳其投资入籍、房地产相关法律问题以及国际投资者涉及的法律程序。",
          "这些活动是她与考虑在土耳其进行投资及办理国籍相关法律程序的人士开展专业交流的一部分。"
        ]
      },
      {
        "title": "执业领域"
      },
      {
        "title": "教育与执业登记"
      },
      {
        "title": "为国际客户提供法律协助",
        "paragraphs": [
          "IGA Law Firm就土耳其投资入籍及相关法律程序向外国人士提供法律协助。",
          "国际客户可与事务所联系，讨论其具体情况、适用法律要求及适当的法律代理范围。"
        ]
      }
    ],
    "areas": [
      "土耳其投资入籍",
      "土耳其国籍法",
      "外国人法",
      "投资入籍申请相关法律程序"
    ],
    "facts": [
      [
        "教育",
        "伊斯坦布尔大学"
      ],
      [
        "律师协会",
        "伊兹密尔律师协会"
      ],
      [
        "执业登记号",
        "{barRegistrationNumber}"
      ],
      [
        "国际法律经历",
        "欧洲人权法院（ECtHR）——研习（Study Work），法国斯特拉斯堡（2017年）。"
      ],
      [
        "专业工作",
        "自2018年起从事外国人法律事务及投资入籍"
      ],
      [
        "创立事务所",
        "IGA Law Firm（2022）"
      ],
      [
        "语言",
        "土耳其语及英语"
      ]
    ],
    "title": "Irmak Gürer Aksöz 律师 | 土耳其投资入籍 | IGA Law Firm",
    "description": "了解 IGA Law Firm 创始律师 Irmak Gürer Aksöz。自2018年起从事外国人法律事务及土耳其投资入籍相关法律工作。",
    "alt": "Irmak Gürer Aksöz，IGA Law Firm创始人及律师",
    "linkedinLabel": "LinkedIn个人资料",
    "profileLabel": "律师个人简介",
    "timelineTitle": "专业经历时间线",
    "timeline": [
      "欧洲人权法院（ECtHR）——研习（Study Work），法国斯特拉斯堡",
      "开始从事外国人法律事务及土耳其投资入籍工作",
      "创立IGA Law Firm",
      "在北京、杭州、上海和深圳参加专业研讨会并发表演讲"
    ],
    "seminarLabel": "IGA Law Firm 2026年中国投资与入籍法律讲座",
    "articlesTitle": "已发表的法律文章",
    "servicesTitle": "相关法律服务",
    "serviceLabels": [
      "土耳其投资入籍法律协助",
      "房地产法律尽职调查"
    ],
    "reverseLabel": "进一步了解Irmak Gürer Aksöz及其专业背景。",
    "jobTitle": "创始律师"
  },
  "ar": {
    "h1": "المحامية Irmak Gürer Aksöz",
    "role": "المؤسسة والمحامية",
    "intro": [
      "Irmak Gürer Aksöz محامية تركية ومؤسسة مكتب IGA Law Firm الذي تأسس عام 2022.",
      "تخرجت في جامعة إسطنبول، وهي مسجلة في نقابة المحامين بإزمير برقم قيد {barRegistrationNumber}.",
      "المحكمة الأوروبية لحقوق الإنسان (ECtHR) — أعمال دراسية (Study Work)، ستراسبورغ، فرنسا (2017).",
      "تعمل منذ عام 2018 في المسائل القانونية المتعلقة بالأجانب، مع تركيز خاص على الجنسية التركية عن طريق الاستثمار.",
      "تشمل ممارستها المهنية تقديم المشورة للأفراد الأجانب والمستثمرين الدوليين بشأن المتطلبات القانونية والوثائق والإجراءات المرتبطة باكتساب الجنسية التركية من خلال الاستثمار.",
      "أسست مكتب IGA Law Firm عام 2022، حيث تواصل عملها في قانون الجنسية والمسائل القانونية المتعلقة بالأجانب."
    ],
    "sections": [
      {
        "title": "الخلفية المهنية",
        "paragraphs": [
          "تركز ممارستها القانونية على مساعدة العملاء الدوليين في المتطلبات والإجراءات القانونية المتعلقة بالجنسية التركية عن طريق الاستثمار."
        ]
      },
      {
        "title": "الأنشطة المهنية الدولية",
        "paragraphs": [
          "في نوفمبر 2026، قدمت Irmak Gürer Aksöz عروضاً خلال ندوات مهنية أُقيمت في بكين وهانغتشو وشنغهاي وشنتشن.",
          "تناولت الندوات الجنسية التركية عن طريق الاستثمار والاعتبارات القانونية المتعلقة بالعقارات والإجراءات القانونية ذات الصلة بالمستثمرين الدوليين.",
          "تشكل هذه الأنشطة جزءاً من تواصلها المهني مع الأفراد الذين يدرسون الاستثمار والإجراءات القانونية المتعلقة بالجنسية في تركيا."
        ]
      },
      {
        "title": "مجالات الممارسة"
      },
      {
        "title": "التعليم والتسجيل المهني"
      },
      {
        "title": "المساعدة القانونية للعملاء الدوليين",
        "paragraphs": [
          "يقدم مكتب IGA Law Firm مساعدة قانونية للأجانب بشأن الجنسية التركية عن طريق الاستثمار والإجراءات القانونية المرتبطة بها.",
          "يمكن للعملاء الدوليين التواصل مع المكتب لمناقشة ظروفهم والمتطلبات القانونية المطبقة والنطاق المناسب للتمثيل القانوني."
        ]
      }
    ],
    "areas": [
      "الجنسية التركية عن طريق الاستثمار",
      "قانون الجنسية التركية",
      "قانون الأجانب",
      "الإجراءات القانونية المرتبطة بطلبات الجنسية عن طريق الاستثمار"
    ],
    "facts": [
      [
        "التعليم",
        "جامعة إسطنبول"
      ],
      [
        "النقابة",
        "نقابة المحامين بإزمير"
      ],
      [
        "رقم القيد",
        "{barRegistrationNumber}"
      ],
      [
        "الخبرة القانونية الدولية",
        "المحكمة الأوروبية لحقوق الإنسان (ECtHR) — أعمال دراسية (Study Work)، ستراسبورغ، فرنسا (2017)."
      ],
      [
        "الممارسة المهنية",
        "قانون الأجانب والجنسية عن طريق الاستثمار منذ عام 2018"
      ],
      [
        "تأسيس المكتب",
        "IGA Law Firm (2022)"
      ],
      [
        "اللغات",
        "التركية والإنجليزية"
      ]
    ],
    "title": "المحامية Irmak Gürer Aksöz | الجنسية التركية بالاستثمار",
    "description": "تعرف على المحامية Irmak Gürer Aksöz، مؤسسة IGA Law Firm، والمسجلة في نقابة المحامين بإزمير، والتي تعمل في شؤون الأجانب والجنسية التركية عن طريق الاستثمار منذ عام 2018.",
    "alt": "المحامية Irmak Gürer Aksöz، مؤسسة IGA Law Firm",
    "linkedinLabel": "الملف الشخصي على LinkedIn",
    "profileLabel": "الملف المهني",
    "timelineTitle": "المسار المهني",
    "timeline": [
      "المحكمة الأوروبية لحقوق الإنسان (ECtHR) — أعمال دراسية (Study Work)، ستراسبورغ، فرنسا",
      "بداية العمل المهني في قانون الأجانب والجنسية التركية عن طريق الاستثمار",
      "تأسيس IGA Law Firm",
      "ندوات وعروض مهنية في بكين وهانغتشو وشنغهاي وشنتشن"
    ],
    "seminarLabel": "ندوات IGA Law Firm للاستثمار والجنسية في الصين لعام 2026 (بالإنجليزية)",
    "articlesTitle": "المقالات القانونية المنشورة",
    "servicesTitle": "الخدمات القانونية ذات الصلة",
    "serviceLabels": [
      "المساعدة القانونية للجنسية التركية عن طريق الاستثمار",
      "الفحص القانوني للعقارات"
    ],
    "reverseLabel": "تعرّف إلى Irmak Gürer Aksöz وخلفيتها المهنية.",
    "jobTitle": "المحامية المؤسسة"
  }
};
 const registration=window.igaProfessionalRegistration.get(slug);
 for(const d of Object.values(copy)){
  const resolve=value=>typeof value==='string'?value.replaceAll('{barRegistrationNumber}',registration.barRegistrationNumber):Array.isArray(value)?value.map(resolve):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,resolve(v)])):value;
  Object.assign(d,resolve(d));
 }
 const image='/public/assets/media/b7935952b6d8df3c.jpg';
 const linkedIn='https://www.linkedin.com/in/irmak-g%C3%BCrer-aks%C3%B6z-509148155/';
 const personId='https://igalawfirm.com/#irmak-gurer-aksoz';
 const path=lang=>'/'+lang+'/team/'+slug+'/';
 for(const lang of Object.keys(copy))window.finalSeoMetadata[path(lang)]={title:copy[lang].title,description:copy[lang].description};
 function render(lang,{esc,pathFor,articles,articleTitle,team,t}){
  const d=copy[lang],portrait=team.find(m=>m.name==='Irmak Gürer Aksöz').img;
  const paragraphs=items=>items.map(p=>`<p>${esc(p)}</p>`).join('');
  const section=(title,body)=>`<section class="irmak-section"><h2>${esc(title)}</h2>${body}</section>`;
  const seminar=lang==='zh'?'/zh/blog/iga-law-firm-china-turkey-property-citizenship-seminars-2026/':'/en/blog/iga-law-firm-china-turkish-citizenship-investment-seminars-2026/';
  const chosen=['turkish-citizenship-e2-visa','turkish-citizenship-by-real-estate-investment-2025-complete-guide','how-to-check-property-eligibility-turkish-citizenship'];
  const published=chosen.map(slug=>articles.find(a=>a.slug===slug)).filter(a=>a&&a.author==='Irmak Gürer Aksöz'&&(!a.availableLanguages||a.availableLanguages.includes(lang)));
  const factList=rows=>`<dl class="irmak-facts">${rows.map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`;
  return `<main class="irmak-profile"><section class="section irmak-hero"><div class="shell"><div class="crumb"></div><div class="irmak-hero-grid"><img class="irmak-portrait" src="${esc(portrait)}" width="386" height="440" fetchpriority="high" decoding="async" alt="${esc(d.alt)}"><div><span class="eyebrow">IGA Law Firm</span><h1>${esc(d.h1)}</h1><p class="irmak-role">${esc(d.role)} | IGA Law Firm</p><p>${esc(d.areas[0])} | ${esc(d.areas[2])}</p><p>${esc(d.intro[0])}</p><a class="irmak-linkedin" href="${linkedIn}" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M20.45 2H3.55C2.7 2 2 2.67 2 3.5v17c0 .83.7 1.5 1.55 1.5h16.9c.85 0 1.55-.67 1.55-1.5v-17c0-.83-.7-1.5-1.55-1.5ZM8 19H5V9h3v10ZM6.5 7.7a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5ZM19 19h-3v-5.3c0-1.3-.5-2-1.5-2s-1.5.7-1.5 2V19h-3V9h3v1.3c.5-.9 1.4-1.5 2.7-1.5 2.2 0 3.3 1.4 3.3 4.1V19Z"/></svg><span>${esc(d.linkedinLabel)}</span></a>${factList([d.facts[0],[d.facts[1][0],d.facts[1][1]+' — '+d.facts[2][1]],d.facts[4],d.facts[5],d.facts[6]])}</div></div></div></section><div class="shell irmak-body">${paragraphs(d.intro.slice(1))}${section(d.sections[0].title,paragraphs(d.sections[0].paragraphs))}${section(d.timelineTitle,`<ol class="irmak-timeline">${['2017','2018','2022','2026'].map((year,i)=>`<li><strong>${year}</strong><p>${esc(d.timeline[i])}</p></li>`).join('')}</ol>`)}${section(d.sections[1].title,paragraphs(d.sections[1].paragraphs)+`<p><a href="${seminar}">${esc(d.seminarLabel)} ↗</a></p>`)}${section(d.sections[2].title,`<ul>${d.areas.map(a=>`<li>${esc(a)}</li>`).join('')}</ul>`)}${section(d.sections[3].title,factList([d.facts[0],...window.igaProfessionalRegistration.rows(slug,lang,d.facts[1][1]),...d.facts.slice(4)])+window.igaProfessionalRegistration.verification(slug,lang,esc))}${section(d.articlesTitle,`<ul>${published.map(a=>`<li><a href="${pathFor(lang,'journal',a.slug)}">${esc(articleTitle(a,lang))}</a></li>`).join('')}</ul>`)}${section(d.servicesTitle,`<ul>${['igaturkishcitizenshipbyinvestment','igalawrealestateduediligence'].map((page,i)=>`<li><a href="${pathFor(lang,page)}">${esc(d.serviceLabels[i])}</a></li>`).join('')}</ul>`)}${section(d.sections[4].title,paragraphs(d.sections[4].paragraphs)+`<p><a class="text-link" href="${pathFor(lang,'contact')}">${esc(t.contact)} ↗</a></p>`)}</div></main>`;
 }
 return {slug,copy,image,linkedIn,personId,path,render};
})();
