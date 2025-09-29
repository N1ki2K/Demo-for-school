import { useState, useEffect } from 'react';

// Simple fallback translations to prevent crashes
const fallbackTranslations = {
  bg: {
    header: { title: 'ОУ "Кольо Ганчев"', toggleMenu: 'Отвори меню' },
    nav: {
      home: 'Начало',
      school: { title: 'Училището', history: 'История', patron: 'Патрон', team: 'Екип', council: 'Съвет', news: 'Новини' },
      documents: { 
        title: 'Документи'
      },
      gallery: 'Галерия',
      news: 'Новини',
      usefulLinks: 'Полезни връзки',
      projects: { 
        title: 'Проекти', 
        yourHour: 'Проект "Твоят час"',
        supportForSuccess: 'Проект "Подкрепа за успех"',
        educationForTomorrow: 'Проект "Образование за утрешния ден"'
      },
      contacts: 'Контакти',
      infoAccess: 'Достъп до информация'
    },
    footer: {
      schoolName: 'ОУ "Кольо Ганчев"',
      motto: 'Образование с грижа за бъдещето.',
      contacts: {
        title: 'Контакти',
        addressLabel: 'Адрес',
        phoneLabel: 'Телефон',
        emailLabel: 'Имейл'
      },
      quickLinks: {
        title: 'Бързи връзки',
        contacts: 'Контакти',
        admissions: 'Прием',
        usefulLinks: 'Полезни връзки',
        gallery: 'Галерия'
      },
      copyright: 'Всички права запазени.',
      design: 'Дизайн и разработка от талантлив екип.'
    },
    search: { label: 'Търсене', placeholder: 'Търсете...', button: 'Търси', noResults: 'Няма резултати', resultsCount: 'резултата' },
    common: {
      loading: 'Зареждане...',
      error: 'Грешка'
    },
    contactsPage: {
      title: 'Контакти',
      address: {
        title: 'Адрес',
        line1: 'Стара Загора, кв. Казански',
        line2: 'ул. Добруджа 15'
      },
      phones: {
        title: 'Телефони',
        director: 'Директор',
        office: 'Канцелария'
      },
      email: {
        title: 'Имейл',
        address: 'info-2400124@edu.mon.bg'
      },
      workTime: {
        title: 'Работно време',
        weekdaysLabel: 'Понedelник - Петък',
        weekendLabel: 'Събота - Неделя',
        weekdays: '07:30 - 17:30',
        weekend: 'Затворено',
        note: '* За посещения извън работното време, моля свържете се предварително'
      },
      location: {
        title: 'Местоположение',
        info: 'Кликнете на маркера за повече информация'
      },
      transport: {
        title: 'Транспорт',
        lines: ['Автобусни линии: 2, 5, 12']
      }
    },
    usefulLinksPage: {
      title: 'Полезни връзки',
      loading: 'Зарежда...',
      error: 'Грешка',
      defaultCta: 'Прочети повече',
      noLinks: 'Няма връзки'
    },
    homePage: {
      features: {
        title: 'Защо да изберете нас?',
        subtitle: 'Предлагаме качествено образование в безопасна и подкрепяща среда.',
        feature1: {
          title: 'Модерни съоръжения',
          description: 'Обновени класни стаи и специализирани лаборатории.'
        },
        feature2: {
          title: 'Опитни учители',
          description: 'Екип от квалифицирани и мотивирани педагози.'
        },
        feature3: {
          title: 'Подкрепяща среда',
          description: 'Грижа и индивидуално внимание за всяко дете.'
        }
      }
    },
    patronPage: {
      title: 'Нашият патрон – Кольо Ганчев',
      p1: 'Кольо Ганчев Ватев, известен още като Ганюолу, е български революционер, виден участник в Старозагорското въстание от 1875 г. и близък съратник на Васил Левски.',
      p2: 'Роден е през 1843 г. в село Муралково (днес Кольо Ганчево), Старозагорско. Осиротял в ранна възраст, е отгледан от чичо си.',
      p3: 'Кольо Ганчев е един от главните организатори и ръководители на Старозагорското въстание.',
      p4: 'Жертвата му не е забравена. Днес с гордост носим неговото име.',
      imageAlt: 'Портрет на Кольо Ганчев',
      imageCaption: 'Художествена реконструкция на образа на Кольо Ганчев.'
    },
    teamPage: {
      title: 'Училищен екип',
      intro: 'Запознайте се с нашия екип от всеотдайни професионалисти.',
      director: {
        title: 'Директор',
        name: 'Галина Петкова'
      },
      teachers: {
        title: 'Учители',
        description: 'Нашият преподавателски състав се състои от опитни и всеотдайни професионалисти.',
        list: []
      },
      photoTitle: 'Нашият екип',
      leadershipTitle: 'Ръководство',
      photoCaption: 'Групова снимка на училищния персонал'
    },
    councilPage: {
      title: 'Обществен съвет',
      intro: 'Общественият съвет е орган за гражданско управление и подкрепа на училищното ръководство.',
      functionsTitle: 'Основни функции:',
      functions: {
        f1: 'Одобрява стратегията за развитие на училището.',
        f2: 'Участва в процеса по избор на директор.',
        f3: 'Координира учебната програма.',
        f4: 'Предлага политики за подобряване качеството на образователния процес.',
        f5: 'Дава становище по бюджета на училището.'
      },
      membersTitle: 'Състав на обществения съвет за периода 2024-2027:',
      members: {
        m1: { role: 'Председател', name: 'Александър Петров (представител на родителите)' },
        m2: {
          role: 'Членове',
          names: {
            n1: 'Мария Колева (представител на родителите)',
            n2: 'Ивелина Георгиева (представител на родителите)',
            n3: 'Инж. Димитър Николов (представител на Община Стара Загора)',
            n4: 'Д-р Елена Стоянова (видна обществена фигура)'
          }
        }
      },
      contact: 'За връзка с обществения съвет: council@kganchev-school.bg'
    },
    infoAccessPage: {
      title: 'Достъп до информация',
      intro: 'В съответствие с Закона за достъп до обществена информация...',
      rules: {
        title: 'Правила за достъп до обществена информация',
        p1: 'Тези правила регулират условията и реда...',
        principlesTitle: 'Основни принципи:',
        principles: {
          p1: 'Законност, откритост и достъпност.',
          p2: 'Осигуряване на равни възможности за достъп.',
          p3: 'Защита на информацията.'
        }
      },
      howTo: {
        title: 'Как да подам заявление?',
        p1: 'Заявление за достъп до обществена информация...',
        methods: {
          m1: 'Писмено: В канцеларията на училището',
          m2: 'Устно: В канцеларията на училището',
          m3: 'Електронно: На имейл адреса'
        },
        p2: 'Заявлението трябва да съдържа пълното име на заявителя...'
      },
      report: {
        title: 'Годишен доклад за ЗДОИ за 2023 г. (обобщение)',
        p1: 'През 2023 г. ОУ "Кольо Ганчев" получи общо 5 заявления за достъп до обществена информация.',
        stats: {
          s1: 'Брой удовлетворени заявления: 5',
          s2: 'Брой откази за предоставяне на информация: 0',
          s3: 'Няма получени заявления по електронен път.'
        },
        p2: 'Пълният доклад е достъпен за разглеждане в канцеларията на училището.'
      }
    },
    galleryPage: {
      title: 'Галерия',
      intro: 'Разгледайте моменти от живота в нашето училище.',
      alts: {
        img1: 'Учебен процес',
        img2: 'Спортен ден',
        img3: 'Коледно тържество'
      },
      lightbox: {
        close: 'Затвори',
        prev: 'Предишна снимка',
        next: 'Следваща снимка'
      }
    },
    news: {
      title: 'Новини',
      featured: 'Препоръчани',
      allNews: 'Всички новини',
      readMore: 'Прочети повече',
      noArticles: 'Няма новинарски статии',
      checkBackSoon: 'Проверете отново скоро за най-новите новини и актуализации.',
      loadError: 'Неуспешно зареждане на новинарските статии'
    },
    cms: {
      dashboard: {
        title: 'CMS Табло',
        logout: 'Изход',
        accessDenied: {
          title: 'Достъп отказан',
          message: 'Нямате права за достъп до тази страница. Моля, влезте в системата.'
        }
      },
      tabs: {
        media: 'Медия мениджър',
        documents: 'Документи',
        documentsMenu: 'Меню на документи',
        projectsMenu: 'Меню на проекти',
        news: 'Новини',
        contacts: 'Контактна информация',
        infoAccess: 'Достъп до информация',
        history: 'История на училището',
        schoolTeam: 'Училищен екип',
        publicCouncil: 'Обществен съвет',
        gallery: 'Галерия'
      },
      mediaManager: {
        title: 'Мениджър на медийни файлове',
        description: 'Качвайте и управлявайте всички изображения в папката Pictures.',
        picturesFolder: 'Папка Pictures ({count} изображения)',
        sizeGuidelines: 'Насоки за размера на изображението:',
        profilePictures: 'Профилни снимки: 300×300 пиксела (квадрат) - за снимки на членове на екипа',
        galleryImages: 'Изображения от галерията: 600×400 пиксела (пейзаж) - за фото галерия',
        bannerImages: 'Банерни изображения: 1200×400 пиксела (широки) - за заглавки на страници',
        general: 'Общо: Поддържайте файловете под 500KB за най-добра производителност'
      },
      newsManager: {
        title: 'Мениджър на новини',
        description: 'Създавайте, редактирайте и управлявайте новини.',
        addNews: 'Добави новина',
        noNews: 'Няма създадени новини',
        createFirst: 'Създайте първата новина, за да започнете.',
        status: {
          published: 'Публикуван',
          draft: 'Чернова',
          featured: 'Препоръчан'
        },
        actions: {
          save: 'Запази',
          cancel: 'Отказ',
          edit: 'Редактиране',
          delete: 'Изтриване',
          publish: 'Публикувай',
          unpublish: 'Скрий',
          feature: 'Препоръчай',
          unfeature: 'Не препоръчвай'
        }
      },
      documentManager: {
        title: 'Мениджър на документи',
        description: 'Качвайте и управлявайте всички документи в папката Documents.',
        documentGuidelines: [
          'PDF документи: За официални документи, формуляри и доклади',
          'Word документи: За редактируеми текстове и шаблони',
          'Excel документи: За таблици, програми и данни',
          'PowerPoint документи: За презентации и обучителни материали'
        ],
        documentsFolder: 'Папка Documents ({count} документа)',
        documentTypes: {
          pdf: 'PDF документ',
          word: 'Word документ',
          excel: 'Excel документ',
          powerpoint: 'PowerPoint презентация',
          text: 'Текстов документ',
          other: 'Друг документ'
        },
        deleteConfirm: 'Сигурни ли сте, че искате да изтриете документа "{filename}"?',
        uploadSuccess: 'Документът "{filename}" беше качен успешно!'
      },
      documentsMenuManager: {
        title: 'Мениджър на меню за документи',
        description: 'Управлявайте документните страници в менюто "Документи". Всички нови елементи се добавят като подстраници на Документи.',
        addMenuItem: 'Добави меню елемент',
        addNewItem: 'Добави нов меню елемент',
        currentMenuItems: 'Текущи меню елементи',
        loading: 'Зареждане на меню елементи...',
        titlePlaceholder: 'напр. Моят нов документ',
        pathPlaceholder: 'my-new-document',
        position: 'Позиция',
        parentItem: 'Родителски елемент',
        noParent: 'Няма родител (Високо ниво)',
        isActive: 'Активен',
        active: 'Активен',
        inactive: 'Неактивен',
        save: 'Запази',
        cancel: 'Отказ',
        edit: 'Редактирай',
        delete: 'Изтрий',
        activate: 'Активирай',
        deactivate: 'Деактивирай',
        editItem: 'Редактиране на меню елемент',
        deleteConfirm: 'Сигурни ли сте, че искате да изтриете този меню елемент?',
        path: 'Път'
      },
      contactManager: {
        title: 'Мениджър на контактна информация',
        description: 'Управлявайте контактни данни, работно време и информация за местоположението.',
        sections: {
          address: 'Адресна информация',
          phones: 'Телефонни номера',
          email: 'Имейл адрес',
          workTime: 'Работно време',
          transport: 'Транспорт'
        },
        fields: {
          addressLine1: 'Адрес ред 1',
          addressLine2: 'Адрес ред 2',
          directorPhone: 'Телефон на директора',
          officePhone: 'Телефон на канцеларията',
          contactEmail: 'Контактен имейл',
          weekdaysHours: 'Работни дни часове',
          weekendHours: 'Уикенд часове',
          workTimeNote: 'Бележка за работното време',
          transportLines: 'Транспортни линии'
        },
        placeholders: {
          addressLine1: 'напр., Стара Загора, кв. Казански',
          addressLine2: 'напр., ул. Добруджа 15',
          directorPhone: 'напр., +359 42 123 456',
          officePhone: 'напр., +359 42 123 457',
          contactEmail: 'напр., info@school.bg',
          weekdaysHours: 'напр., 07:30 - 17:30',
          weekendHours: 'напр., Затворено',
          workTimeNote: 'напр., За посещения извън работното време, моля свържете се с нас предварително',
          transportLines: 'напр., Автобусни линии: 2, 5, 12'
        }
      },
      infoAccessManager: {
        title: 'Мениджър за достъп до информация',
        description: 'Управлявайте съдържанието на страницата за достъп до информация, включително правила, процедури и годишни доклади.',
        sections: {
          intro: 'Въведение',
          rules: 'Правила и принципи',
          howTo: 'Как да заявите информация',
          report: 'Годишен доклад'
        },
        fields: {
          intro: 'Въвеждащ текст',
          rulesTitle: 'Заглавие на секция правила',
          rulesContent: 'Съдържание на правилата',
          principlesTitle: 'Заглавие на принципите',
          principles: 'Списък с принципи',
          howToTitle: 'Заглавие за заявяване',
          howToIntro: 'Въведение за заявяване',
          methods: 'Методи за заявка',
          howToNote: 'Допълнителна бележка',
          reportTitle: 'Заглавие на годишен доклад',
          reportIntro: 'Въведение на доклада',
          stats: 'Статистики',
          reportNote: 'Бележка към доклада'
        },
        placeholders: {
          intro: 'Въведете въвеждащ текст за достъпа до публична информация...',
          rulesTitle: 'напр., Правила за достъп до публична информация',
          rulesContent: 'Въведете основното съдържание на правилата...',
          principlesTitle: 'напр., Основни принципи:',
          principleItem: 'напр., Прозрачност и откритост',
          howToTitle: 'напр., Как да заявите информация',
          howToIntro: 'Въведете инструкции за заявяване на информация...',
          methodItem: 'напр., Подайте писмена молба в училищната канцелария',
          howToNote: 'Въведете допълнителни бележки...',
          reportTitle: 'напр., Годишен доклад 2024',
          reportIntro: 'Въведете въведение към доклада...',
          statItem: 'напр., Общо получени заявки: 15',
          reportNote: 'Въведете заключение към доклада...'
        }
      },
      usefulLinksManager: {
        title: 'Управление на полезни връзки',
        description: 'Управлявайте полезни връзки и съдържание на страниците. Редактиране в {lang} режим.',
        links: 'Полезни връзки',
        contentSections: 'Секции със съдържание',
        pageIntroduction: 'Въведение на страницата',
        footerNote: 'Бележка в края',
        key: 'Ключ',
        position: 'Позиция',
        language: 'Език',
        loading: 'Зареждане на съдържанието на полезните връзки...',
        error: 'Грешка',
        errorLoad: 'Неуспешно зареждане на съдържанието на полезните връзки',
        tryAgain: 'Опитай отново',
        refresh: 'Обнови',
        noContent: 'Не е намерено съдържание за полезни връзки.',
        form: {
          titleLabel: 'Заглавие ({lang})',
          titlePlaceholder: 'Въведете заглавие...',
          contentLabel: 'Съдържание ({lang})',
          contentPlaceholder: 'Въведете съдържание...',
          descriptionLabel: 'Описание ({lang})',
          descriptionPlaceholder: 'Въведете описание...',
          urlLabel: 'URL',
          urlPlaceholder: 'https://example.com',
          ctaLabel: 'Призив за действие ({lang})',
          ctaPlaceholder: 'Въведете текст за призив за действие...',
          saving: 'Записване...',
          save: 'Запази',
          cancel: 'Отказ',
          edit: 'Редактирай'
        },
        preview: {
          title: '{lang} Заглавие:',
          content: '{lang} Съдържание:',
          description: '{lang} Описание:',
          url: 'URL:',
          cta: '{lang} Призив:',
          noContent: 'Няма съдържание'
        }
      },
      schoolTeam: {
        title: 'Управление на училищния екип',
        description: 'Добавяне, редактиране и управление на членовете на училищния персонал. Можете да пренареждате членовете, като промените номерата на тяхната позиция.',
        membersCount: 'Членове на екипа ({count})',
        addMember: 'Добави член на екипа',
        editMember: 'Редактирай член на екипа',
        profileImage: 'Профилна снимка',
        chooseFromPictures: 'Изберете от Pictures',
        memberSaved: 'Членът на екипа е запазен успешно!',
        teamPhoto: {
          title: 'Групова снимка на екипа',
          description: 'Управлявайте основната снимка на екипа, която се появява на страницата на екипа',
          managePhoto: 'Управлявай снимката',
          noPhotoSet: 'Няма зададена снимка на екипа',
          currentPhoto: 'Текуща снимка',
          photoUpdated: 'Груповата снимка на екипа е актуализирана успешно!',
          photoFailed: 'Неуспешно запазване на снимката на екипа: {error}'
        }
      },
      imagePicker: {
        title: 'Изберете изображение',
        close: 'Затвори',
        select: 'Избери',
        noImages: 'Няма налични изображения.'
      },
      common: {
        save: 'Запази',
        cancel: 'Отказ',
        delete: 'Изтрий',
        edit: 'Редактиране',
        loading: 'Зареждане...',
        error: 'Грешка'
      },
      systemError: {
        title: 'Грешка при зареждането на съдържанието',
        message: 'Не може да се осъществи връзка със сървъра. Моля, проверете дали backend-ът работи.',
        tryAgain: 'Опитай отново',
        retrying: 'Опитва отново...',
        helpTitle: 'Какво можете да направите?',
        help1: 'Проверете интернет връзката си',
        help2: 'Опитайте да презаредите страницата',
        help3: 'Свържете се с администратора на сайта, ако проблемът продължава'
      },
      pdfViewer: {
        title: 'PDF Преглед',
        loading: 'Зарежда PDF...',
        error: 'Грешка в PDF',
        noFilename: 'Не е посочен PDF файл',
        fileNotFound: 'PDF файлът не е намерен',
        loadError: 'Грешка при зареждане на PDF файла',
        errorTitle: 'Не може да се зареди PDF',
        retry: 'Опитай отново',
        back: 'Назад',
        download: 'Изтегли',
        print: 'Принтирай',
        openNewTab: 'Нов таб',
        browserNotSupported: 'PDF преглед не се поддържа',
        downloadToView: 'Моля, изтеглете файла за да го прегледате.',
        downloadNow: 'Изтегли сега',
        helpText: 'Използвайте контролите на браузъра за мащабиране, навигиране и взаимодействие с PDF документа.'
      }
    }
  },
  en: {
    header: { title: 'Kolyo Ganchev Elementary School', toggleMenu: 'Open menu' },
    nav: {
      home: 'Home',
      school: { title: 'School', history: 'History', patron: 'Patron', team: 'Team', council: 'Council', news: 'News' },
      documents: { 
        title: 'Documents'
      },
      gallery: 'Gallery',
      news: 'News',
      usefulLinks: 'Useful Links',
      projects: { 
        title: 'Projects', 
        yourHour: 'Project "Your Hour"',
        supportForSuccess: 'Project "Support for Success"',
        educationForTomorrow: 'Project "Education for Tomorrow"'
      },
      contacts: 'Contacts',
      infoAccess: 'Info Access'
    },
    footer: {
      schoolName: 'Kolyo Ganchev Elementary School',
      motto: 'Education with care for the future.',
      contacts: {
        title: 'Contacts',
        addressLabel: 'Address',
        phoneLabel: 'Phone',
        emailLabel: 'Email'
      },
      quickLinks: {
        title: 'Quick Links',
        contacts: 'Contacts',
        admissions: 'Admissions',
        usefulLinks: 'Useful Links',
        gallery: 'Gallery'
      },
      copyright: 'All rights reserved.',
      design: 'Design and development by a talented team.'
    },
    search: { label: 'Search', placeholder: 'Search...', button: 'Search', noResults: 'No results', resultsCount: 'results' },
    common: {
      loading: 'Loading...',
      error: 'Error'
    },
    contactsPage: {
      title: 'Contacts',
      address: {
        title: 'Address',
        line1: 'Stara Zagora, Kazanski District',
        line2: '15 Dobrudzha St.'
      },
      phones: {
        title: 'Phones',
        director: 'Principal',
        office: 'Office'
      },
      email: {
        title: 'Email',
        address: 'info-2400124@edu.mon.bg'
      },
      workTime: {
        title: 'Working Hours',
        weekdaysLabel: 'Monday - Friday',
        weekendLabel: 'Saturday - Sunday',
        weekdays: '07:30 - 17:30',
        weekend: 'Closed',
        note: '* For visits outside working hours, please contact us in advance'
      },
      location: {
        title: 'Location',
        info: 'Click on the marker for more information'
      },
      transport: {
        title: 'Transport',
        lines: ['Bus lines: 2, 5, 12']
      }
    },
    usefulLinksPage: {
      title: 'Useful Links',
      loading: 'Loading...',
      error: 'Error',
      defaultCta: 'Read more',
      noLinks: 'No links'
    },
    homePage: {
      features: {
        title: 'Why Choose Us?',
        subtitle: 'We offer quality education in a safe and supportive environment.',
        feature1: {
          title: 'Modern Facilities',
          description: 'Renovated classrooms and specialized labs.'
        },
        feature2: {
          title: 'Experienced Teachers',
          description: 'A team of qualified and motivated educators.'
        },
        feature3: {
          title: 'Supportive Environment',
          description: 'Care and individual attention for every child.'
        }
      }
    },
    patronPage: {
      title: 'Our Patron – Kolyo Ganchev',
      p1: 'Kolyo Ganchev Vatev, also known as Ganyuolu, was a Bulgarian revolutionary, a prominent participant in the Stara Zagora Uprising of 1875, and a close associate of Vasil Levski.',
      p2: 'He was born in 1843 in the village of Muralkovo (now Kolyo Ganchevo), Stara Zagora region. Orphaned at a young age, he was raised by his uncle.',
      p3: 'Kolyo Ganchev was one of the main organizers and leaders of the Stara Zagora Uprising.',
      p4: 'His sacrifice is not forgotten. Today, we proudly bear his name.',
      imageAlt: 'Portrait of Kolyo Ganchev',
      imageCaption: 'Artistic reconstruction of the image of Kolyo Ganchev.'
    },
    teamPage: {
      title: 'School Team',
      intro: 'Meet our team of dedicated professionals who work tirelessly for the success and well-being of our students.',
      director: {
        title: 'Principal',
        name: 'Galina Petkova'
      },
      teachers: {
        title: 'Teachers',
        description: 'Our teaching staff consists of experienced and dedicated professionals.',
        list: []
      },
      photoTitle: 'Our Team',
      leadershipTitle: 'Leadership',
      photoCaption: 'Group photo of the school staff'
    },
    councilPage: {
      title: 'Public Council',
      intro: 'The Public Council is a body for civil control and support of the school\'s management.',
      functionsTitle: 'Main Functions:',
      functions: {
        f1: 'Approves the school\'s development strategy.',
        f2: 'Participates in the process of selecting a principal.',
        f3: 'Coordinates the school curriculum.',
        f4: 'Proposes policies to improve the quality of the educational process.',
        f5: 'Provides an opinion on the school\'s budget.'
      },
      membersTitle: 'Composition of the Public Council for the 2024-2027 term:',
      members: {
        m1: { role: 'Chairman', name: 'Alexander Petrov (parents\' representative)' },
        m2: {
          role: 'Members',
          names: {
            n1: 'Maria Koleva (parents\' representative)',
            n2: 'Ivelina Georgieva (parents\' representative)',
            n3: 'Eng. Dimitar Nikolov (representative of Stara Zagora Municipality)',
            n4: 'Dr. Elena Stoyanova (prominent public figure)'
          }
        }
      },
      contact: 'To contact the Public Council: council@kganchev-school.bg'
    },
    infoAccessPage: {
      title: 'Access to Information',
      intro: 'In accordance with the Access to Public Information Act...',
      rules: {
        title: 'Internal Rules for Access to Public Information',
        p1: 'These rules regulate the conditions and procedure...',
        principlesTitle: 'Basic Principles:',
        principles: {
          p1: 'Legality, openness, and accessibility.',
          p2: 'Ensuring equal opportunity for access.',
          p3: 'Protection of information.'
        }
      },
      howTo: {
        title: 'How to Submit an Application?',
        p1: 'An application for access to public information...',
        methods: {
          m1: 'In writing: At the school\'s office',
          m2: 'Orally: At the school\'s office',
          m3: 'Electronically: To the email address'
        },
        p2: 'The application must contain the applicant\'s full name...'
      },
      report: {
        title: 'Annual APIA Report for 2023 (Summary)',
        p1: 'In 2023, "Kolyo Ganchev" Primary School received a total of 5 applications for access to public information.',
        stats: {
          s1: 'Number of satisfied applications: 5',
          s2: 'Number of refusals to provide information: 0',
          s3: 'No applications received electronically.'
        },
        p2: 'The full report is available for review at the school\'s office.'
      }
    },
    galleryPage: {
      title: 'Gallery',
      intro: 'Browse moments from life at our school.',
      alts: {
        img1: 'Educational process',
        img2: 'Sports day',
        img3: 'Christmas celebration'
      },
      lightbox: {
        close: 'Close',
        prev: 'Previous image',
        next: 'Next image'
      }
    },
    news: {
      title: 'News',
      featured: 'Featured',
      allNews: 'All News',
      readMore: 'Read more',
      noArticles: 'No news articles',
      checkBackSoon: 'Check back soon for the latest news and updates.',
      loadError: 'Failed to load news articles'
    },
    cms: {
      dashboard: {
        title: 'CMS Dashboard',
        logout: 'Logout',
        accessDenied: {
          title: 'Access Denied',
          message: 'You do not have permission to access this page. Please log in.'
        }
      },
      tabs: {
        media: 'Media Manager',
        documents: 'Documents',
        documentsMenu: 'Documents Menu',
        projectsMenu: 'Projects Menu',
        news: 'News',
        contacts: 'Contact Info',
        infoAccess: 'Access to Information',
        history: 'School History',
        schoolTeam: 'School Team',
        publicCouncil: 'Public Council',
        gallery: 'Gallery'
      },
      mediaManager: {
        title: 'Media Manager',
        description: 'Upload and manage all images in the Pictures folder.',
        picturesFolder: 'Pictures Folder ({count} images)',
        sizeGuidelines: 'Image Size Guidelines:',
        profilePictures: 'Profile Pictures: 300×300 pixels (square) - for team member photos',
        galleryImages: 'Gallery Images: 600×400 pixels (landscape) - for photo gallery',
        bannerImages: 'Banner Images: 1200×400 pixels (wide) - for page headers',
        general: 'General: Keep files under 500KB for best performance'
      },
      newsManager: {
        title: 'News Manager',
        description: 'Create, edit, and manage news articles.',
        addNews: 'Add News Article',
        noNews: 'No news articles created',
        createFirst: 'Create your first news article to get started.',
        status: {
          published: 'Published',
          draft: 'Draft',
          featured: 'Featured'
        },
        actions: {
          save: 'Save',
          cancel: 'Cancel',
          edit: 'Edit',
          delete: 'Delete',
          publish: 'Publish',
          unpublish: 'Unpublish',
          feature: 'Feature',
          unfeature: 'Unfeature'
        }
      },
      documentManager: {
        title: 'Document Manager',
        description: 'Upload and manage all documents in the Documents folder.',
        documentGuidelines: [
          'PDF documents: For official documents, forms and reports',
          'Word documents: For editable texts and templates',
          'Excel documents: For spreadsheets, schedules and data',
          'PowerPoint documents: For presentations and educational materials'
        ],
        documentsFolder: 'Documents Folder ({count} documents)',
        documentTypes: {
          pdf: 'PDF Document',
          word: 'Word Document',
          excel: 'Excel Document',
          powerpoint: 'PowerPoint Presentation',
          text: 'Text Document',
          other: 'Other Document'
        },
        deleteConfirm: 'Are you sure you want to delete the document "{filename}"?',
        uploadSuccess: 'Document "{filename}" uploaded successfully!'
      },
      documentsMenuManager: {
        title: 'Documents Menu Manager',
        description: 'Manage document pages in the Documents menu. All new items are added as children of Documents.',
        addMenuItem: 'Add Menu Item',
        addNewItem: 'Add New Menu Item',
        currentMenuItems: 'Current Menu Items',
        loading: 'Loading menu items...',
        titlePlaceholder: 'e.g. My New Document',
        pathPlaceholder: 'my-new-document',
        position: 'Position',
        parentItem: 'Parent Item',
        noParent: 'No Parent (Top Level)',
        isActive: 'Active',
        active: 'Active',
        inactive: 'Inactive',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        activate: 'Activate',
        deactivate: 'Deactivate',
        editItem: 'Edit Menu Item',
        deleteConfirm: 'Are you sure you want to delete this menu item?',
        path: 'Path'
      },
      contactManager: {
        title: 'Contact Information Manager',
        description: 'Manage contact details, working hours, and location information.',
        sections: {
          address: 'Address Information',
          phones: 'Phone Numbers',
          email: 'Email Address',
          workTime: 'Working Hours',
          transport: 'Transportation'
        },
        fields: {
          addressLine1: 'Address Line 1',
          addressLine2: 'Address Line 2',
          directorPhone: 'Principal Phone',
          officePhone: 'Office Phone',
          contactEmail: 'Contact Email',
          weekdaysHours: 'Monday-Friday Hours',
          weekendHours: 'Weekend Hours',
          workTimeNote: 'Working Hours Note',
          transportLines: 'Transport Lines'
        },
        placeholders: {
          addressLine1: 'e.g., Stara Zagora, Kazanski District',
          addressLine2: 'e.g., 15 Dobrudzha St.',
          directorPhone: 'e.g., +359 42 123 456',
          officePhone: 'e.g., +359 42 123 457',
          contactEmail: 'e.g., info@school.bg',
          weekdaysHours: 'e.g., 07:30 - 17:30',
          weekendHours: 'e.g., Closed',
          workTimeNote: 'e.g., For visits outside working hours, please contact us in advance',
          transportLines: 'e.g., Bus lines: 2, 5, 12'
        }
      },
      infoAccessManager: {
        title: 'Access to Information Manager',
        description: 'Manage the Access to Information page content including rules, procedures, and annual reports.',
        sections: {
          intro: 'Introduction',
          rules: 'Rules & Principles',
          howTo: 'How to Request Information',
          report: 'Annual Report'
        },
        fields: {
          intro: 'Introduction Text',
          rulesTitle: 'Rules Section Title',
          rulesContent: 'Rules Content',
          principlesTitle: 'Principles Title',
          principles: 'Principles List',
          howToTitle: 'How to Request Title',
          howToIntro: 'How to Request Introduction',
          methods: 'Request Methods',
          howToNote: 'Additional Note',
          reportTitle: 'Annual Report Title',
          reportIntro: 'Report Introduction',
          stats: 'Statistics',
          reportNote: 'Report Note'
        },
        placeholders: {
          intro: 'Enter introduction text about access to public information...',
          rulesTitle: 'e.g., Rules for Access to Public Information',
          rulesContent: 'Enter main rules content...',
          principlesTitle: 'e.g., Basic Principles:',
          principleItem: 'e.g., Transparency and openness',
          howToTitle: 'e.g., How to Request Information',
          howToIntro: 'Enter instructions for requesting information...',
          methodItem: 'e.g., Submit written request to the school office',
          howToNote: 'Enter additional notes...',
          reportTitle: 'e.g., Annual Report 2024',
          reportIntro: 'Enter report introduction...',
          statItem: 'e.g., Total requests received: 15',
          reportNote: 'Enter report conclusion...'
        }
      },
      usefulLinksManager: {
        title: 'Useful Links Management',
        description: 'Manage useful links and page content. Editing in {lang} mode.',
        links: 'Useful Links',
        contentSections: 'Content Sections',
        pageIntroduction: 'Page Introduction',
        footerNote: 'Footer Note',
        key: 'Key',
        position: 'Position',
        language: 'Language',
        loading: 'Loading useful links content...',
        error: 'Error',
        errorLoad: 'Failed to load useful links content',
        tryAgain: 'Try Again',
        refresh: 'Refresh',
        noContent: 'No useful links content found.',
        form: {
          titleLabel: 'Title ({lang})',
          titlePlaceholder: 'Enter title...',
          contentLabel: 'Content ({lang})',
          contentPlaceholder: 'Enter content...',
          descriptionLabel: 'Description ({lang})',
          descriptionPlaceholder: 'Enter description...',
          urlLabel: 'URL',
          urlPlaceholder: 'https://example.com',
          ctaLabel: 'Call to Action ({lang})',
          ctaPlaceholder: 'Enter call-to-action text...',
          saving: 'Saving...',
          save: 'Save',
          cancel: 'Cancel',
          edit: 'Edit'
        },
        preview: {
          title: '{lang} Title:',
          content: '{lang} Content:',
          description: '{lang} Description:',
          url: 'URL:',
          cta: '{lang} CTA:',
          noContent: 'No content'
        }
      },
      schoolTeam: {
        title: 'School Team Management',
        description: 'Add, edit, and manage school staff members. You can reorder members by changing their position numbers.',
        membersCount: 'Team Members ({count})',
        addMember: 'Add Team Member',
        editMember: 'Edit Team Member',
        profileImage: 'Profile Image',
        chooseFromPictures: 'Choose from Pictures',
        memberSaved: 'Team member saved successfully!',
        teamPhoto: {
          title: 'Team Group Photo',
          description: 'Manage the main team photo that appears on the team page',
          managePhoto: 'Manage Photo',
          noPhotoSet: 'No team photo set',
          currentPhoto: 'Current photo',
          photoUpdated: 'Team group photo updated successfully!',
          photoFailed: 'Failed to save team photo: {error}'
        }
      },
      imagePicker: {
        title: 'Select Image',
        close: 'Close',
        select: 'Select',
        noImages: 'No images available.'
      },
      common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        loading: 'Loading...',
        error: 'Error'
      },
      systemError: {
        title: 'Error Loading Content',
        message: 'Unable to connect to server. Please check if the backend is running.',
        tryAgain: 'Try Again',
        retrying: 'Retrying...',
        helpTitle: 'What can you do?',
        help1: 'Check your internet connection',
        help2: 'Try refreshing the page',
        help3: 'Contact the website administrator if the problem persists'
      },
      pdfViewer: {
        title: 'PDF Viewer',
        loading: 'Loading PDF...',
        error: 'PDF Error',
        noFilename: 'No PDF file specified',
        fileNotFound: 'PDF file not found',
        loadError: 'Error loading PDF file',
        errorTitle: 'Cannot Load PDF',
        retry: 'Try Again',
        back: 'Back',
        download: 'Download',
        print: 'Print',
        openNewTab: 'New Tab',
        browserNotSupported: 'PDF Viewing Not Supported',
        downloadToView: 'Please download the file to view it.',
        downloadNow: 'Download Now',
        helpText: 'Use your browser controls to zoom, navigate, and interact with the PDF document.'
      }
    }
  }
};

