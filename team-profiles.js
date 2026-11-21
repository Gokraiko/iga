// Firm-supplied biographies and identity URLs. No inferred credentials or review credits.
window.teamProfiles = (() => {
 const labels={
  "en": {
    "lawyer": "Attorney-at-Law",
    "trainee": "Trainee Lawyer",
    "education": "Education",
    "bar": "Bar Association",
    "number": "Registration Number",
    "languages": "Languages",
    "areas": "Areas of Practice",
    "focus": "Work Focus",
    "bio": "Professional Background",
    "back": "Back to Our Team",
    "linkedin": "on LinkedIn",
    "languageNames": [
      "Turkish",
      "English",
      "German"
    ]
  },
  "tr": {
    "lawyer": "Avukat",
    "trainee": "Stajyer Avukat",
    "education": "Eğitim",
    "bar": "Baro",
    "number": "Sicil Numarası",
    "languages": "Diller",
    "areas": "Çalışma Alanları",
    "focus": "Çalışma Odağı",
    "bio": "Mesleki Bilgiler",
    "back": "Ekibimize dön",
    "linkedin": "LinkedIn profili",
    "languageNames": [
      "Türkçe",
      "İngilizce",
      "Almanca"
    ]
  },
  "zh": {
    "lawyer": "律师",
    "trainee": "实习律师",
    "education": "教育",
    "bar": "律师协会",
    "number": "执业登记号",
    "languages": "语言",
    "areas": "执业领域",
    "focus": "工作方向",
    "bio": "专业背景",
    "back": "返回团队页面",
    "linkedin": "的LinkedIn个人资料",
    "languageNames": [
      "土耳其语",
      "英语",
      "德语"
    ]
  },
  "ar": {
    "lawyer": "محامية",
    "trainee": "محامية متدربة",
    "education": "التعليم",
    "bar": "نقابة المحامين",
    "number": "رقم القيد",
    "languages": "اللغات",
    "areas": "مجالات الممارسة",
    "focus": "مجال العمل",
    "bio": "الخلفية المهنية",
    "back": "العودة إلى فريقنا",
    "linkedin": "على LinkedIn",
    "languageNames": [
      "التركية",
      "الإنجليزية",
      "الألمانية"
    ]
  }
};
 const profiles=[
  {
    "slug": "idil-dengiz-bucak",
    "name": "İdil Dengiz Bucak",
    "role": "lawyer",
    "image": "/public/assets/idil-dengiz-bucak-iga-law-firm.jpg",
    "width": 1086,
    "height": 1448,
    "number": "7922",
    "languages": [
      "tr",
      "en",
      "de"
    ],
    "linkedIn": "https://www.linkedin.com/in/idil-dengiz-bucak-1718281b9/",
    "copy": {
      "en": {
        "education": "Bahçeşehir University",
        "bar": "Bursa Bar Association",
        "areas": [
          "Litigation",
          "Turkish Citizenship by Investment"
        ],
        "intro": [
          "İdil Dengiz Bucak is an attorney at IGA Law Firm, registered with the Bursa Bar Association under registration number 7922. She studied at Bahçeşehir University.",
          "Her practice focuses on litigation and legal matters related to Turkish citizenship by investment.",
          "She speaks Turkish, English and German."
        ],
        "title": "İdil Dengiz Bucak | Attorney-at-Law | IGA Law Firm",
        "description": "İdil Dengiz Bucak is an attorney at IGA Law Firm, registered with the Bursa Bar Association under registration number 7922. She studied at Bahçeşehir University."
      },
      "tr": {
        "education": "Bahçeşehir Üniversitesi",
        "bar": "Bursa Barosu",
        "areas": [
          "Dava ve Uyuşmazlıklar",
          "Yatırım Yoluyla Türk Vatandaşlığı"
        ],
        "intro": [
          "İdil Dengiz Bucak, IGA Law Firm bünyesinde çalışan ve Bursa Barosu’na 7922 sicil numarasıyla kayıtlı bir avukattır. Bahçeşehir Üniversitesi’nde eğitim almıştır.",
          "Çalışmaları dava ve uyuşmazlıklar ile yatırım yoluyla Türk vatandaşlığına ilişkin hukuki konulara odaklanmaktadır.",
          "Türkçe, İngilizce ve Almanca konuşmaktadır."
        ],
        "title": "İdil Dengiz Bucak | Avukat | IGA Law Firm",
        "description": "İdil Dengiz Bucak, IGA Law Firm bünyesinde çalışan ve Bursa Barosu’na 7922 sicil numarasıyla kayıtlı bir avukattır. Bahçeşehir Üniversitesi’nde eğitim almıştır."
      },
      "zh": {
        "education": "巴赫切谢希尔大学（Bahçeşehir University）",
        "bar": "布尔萨律师协会",
        "areas": [
          "诉讼",
          "土耳其投资入籍"
        ],
        "intro": [
          "İdil Dengiz Bucak是IGA Law Firm的律师，在布尔萨律师协会注册，执业登记号为7922。她曾就读于巴赫切谢希尔大学（Bahçeşehir University）。",
          "她的执业工作主要涉及诉讼以及土耳其投资入籍相关法律事务。",
          "她使用土耳其语、英语和德语。"
        ],
        "title": "İdil Dengiz Bucak | 律师 | IGA Law Firm",
        "description": "İdil Dengiz Bucak是IGA Law Firm的律师，在布尔萨律师协会注册，执业登记号为7922。她曾就读于巴赫切谢希尔大学（Bahçeşehir University）。"
      },
      "ar": {
        "education": "جامعة بهتشه شهير (Bahçeşehir University)",
        "bar": "نقابة المحامين في بورصة",
        "areas": [
          "التقاضي",
          "الجنسية التركية عن طريق الاستثمار"
        ],
        "intro": [
          "İdil Dengiz Bucak محامية في IGA Law Firm، ومسجلة في نقابة المحامين في بورصة برقم قيد 7922. درست في جامعة بهتشه شهير.",
          "تركز ممارستها على التقاضي والمسائل القانونية المتعلقة بالجنسية التركية عن طريق الاستثمار.",
          "تتحدث التركية والإنجليزية والألمانية."
        ],
        "title": "İdil Dengiz Bucak | محامية | IGA Law Firm",
        "description": "İdil Dengiz Bucak محامية في IGA Law Firm، ومسجلة في نقابة المحامين في بورصة برقم قيد 7922. درست في جامعة بهتشه شهير."
      }
    }
  },
  {
    "slug": "latife-kucukalpelli",
    "name": "Latife Küçükalpelli",
    "role": "lawyer",
    "image": "/public/assets/team-latife-office.webp",
    "width": 887,
    "height": 887,
    "number": "84410",
    "languages": [
      "tr",
      "en"
    ],
    "linkedIn": "https://www.linkedin.com/in/latife-k%C3%BC%C3%A7%C3%BCkalpelli-274707122/",
    "copy": {
      "en": {
        "education": "Istanbul University",
        "bar": "Istanbul Bar Association",
        "areas": [
          "Legal Due Diligence",
          "Litigation",
          "Turkish Citizenship by Investment",
          "Real Estate Law",
          "Inheritance Law"
        ],
        "intro": [
          "Latife Küçükalpelli is an attorney at IGA Law Firm, registered with the Istanbul Bar Association under registration number 84410. She studied at Istanbul University.",
          "Her areas of practice include legal due diligence, litigation, Turkish citizenship by investment, real estate law and inheritance law.",
          "She speaks Turkish and English."
        ],
        "title": "Latife Küçükalpelli | Attorney-at-Law | IGA Law Firm",
        "description": "Latife Küçükalpelli is an attorney at IGA Law Firm, registered with the Istanbul Bar Association under registration number 84410. She studied at Istanbul University."
      },
      "tr": {
        "education": "İstanbul Üniversitesi",
        "bar": "İstanbul Barosu",
        "areas": [
          "Hukuki İnceleme",
          "Dava ve Uyuşmazlıklar",
          "Yatırım Yoluyla Türk Vatandaşlığı",
          "Gayrimenkul Hukuku",
          "Miras Hukuku"
        ],
        "intro": [
          "Latife Küçükalpelli, IGA Law Firm bünyesinde çalışan ve İstanbul Barosu’na 84410 sicil numarasıyla kayıtlı bir avukattır. İstanbul Üniversitesi’nde eğitim almıştır.",
          "Çalışma alanları hukuki inceleme, dava ve uyuşmazlıklar, yatırım yoluyla Türk vatandaşlığı, gayrimenkul hukuku ve miras hukukunu kapsamaktadır.",
          "Türkçe ve İngilizce konuşmaktadır."
        ],
        "title": "Latife Küçükalpelli | Avukat | IGA Law Firm",
        "description": "Latife Küçükalpelli, IGA Law Firm bünyesinde çalışan ve İstanbul Barosu’na 84410 sicil numarasıyla kayıtlı bir avukattır. İstanbul Üniversitesi’nde eğitim almıştır."
      },
      "zh": {
        "education": "伊斯坦布尔大学",
        "bar": "伊斯坦布尔律师协会",
        "areas": [
          "法律尽职调查",
          "诉讼",
          "土耳其投资入籍",
          "房地产法",
          "继承法"
        ],
        "intro": [
          "Latife Küçükalpelli是IGA Law Firm的律师，在伊斯坦布尔律师协会注册，执业登记号为84410。她曾就读于伊斯坦布尔大学。",
          "她的执业领域包括法律尽职调查、诉讼、土耳其投资入籍、房地产法和继承法。",
          "她使用土耳其语和英语。"
        ],
        "title": "Latife Küçükalpelli | 律师 | IGA Law Firm",
        "description": "Latife Küçükalpelli是IGA Law Firm的律师，在伊斯坦布尔律师协会注册，执业登记号为84410。她曾就读于伊斯坦布尔大学。"
      },
      "ar": {
        "education": "جامعة إسطنبول",
        "bar": "نقابة المحامين في إسطنبول",
        "areas": [
          "الفحص القانوني النافي للجهالة",
          "التقاضي",
          "الجنسية التركية عن طريق الاستثمار",
          "القانون العقاري",
          "قانون الميراث"
        ],
        "intro": [
          "Latife Küçükalpelli محامية في IGA Law Firm، ومسجلة في نقابة المحامين في إسطنبول برقم قيد 84410. درست في جامعة إسطنبول.",
          "تشمل مجالات ممارستها الفحص القانوني النافي للجهالة والتقاضي والجنسية التركية عن طريق الاستثمار والقانون العقاري وقانون الميراث.",
          "تتحدث التركية والإنجليزية."
        ],
        "title": "Latife Küçükalpelli | محامية | IGA Law Firm",
        "description": "Latife Küçükalpelli محامية في IGA Law Firm، ومسجلة في نقابة المحامين في إسطنبول برقم قيد 84410. درست في جامعة إسطنبول."
      }
    }
  },
  {
    "slug": "eda-yavuz",
    "name": "Eda Yavuz",
    "role": "trainee",
    "image": "/public/assets/team-eda-office.png",
    "width": 1254,
    "height": 1254,
    "languages": [
      "tr",
      "en"
    ],
    "linkedIn": "https://www.linkedin.com/in/eda-yavuz-6b1737446/",
    "copy": {
      "en": {
        "intro": [
          "Eda Yavuz is a trainee lawyer at IGA Law Firm. She studied at Istanbul University and focuses on legal work related to Turkish citizenship by investment as part of the firm's team.",
          "She speaks Turkish and English."
        ],
        "areas": [
          "Turkish Citizenship by Investment"
        ],
        "education": "Istanbul University",
        "title": "Eda Yavuz | Trainee Lawyer | IGA Law Firm",
        "description": "Eda Yavuz is a trainee lawyer at IGA Law Firm. She studied at Istanbul University and focuses on legal work related to Turkish citizenship by investment as part of the firm's team."
      },
      "tr": {
        "intro": [
          "Eda Yavuz, IGA Law Firm bünyesinde stajyer avukattır. İstanbul Üniversitesi’nde eğitim almıştır ve büronun ekibinin bir parçası olarak yatırım yoluyla Türk vatandaşlığına ilişkin hukuki çalışmalara odaklanmaktadır.",
          "Türkçe ve İngilizce konuşmaktadır."
        ],
        "areas": [
          "Yatırım Yoluyla Türk Vatandaşlığı"
        ],
        "education": "İstanbul Üniversitesi",
        "title": "Eda Yavuz | Stajyer Avukat | IGA Law Firm",
        "description": "Eda Yavuz, IGA Law Firm bünyesinde stajyer avukattır. İstanbul Üniversitesi’nde eğitim almıştır ve büronun ekibinin bir parçası olarak yatırım yoluyla Türk vatandaşlığına ilişkin hukuki çalışmalara odaklanmaktadır."
      },
      "zh": {
        "intro": [
          "Eda Yavuz是IGA Law Firm的实习律师。她曾就读于伊斯坦布尔大学，作为事务所团队的一员，主要参与土耳其投资入籍相关法律工作。",
          "她使用土耳其语和英语。"
        ],
        "areas": [
          "土耳其投资入籍"
        ],
        "education": "伊斯坦布尔大学",
        "title": "Eda Yavuz | 实习律师 | IGA Law Firm",
        "description": "Eda Yavuz是IGA Law Firm的实习律师。她曾就读于伊斯坦布尔大学，作为事务所团队的一员，主要参与土耳其投资入籍相关法律工作。"
      },
      "ar": {
        "intro": [
          "Eda Yavuz محامية متدربة في IGA Law Firm. درست في جامعة إسطنبول وتركز على العمل القانوني المتعلق بالجنسية التركية عن طريق الاستثمار ضمن فريق المكتب.",
          "تتحدث التركية والإنجليزية."
        ],
        "areas": [
          "الجنسية التركية عن طريق الاستثمار"
        ],
        "education": "جامعة إسطنبول",
        "title": "Eda Yavuz | محامية متدربة | IGA Law Firm",
        "description": "Eda Yavuz محامية متدربة في IGA Law Firm. درست في جامعة إسطنبول وتركز على العمل القانوني المتعلق بالجنسية التركية عن طريق الاستثمار ضمن فريق المكتب."
      }
    }
  },
  {
    "slug": "turkan-kelogullari",
    "name": "Türkan Keloğulları",
    "role": "trainee",
    "image": "/public/assets/team-turkan-professional.webp",
    "width": 900,
    "height": 1200,
    "languages": [
      "tr",
      "en"
    ],
    "linkedIn": "https://www.linkedin.com/in/t%C3%BCrkan-kelo%C4%9Fullar%C4%B1-b669a1231/",
    "copy": {
      "en": {
        "intro": [
          "Türkan Keloğulları is a trainee lawyer at IGA Law Firm. She studied at Koç University and focuses on legal work related to Turkish citizenship by investment as part of the firm's team.",
          "She speaks Turkish and English."
        ],
        "areas": [
          "Turkish Citizenship by Investment"
        ],
        "education": "Koç University",
        "title": "Türkan Keloğulları | Trainee Lawyer | IGA Law Firm",
        "description": "Türkan Keloğulları is a trainee lawyer at IGA Law Firm. She studied at Koç University and focuses on legal work related to Turkish citizenship by investment as part of the firm's team."
      },
      "tr": {
        "intro": [
          "Türkan Keloğulları, IGA Law Firm bünyesinde stajyer avukattır. Koç Üniversitesi’nde eğitim almıştır ve büronun ekibinin bir parçası olarak yatırım yoluyla Türk vatandaşlığına ilişkin hukuki çalışmalara odaklanmaktadır.",
          "Türkçe ve İngilizce konuşmaktadır."
        ],
        "areas": [
          "Yatırım Yoluyla Türk Vatandaşlığı"
        ],
        "education": "Koç Üniversitesi",
        "title": "Türkan Keloğulları | Stajyer Avukat | IGA Law Firm",
        "description": "Türkan Keloğulları, IGA Law Firm bünyesinde stajyer avukattır. Koç Üniversitesi’nde eğitim almıştır ve büronun ekibinin bir parçası olarak yatırım yoluyla Türk vatandaşlığına ilişkin hukuki çalışmalara odaklanmaktadır."
      },
      "zh": {
        "intro": [
          "Türkan Keloğulları是IGA Law Firm的实习律师。她曾就读于科奇大学（Koç University），作为事务所团队的一员，主要参与土耳其投资入籍相关法律工作。",
          "她使用土耳其语和英语。"
        ],
        "areas": [
          "土耳其投资入籍"
        ],
        "education": "科奇大学（Koç University）",
        "title": "Türkan Keloğulları | 实习律师 | IGA Law Firm",
        "description": "Türkan Keloğulları是IGA Law Firm的实习律师。她曾就读于科奇大学（Koç University），作为事务所团队的一员，主要参与土耳其投资入籍相关法律工作。"
      },
      "ar": {
        "intro": [
          "Türkan Keloğulları محامية متدربة في IGA Law Firm. درست في جامعة كوتش (Koç University) وتركز على العمل القانوني المتعلق بالجنسية التركية عن طريق الاستثمار ضمن فريق المكتب.",
          "تتحدث التركية والإنجليزية."
        ],
        "areas": [
          "الجنسية التركية عن طريق الاستثمار"
        ],
        "education": "جامعة كوتش (Koç University)",
        "title": "Türkan Keloğulları | محامية متدربة | IGA Law Firm",
        "description": "Türkan Keloğulları محامية متدربة في IGA Law Firm. درست في جامعة كوتش (Koç University) وتركز على العمل القانوني المتعلق بالجنسية التركية عن طريق الاستثمار ضمن فريق المكتب."
      }
    }
  }
];
 const get=slug=>profiles.find(p=>p.slug===slug);
 const forName=name=>profiles.find(p=>p.name===name);
 const path=(lang,slug)=>'/'+lang+'/team/'+slug+'/';
 for(const p of profiles)for(const [lang,d] of Object.entries(p.copy))window.finalSeoMetadata[path(lang,p.slug)]={title:d.title,description:d.description};
 function render(slug,lang,{esc,pathFor}){
  const p=get(slug),d=p.copy[lang],l=labels[lang];
  const facts=[[l.education,d.education],...(p.number?[[l.bar,d.bar],[l.number,p.number]]:[]),[l.languages,l.languageNames.slice(0,p.languages.length).join(' · ')]];
  return `<main class="irmak-profile"><section class="section irmak-hero"><div class="shell"><div class="crumb"></div><div class="irmak-hero-grid"><img class="irmak-portrait" style="aspect-ratio:${p.width}/${p.height}" src="${esc(p.image)}" width="${p.width}" height="${p.height}" fetchpriority="high" decoding="async" alt="${esc(p.name+', '+l[p.role]+' — IGA Law Firm')}"><div><span class="eyebrow">IGA Law Firm</span><h1><bdi>${esc(p.name)}</bdi></h1><p class="irmak-role">${esc(l[p.role])} | IGA Law Firm</p><a class="irmak-linkedin" href="${esc(p.linkedIn)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(p.name+' '+l.linkedin)}"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M20.45 2H3.55C2.7 2 2 2.67 2 3.5v17c0 .83.7 1.5 1.55 1.5h16.9c.85 0 1.55-.67 1.55-1.5v-17c0-.83-.7-1.5-1.55-1.5ZM8 19H5V9h3v10ZM6.5 7.7a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5ZM19 19h-3v-5.3c0-1.3-.5-2-1.5-2s-1.5.7-1.5 2V19h-3V9h3v1.3c.5-.9 1.4-1.5 2.7-1.5 2.2 0 3.3 1.4 3.3 4.1V19Z"/></svg><span>LinkedIn</span></a><dl class="irmak-facts">${facts.map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl></div></div></div></section><div class="shell irmak-body"><section><h2>${esc(l.bio)}</h2>${d.intro.map(s=>`<p>${esc(s)}</p>`).join('')}</section><section class="irmak-section"><h2>${esc(l[p.role==='trainee'?'focus':'areas'])}</h2><ul>${d.areas.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></section><p><a href="${pathFor(lang,'team')}">${esc(l.back)}</a></p></div></main>`;
 }
 return {profiles,get,forName,path,labels,render};
})();