let databaseTranslations: { [lang: string]: any } = {};

export const useTranslationsSimple = (language: string = 'bg') => {
  const [loading, setLoading] = useState(false);
  const [, forceUpdate] = useState({});
  
  // Load from database whenever language changes
  useEffect(() => {
    if (!databaseTranslations[language]) {
      setLoading(true);
      
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/translations?lang=${language}`)
        .then(response => response.json())
        .then(data => {
          databaseTranslations[language] = data;
          forceUpdate({});
        })
        .catch(() => {
          // Silently fail - we'll use fallbacks
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [language]);

  // Merge database translations with fallbacks
  const mergedTranslations = {
    ...fallbackTranslations[language as keyof typeof fallbackTranslations],
    ...databaseTranslations[language]
  };

  // Helper function to get translation with dot notation
  const getTranslation = (keyPath: string, fallback?: string): string => {
    const keys = keyPath.split('.');
    let current: any = mergedTranslations;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return fallback || keyPath;
      }
    }
    
    return typeof current === 'string' ? current : (fallback || keyPath);
  };

  const refreshTranslations = async (lang?: string) => {
    const targetLang = lang || language;
    delete databaseTranslations[targetLang];
    
    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/translations?lang=${targetLang}`);
      const data = await response.json();
      databaseTranslations[targetLang] = data;
      forceUpdate({});
    } catch (error) {
      // Silently fail - we'll use fallbacks
    } finally {
      setLoading(false);
    }
  };

  return {
    translations: mergedTranslations,
    flatTranslations: databaseTranslations[language] || {},
    loading,
    error: null,
    t: getTranslation,
    getTranslation,
    refreshTranslations
  };
};