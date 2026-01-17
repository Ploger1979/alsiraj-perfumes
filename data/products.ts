export interface ProductSize {
    size: string;
    price: number;
    originalPrice?: number;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    image: string;
    images?: string[];
    isFeatured?: boolean;
    isOffer?: boolean;
    category?: string;
    gender?: 'للجنسين' | 'رجالي' | 'نسائي';
    concentration?: string;
    notes?: string[];
    size?: string;
    sizes?: ProductSize[];
}

export const products: Product[] = [
    {
        id: 1,
        name: "Dior Sauvage",
        description: "عطر رجالي فاخر يجمع بين الانتعاش والغموض. يفتتح العطر بنفحات البرغموت والفلفل، ثم ينتقل إلى قلب من اللافندر ونجيل الهند، ويستقر على قاعدة من خشب الأرز والعنبر.",
        price: 120000,
        image: "/images/products/Dior Sauvage/dior-sauvage-2.webp",
        images: [
            "/images/products/Dior Sauvage/dior-sauvage-1.avif",
            "/images/products/Dior Sauvage/dior-sauvage-2.webp",
            "/images/products/Dior Sauvage/dior-sauvage-3.avif"
        ],
        isFeatured: true,
        category: "men",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: ["برغموت", "فلفل", "لافندر", "عنبر"],
        sizes: [
            { size: "50 مل", price: 120000 },
            { size: "100 مل", price: 180000, originalPrice: 200000 }
        ]
    },
    {
        id: 2,
        name: "Mugler Alien",
        description: "عطر نسائي ساحر برائحة الياسمين والعنبر. عطر يجسد الأنوثة والغموض بنفحاته الزهرية الخشبية المميزة.",
        price: 120000,
        image: "/images/Alien2.webp",
        images: ["/images/Alien2.webp"],
        isFeatured: true,
        category: "women",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: ["ياسمين سامباك", "أخشاب الكشمير", "عنبر أبيض"],
        sizes: [
            { size: "50 مل", price: 120000 },
            { size: "100 مل", price: 160000 }
        ]
    },
    {
        id: 3,
        name: "Bleu de Chanel",
        description: "عطر خشبي أروماتك للرجل الذي يتحدى المألوف. مزيج من الحمضيات والأخشاب يمنحك شعوراً بالثقة والحرية.",
        price: 120000,
        image: "/images/products/Bleu de Chanel/bleu-de-chanel-1.avif",
        images: [
            "/images/products/Bleu de Chanel/bleu-de-chanel-1.avif",
            "/images/products/Bleu de Chanel/bleu-de-chanel-2.avif",
            "/images/products/Bleu de Chanel/bleu-de-chanel-3.avif"
        ],
        isFeatured: true,
        category: "french",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        notes: ["جريب فروت", "نعناع", "زنجبيل", "خشب الصندل"],
        sizes: [
            { size: "50 مل", price: 120000 },
            { size: "100 مل", price: 190000 }
        ]
    },
    {
        id: 4,
        name: "Hugo Boss Bottled",
        description: "عطر كلاسيكي يعكس الثقة والنجاح. يتألق بمقدمة من التفاح والحمضيات، وقلب من القرفة والقرنفل.",
        price: 90000,
        image: "/images/products/Hugo Boss Bottled/hugo-boss-bottled-2.avif",
        images: [
            "/images/products/Hugo Boss Bottled/hugo-boss-bottled-1.avif",
            "/images/products/Hugo Boss Bottled/hugo-boss-bottled-2.avif",
            "/images/products/Hugo Boss Bottled/hugo-boss-bottled-3.avif"
        ],
        isFeatured: true,
        category: "oils",
        gender: "رجالي",
        concentration: "Eau de Toilette",
        notes: ["تفاح", "قرفة", "فانيليا", "خشب الأرز"],
        sizes: [
            { size: "50 مل", price: 90000 },
            { size: "100 مل", price: 140000 }
        ]
    },
    {
        id: 5,
        name: "Valentino Uomo",
        description: "عطر إيطالي راقٍ بنفحات البندق والشوكولاتة. عطر دافئ وجذاب يناسب الأمسيات الخاصة.",
        price: 150000,
        image: "/images/products/Valentino Uomo/valentino-uomo-1.webp",
        images: [
            "/images/products/Valentino Uomo/valentino-uomo-1.webp",
            "/images/products/Valentino Uomo/valentino-uomo-2.webp",
            "/images/products/Valentino Uomo/valentino-uomo-3.webp"
        ],
        isFeatured: true,
        category: "men",
        gender: "رجالي",
        concentration: "Eau de Toilette",
        notes: ["برغموت", "بندق", "شوكولاتة", "جلد"],
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 210000 }
        ]
    },
    {
        id: 6,
        name: "Dior J'adore",
        description: "باقة زهرية أنثوية تفيض بالرقة والجمال. مزيج متناغم من الزهور البيضاء والفواكه.",
        price: 135000,
        image: "/images/products/Dior Jadore/dior-jadore-3.webp",
        images: [
            "/images/products/Dior Jadore/dior-jadore-1.avif",
            "/images/products/Dior Jadore/dior-jadore-2.avif",
            "/images/products/Dior Jadore/dior-jadore-3.webp"
        ],
        isFeatured: true,
        category: "women",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: ["كمثرى", "شمام", "ماغنوليا", "ياسمين"],
        sizes: [
            { size: "50 مل", price: 135000 },
            { size: "100 مل", price: 195000 }
        ]
    },
    {
        id: 7,
        name: "Versace Eros",
        description: "عطر الحب والشغف للرجل القوي. عطر فواح يجمع بين النعناع والتفاح الأخضر وفول التونكا.",
        price: 115000,
        originalPrice: 140000,
        image: "/images/products/Versace Eros/versace-eros-1.avif",
        images: [
            "/images/products/Versace Eros/versace-eros-1.avif",
            "/images/products/Versace Eros/versace-eros-2.webp"
        ],
        isOffer: true,
        category: "men",
        gender: "رجالي",
        concentration: "Eau de Toilette",
        notes: ["نعناع", "تفاح أخضر", "ليمون", "تونكا"],
        sizes: [
            { size: "50 مل", price: 115000, originalPrice: 140000 },
            { size: "100 مل", price: 170000, originalPrice: 200000 }
        ]
    },
    {
        id: 8,
        name: "YSL Black Opium",
        description: "عطر جريء للمرأة العصرية بنفحات القهوة والفانيليا. عطر يسبب الإدمان برائحته الحلوة والدافئة.",
        price: 145000,
        originalPrice: 180000,
        image: "/images/Black Opium.avif",
        images: ["/images/Black Opium.avif"],
        isOffer: true,
        category: "women",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: ["قهوة", "فانيليا", "زهر البرتقال", "باتشولي"],
        sizes: [
            { size: "50 مل", price: 145000, originalPrice: 180000 },
            { size: "100 مل", price: 195000, originalPrice: 230000 }
        ]
    },
    {
        id: 9,
        name: "Carolina Herrera Good Girl",
        description: "عطر قوي وجذاب يعبر عن ازدواجية المرأة. يجمع بين نضارة الياسمين ودفء الكاكاو.",
        price: 155000,
        originalPrice: 190000,
        image: "/images/products/Carolina Herrera Good Girl/carolina-herrera-good-girl-1.avif",
        images: [
            "/images/products/Carolina Herrera Good Girl/carolina-herrera-good-girl-1.avif",
            "/images/products/Carolina Herrera Good Girl/carolina-herrera-good-girl-2.avif",
            "/images/products/Carolina Herrera Good Girl/carolina-herrera-good-girl-3.avif"
        ],
        isOffer: true,
        category: "women",
        gender: "نسائي",
        concentration: "Eau de Parfum",
        notes: ["لوز", "قهوة", "ياسمين سامباك", "كاكاو"],
        sizes: [
            { size: "50 مل", price: 155000, originalPrice: 190000 },
            { size: "100 مل", price: 200000, originalPrice: 240000 }
        ]
    },
    {
        "id": 100,
        "name": "Aventus Travel Gift Set",
        "description": "عطر مميز من السراج للعطور. يمنحك تجربة عطرية فريدة تدوم طويلاً.",
        "price": 150000,
        "image": "/images/products/Aventus Travel Gift Set/aventus-travel-gift-set-1.webp",
        "images": [
            "/images/products/Aventus Travel Gift Set/aventus-travel-gift-set-1.webp",
            "/images/products/Aventus Travel Gift Set/aventus-travel-gift-set-2.webp",
            "/images/products/Aventus Travel Gift Set/aventus-travel-gift-set-3.webp"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Parfum",
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 101,
        "name": "A Men Pure Havane",
        "description": "عطر رجالي شرقي فانيليا يعيد صياغة رائحة التبغ الفاخرة. يجمع بين نفحات العسل الحلو والتبغ الدافئ مع لمسة من الكاكاو والباتشولي.",
        "price": 150000,
        "image": "/images/products/A MEN PURE HAVANE/a-men-pure-havane-1.jpg",
        "images": [
            "/images/products/A MEN PURE HAVANE/a-men-pure-havane-1.jpg",
            "/images/products/A MEN PURE HAVANE/a-men-pure-havane-2.webp"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Toilette",
        "notes": ["تبغ", "عسل أبيض", "فانيليا", "كاكاو", "باتشولي", "عنبر"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 102,
        "name": "Baccarat Rouge 540",
        "description": "تحفة عطرية شرقية زهرية للجنسين. يتميز برائحة فريدة وساحرة تمزج بين الزعفران والياسمين مع دفقات من العنبر والأخشاب، ليترك انطباعاً لا ينسى من الفخامة والتميز.",
        "price": 150000,
        "image": "/images/products/Baccarat Rouge 540/baccarat-rouge-540-1.avif",
        "images": [
            "/images/products/Baccarat Rouge 540/baccarat-rouge-540-1.avif",
            "/images/products/Baccarat Rouge 540/baccarat-rouge-540-2.avif",
            "/images/products/Baccarat Rouge 540/baccarat-rouge-540-3.avif"
        ],
        "category": "french",
        "gender": "للجنسين",
        "concentration": "Eau de Parfum",
        "notes": ["زعفران", "ياسمين", "خشب العنبر", "عنبر الحوت", "راتنج التنوب", "خشب الأرز"],
        "isFeatured": true,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 103,
        "name": "Bad Boy Carolina Herrera",
        "description": "عطر شرقي حار يجسد ازدواجية الرجل المتمرد. تركيبة قوية وجذابة تجمع بين الفلفل الأسود والبرغموت مع دفء الكاكاو وحبوب التونكا.",
        "price": 150000,
        "image": "/images/products/Bad Boy Carolina Herrera/bad-boy-carolina-herrera-1.avif",
        "images": [
            "/images/products/Bad Boy Carolina Herrera/bad-boy-carolina-herrera-1.avif",
            "/images/products/Bad Boy Carolina Herrera/bad-boy-carolina-herrera-2.avif",
            "/images/products/Bad Boy Carolina Herrera/bad-boy-carolina-herrera-3.avif"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Toilette",
        "notes": ["فلفل أسود", "فلفل أبيض", "برغموت", "مريمية", "أخشاب الأرز", "تونكا", "كاكاو", "خشب العنبر"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 104,
        "name": "BVLGARI MAN In Black",
        "description": "عطر جلدي زهري شرقي يعبر عن الرجولة الحديثة. يتميز بنفحات التوابل والروم مع لمسات زهرية من التوبروز والسوسن، وقاعدة دافئة من الأخشاب.",
        "price": 150000,
        "image": "/images/products/BVLGARI MAN In Black/bvlgari-man-in-black-1.webp",
        "images": [
            "/images/products/BVLGARI MAN In Black/bvlgari-man-in-black-1.webp",
            "/images/products/BVLGARI MAN In Black/bvlgari-man-in-black-2.avif",
            "/images/products/BVLGARI MAN In Black/bvlgari-man-in-black-3.webp"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Parfum",
        "notes": ["توابل", "روم", "تبغ", "جلود", "سوسن", "توبروز", "خشب الغاياك", "تونكا"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },

    {
        "id": 106,
        "name": "Creed Aventus",
        "description": "عطر رجالي أسطوري يجمع بين القوة والرؤية والنجاح. يفتتح بنفحات الأناناس والبرغموت المنعشة، ليعبر عن روح الرجل العصري الذي لا يهاب التحدي.",
        "price": 150000,
        "image": "/images/products/Creed Aventus/creed-aventus-1.webp",
        "images": [
            "/images/products/Creed Aventus/creed-aventus-1.webp",
            "/images/products/Creed Aventus/creed-aventus-2.avif",
            "/images/products/Creed Aventus/creed-aventus-3.avif"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Parfum",
        "notes": ["أناناس", "برغموت", "كشمش أسود", "بتولا", "باتشولي", "ياسمين", "مسك", "طحلب البلوط", "فانيليا", "عنبر"],
        "isFeatured": true,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 107,
        "name": "Creed Original Santal",
        "description": "عطر شرقي خشبي مستوحى من فخامة الهند الملكية. يجمع بين روح خشب الصندل الدافئة والتوابل المنعشة، ليمنحك هالة من التميز والهدوء.",
        "price": 150000,
        "image": "/images/products/Creed Original Santal/creed-original-santal-1.avif",
        "images": [
            "/images/products/Creed Original Santal/creed-original-santal-1.avif",
            "/images/products/Creed Original Santal/creed-original-santal-2.avif",
            "/images/products/Creed Original Santal/creed-original-santal-3.avif"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Parfum",
        "notes": ["خشب الصندل", "قرفة", "كزبرة", "توت العرعر", "لافندر", "زنجبيل", "تونكا", "فانيليا"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 108,
        "name": "Creed Aventus Set",
        "description": "عطر مميز من السراج للعطور. يمنحك تجربة عطرية فريدة تدوم طويلاً.",
        "price": 150000,
        "image": "/images/products/Creed Aventus Set/creed-aventus-set-1.webp",
        "images": [
            "/images/products/Creed Aventus Set/creed-aventus-set-1.webp",
            "/images/products/Creed Aventus Set/creed-aventus-set-2.avif"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Parfum",
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 109,
        "name": "Diesel Fuel For Life Homme",
        "description": "عطر حيوي ومثير يجسد الطاقة والحماس. توليفة عطرية فريدة تجمع بين اليانسون والتوت مع لمسات خشبية دافئة.",
        "price": 150000,
        "image": "/images/products/Diesel Fuel For Life Homme/diesel-fuel-for-life-homme-1.avif",
        "images": [
            "/images/products/Diesel Fuel For Life Homme/diesel-fuel-for-life-homme-1.avif",
            "/images/products/Diesel Fuel For Life Homme/diesel-fuel-for-life-homme-2.avif"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Toilette",
        "notes": ["يانسون", "جريب فروت", "توت العليق", "لافندر", "أخشاب", "هيل"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 110,
        "name": "Diesel Only The Brave",
        "description": "عطر الشجاعة والقوة للرجال. تصميم الزجاجة على شكل قبضة يعكس مضمون العطر، الذي يمزج بين الحمضيات والجلود والعنبر.",
        "price": 150000,
        "image": "/images/products/Diesel Only The Brave/diesel-only-the-brave-1.avif",
        "images": [
            "/images/products/Diesel Only The Brave/diesel-only-the-brave-1.avif",
            "/images/products/Diesel Only The Brave/diesel-only-the-brave-2.avif",
            "/images/products/Diesel Only The Brave/diesel-only-the-brave-3.jpg"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Toilette",
        "notes": ["ليمون أمالفي", "يوسفي", "بنفسج", "أخشاب الأرز", "كزبرة", "جلد", "عنبر", "لابدانوم"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 111,
        "name": "Miss Dior Eau de Toilette 2019",
        "description": "عطر زهري تشيبر رقيق ومفعم بالحيوية. يجسد دوامة من الحياة والحب بنفحات البرتقال الأحمر والورد الدمشقي، لامرأة تشع فرحاً وأناقة.",
        "price": 150000,
        "image": "/images/products/Dior (Christian Dior) Miss Dior 2019 Eau/dior-(christian-dior)-miss-dior-2019-eau-1.avif",
        "images": [
            "/images/products/Dior (Christian Dior) Miss Dior 2019 Eau/dior-(christian-dior)-miss-dior-2019-eau-1.avif",
            "/images/products/Dior (Christian Dior) Miss Dior 2019 Eau/dior-(christian-dior)-miss-dior-2019-eau-2.avif",
            "/images/products/Dior (Christian Dior) Miss Dior 2019 Eau/dior-(christian-dior)-miss-dior-2019-eau-3.webp"
        ],
        "category": "women",
        "gender": "نسائي",
        "concentration": "Eau de Toilette",
        "notes": ["برتقال أحمر", "يوسفي", "ورد غراس", "ورد دمشقي", "زنبق الوادي", "باتشولي"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },

    {
        "id": 113,
        "name": "Dolce & Gabbana The One",
        "description": "عطر شرقي زهري دافئ وجذاب يعكس سحر المرأة الاستثنائية. تمازج رائع بين الفواكه والزهور البيضاء مع قاعدة غنية من الفانيليا والعنبر.",
        "price": 150000,
        "image": "/images/products/Dolce Gabbana The One/dolce-gabbana-the-one-1.avif",
        "images": [
            "/images/products/Dolce Gabbana The One/dolce-gabbana-the-one-1.avif",
            "/images/products/Dolce Gabbana The One/dolce-gabbana-the-one-2.avif",
            "/images/products/Dolce Gabbana The One/dolce-gabbana-the-one-3.webp"
        ],
        "category": "women",
        "gender": "نسائي",
        "concentration": "Eau de Parfum",
        "notes": ["خوخ", "ليتشي", "يوسفي", "زنبق", "ياسمين", "برقوق", "فانيليا", "عنبر", "مسك"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 114,
        "name": "Armani Stronger With You Intensely",
        "description": "عطر شرقي فوجير يعكس قصة حب قوية وشغوفة. يتميز بتركيزه المكثف الذي يمزج بين التوابل والفانيليا والحلوى، لرجل ذو جاذبية لا تقاوم.",
        "price": 150000,
        "image": "/images/products/Emporio Armani Stronger With You Intensly/emporio-armani-stronger-with-you-intensly-1.jpg",
        "images": [
            "/images/products/Emporio Armani Stronger With You Intensly/emporio-armani-stronger-with-you-intensly-1.jpg",
            "/images/products/Emporio Armani Stronger With You Intensly/emporio-armani-stronger-with-you-intensly-2.jpg"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Parfum",
        "notes": ["فلفل وردي", "عرعر", "بنفسج", "توفي", "قرفة", "مريمية", "فانيليا", "تونكا", "عنبر"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 115,
        "name": "Armani Stronger With You Leather",
        "description": "إصدار حصري فاخر يبرز نوتة الجلود الأنيقة. عطر دافئ ومميز للرجل، يمزج بين الجلد الثمين والأخشاب والتوابل الشرقية.",
        "price": 150000,
        "image": "/images/products/Emporio Armani Stronger With You Leather/emporio-armani-stronger-with-you-leather-1.webp",
        "images": [
            "/images/products/Emporio Armani Stronger With You Leather/emporio-armani-stronger-with-you-leather-1.webp"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Parfum",
        "notes": ["كستناء", "توابل", "إليمي", "مريمية", "لافندر", "جلود", "فانيليا", "عود", "خشب الغاياك"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 116,
        "name": "Giorgio Armani Code",
        "description": "العطر الشرقي الحار الأول من أرماني. عطر أنيق وجذاب يجمع بين الحمضيات المنعشة ونفحات الجلد والتبغ الغامضة.",
        "price": 150000,
        "image": "/images/products/Giorgio Armani Code/giorgio-armani-code-1.webp",
        "images": [
            "/images/products/Giorgio Armani Code/giorgio-armani-code-1.webp",
            "/images/products/Giorgio Armani Code/giorgio-armani-code-2.webp"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Toilette",
        "notes": ["برغموت", "ليمون", "يانسون نجمي", "زهر الزيتون", "خشب الغاياك", "جلود", "تبغ", "تونكا"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },


    {
        "id": 120,
        "name": "Hugo Boss Hugo Man",
        "description": "عطر أروماتك أخضر أيقوني للرجال. يجسد روح المغامرة بتركيبته المنعشة من التفاح الأخضر والنعناع والصنوبر.",
        "price": 150000,
        "image": "/images/products/Hugo Boss Hugo Man/hugo-boss-hugo-man-1.avif",
        "images": [
            "/images/products/Hugo Boss Hugo Man/hugo-boss-hugo-man-1.avif",
            "/images/products/Hugo Boss Hugo Man/hugo-boss-hugo-man-2.jpg"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Toilette",
        "notes": ["تفاح أخضر", "نعناع", "لافندر", "جريب فروت", "مريمية", "إبرة الراعي", "صنوبر", "باتشولي", "طحلب"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 121,
        "name": "Invictus Legend",
        "description": "إصدار أكثر كثافة وإثارة من Invictus. عطر خشبي أروماتك يجمع بين نضارة مياه البحر وحرارة التوابل والعنبر الأحمر.",
        "price": 150000,
        "image": "/images/products/INVICTUS LEGEND Tester/invictus-legend-tester-1.jpg",
        "images": [
            "/images/products/INVICTUS LEGEND Tester/invictus-legend-tester-1.jpg"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Parfum",
        "notes": ["نسيم البحر", "ملح البحر", "جريب فروت", "ورق الغار", "إبرة الراعي", "توادر", "عنبر أحمر", "خشب الغاياك"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 122,
        "name": "Invictus",
        "description": "عطر الانتصار والطاقة. مزيج رياضي منعش من الجريب فروت ونسيم البحر مع لمسات دافئة من أخشاب الغاياك.",
        "price": 150000,
        "image": "/images/products/Invictus/invictus-1.avif",
        "images": [
            "/images/products/Invictus/invictus-1.avif",
            "/images/products/Invictus/invictus-2.avif",
            "/images/products/Invictus/invictus-3.webp"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Toilette",
        "notes": ["جريب فروت", "نسيم البحر", "يوسفي", "ورق الغار", "ياسمين", "خشب الغاياك", "طحلب البلوط", "باتشولي"],
        "isFeatured": true,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 123,
        "name": "JOOP! Homme",
        "description": "عطر شرقي فوجير كلاسيكي للرجال. يتميز برائحة جريئة وجذابة تجمع بين زهر البرتقال والقرفة والفانيليا، ليعطي انطباعاً بالجاذبية والثقة.",
        "price": 150000,
        "image": "/images/products/JOOP! Homme/joop!-homme-1.avif",
        "images": [
            "/images/products/JOOP! Homme/joop!-homme-1.avif",
            "/images/products/JOOP! Homme/joop!-homme-2.avif",
            "/images/products/JOOP! Homme/joop!-homme-3.webp"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Toilette",
        "notes": ["زهر البرتقال", "يوسفي", "برغموت", "ليمون", "قرفة", "هيل", "ياسمين", "فانيليا", "تونكا", "خشب الصندل", "باتشولي"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 125,
        "name": "Joy by Dior",
        "description": "عطر السعادة والضوء. يجسد الفرح بلمسات من الحمضيات والزهور، مع دفء خشب الصندل والمسك الأبيض.",
        "price": 150000,
        "image": "/images/products/Joy Dior Perfume Tester/joy-dior-perfume-tester-1.webp",
        "images": [
            "/images/products/Joy Dior Perfume Tester/joy-dior-perfume-tester-1.webp",
            "/images/products/Joy Dior Perfume Tester/joy-dior-perfume-tester-2.jpg"
        ],
        "category": "women",
        "gender": "نسائي",
        "concentration": "Eau de Parfum",
        "notes": ["برغموت", "يوسفي", "ورد غراس", "ياسمين", "خشب الصندل", "أرز", "مسك أبيض", "باتشولي"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 126,
        "name": "K by Dolce & Gabbana",
        "description": "عطر الملك العصري. يجمع بين انتعاش الحمضيات الصقلي وحرارة التوابل، مع لمسة خشبية ملكية.",
        "price": 150000,
        "image": "/images/products/K&Q By Dolce&Gabbana K/k&q-by-dolce&gabbana-k-1.avif",
        "images": [
            "/images/products/K&Q By Dolce&Gabbana K/k&q-by-dolce&gabbana-k-1.avif",
            "/images/products/K&Q By Dolce&Gabbana K/k&q-by-dolce&gabbana-k-2.avif",
            "/images/products/K&Q By Dolce&Gabbana K/k&q-by-dolce&gabbana-k-3.avif"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Toilette",
        "notes": ["توت العرعر", "حمضيات", "برتقال أحمر", "ليمون صقلي", "فلفل حار", "لافندر", "مريمية", "نجيل الهند", "أرز"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 127,
        "name": "Tiziana Terenzi Kirke",
        "description": "عطر ساحر ومغري بتركيز عالي (Extrait de Parfum). يمزج بين الفواكه الحلوة والمسك الحسي، ليأخذك في رحلة خيالية.",
        "price": 150000,
        "image": "/images/products/Kirke Tiziana Terenzi/kirke-tiziana-terenzi-1.avif",
        "images": [
            "/images/products/Kirke Tiziana Terenzi/kirke-tiziana-terenzi-1.avif",
            "/images/products/Kirke Tiziana Terenzi/kirke-tiziana-terenzi-2.avif"
        ],
        "category": "women",
        "gender": "نسائي",
        "concentration": "Eau de Parfum",
        "notes": ["ثمار العاطفة", "خوخ", "توت العليق", "كمثرى", "زنبق الوادي", "مسك", "صندل", "فانيليا", "هيلوتروب"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 128,
        "name": "L'Eau Majeure d'Issey",
        "description": "عطر مستوحى من قوة المياه والمحيط. يجمع بين الانتعاش المالح والأخشاب، ليمنحك شعوراً بالقوة والحرية.",
        "price": 150000,
        "image": "/images/products/L Eau Majeure D Issey/l-eau-majeure-d-issey-1.avif",
        "images": [
            "/images/products/L Eau Majeure D Issey/l-eau-majeure-d-issey-1.avif",
            "/images/products/L Eau Majeure D Issey/l-eau-majeure-d-issey-2.avif"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Toilette",
        "notes": ["جريب فروت", "برغموت", "نسيم البحر", "كشميران", "أخشاب عنبرية"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 129,
        "name": "Creed Millesime Imperial",
        "description": "عطر الملوك والأباطرة. مزيج ذهبي منعش من الفواكه وملح البحر، يعكس الفخامة والرقي المطلق.",
        "price": 150000,
        "image": "/images/products/Millesime For Women & Men Millesime Imperial/millesime-for-women-&-men-millesime-imperial-1.avif",
        "images": [
            "/images/products/Millesime For Women & Men Millesime Imperial/millesime-for-women-&-men-millesime-imperial-1.avif",
            "/images/products/Millesime For Women & Men Millesime Imperial/millesime-for-women-&-men-millesime-imperial-2.avif",
            "/images/products/Millesime For Women & Men Millesime Imperial/millesime-for-women-&-men-millesime-imperial-3.avif"
        ],
        "category": "french",
        "gender": "للجنسين",
        "concentration": "Eau de Parfum",
        "notes": ["فواكه", "ملح البحر", "ليمون صقلي", "برغموت", "سوسن", "مسك", "خشب الصندل"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 130,
        "name": "My Burberry Parfum",
        "description": "عطر يجسد حديقة لندنية بعد المطر. رائحة زهرية كثيفة تجمع بين الورد والباتشولي بلمسة عصرية.",
        "price": 150000,
        "image": "/images/products/My Burberry Parfum 90 Ml/my-burberry-parfum-90-ml-1.webp",
        "images": [
            "/images/products/My Burberry Parfum 90 Ml/my-burberry-parfum-90-ml-1.webp"
        ],
        "category": "women",
        "gender": "نسائي",
        "concentration": "Eau de Parfum",
        "notes": ["بازلاء حلوة", "برغموت", "إبرة الراعي", "سفرجل", "فريسيا", "ورد دمشقي", "باتشولي"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 131,
        "name": "Paco Rabanne 1 Million",
        "description": "عطر الجرأة والثراء. تركيبة حارة وجذابة تمزج بين الانتعاش والتوابل والجلود، لتجربة عطرية لا تُنسى.",
        "price": 150000,
        "image": "/images/products/Paco Rabanne One Million/paco-rabanne-one-million-1.jpg",
        "images": [
            "/images/products/Paco Rabanne One Million/paco-rabanne-one-million-1.jpg",
            "/images/products/Paco Rabanne One Million/paco-rabanne-one-million-2.webp"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Toilette",
        "notes": ["يوسفي", "نعناع", "قرفة", "ورد", "عنبر", "جلد", "أخشاب"],
        "isFeatured": true,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 132,
        "name": "Paco Rabanne Black XS",
        "description": "عطر الروك آند رول. مزيج متمرد من التوابل والحلوى والأخشاب، لرجل يتمتع بروح حرة وجريئة.",
        "price": 150000,
        "image": "/images/products/Paco Rabanne XS Black/paco-rabanne-xs-black-1.jpg",
        "images": [
            "/images/products/Paco Rabanne XS Black/paco-rabanne-xs-black-1.jpg",
            "/images/products/Paco Rabanne XS Black/paco-rabanne-xs-black-2.webp"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Toilette",
        "notes": ["مريمية", "ليمون", "تولو بلسم", "هيل أسود", "قرفة", "برالين", "باتشولي", "عنبر أسود"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 133,
        "name": "Olympea Legend Paco Rabanne",
        "description": "عطر الآلهة الأسطوري. مزيج ساحر من البرقوق المملح والفانيليا العنبرية، يترك أثراً لا يقاوم.",
        "price": 150000,
        "image": "/images/products/PACO RABANNE Olympea Legend Eau De Parfum/paco-rabanne-olympea-legend-eau-de-parfum-1.jpg",
        "images": [
            "/images/products/PACO RABANNE Olympea Legend Eau De Parfum/paco-rabanne-olympea-legend-eau-de-parfum-1.jpg"
        ],
        "category": "women",
        "gender": "نسائي",
        "concentration": "Eau de Parfum",
        "notes": ["برقوق", "مشمش", "ملح البحر", "فانيليا", "عنبر", "رمل", "تونكا"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 134,
        "name": "Pure XS For Her",
        "description": "عطر الإثارة والجاذبية. انفجار من الفشار المكرمل والفانيليا وزهرة اليلانج يلانج، لامرأة فاتنة.",
        "price": 150000,
        "image": "/images/products/Pure Xs Paco Rabanne/pure-xs-paco-rabanne-1.jpg",
        "images": [
            "/images/products/Pure Xs Paco Rabanne/pure-xs-paco-rabanne-1.jpg",
            "/images/products/Pure Xs Paco Rabanne/pure-xs-paco-rabanne-2.jpg",
            "/images/products/Pure Xs Paco Rabanne/pure-xs-paco-rabanne-3.avif"
        ],
        "category": "women",
        "gender": "نسائي",
        "concentration": "Eau de Parfum",
        "notes": ["يلانج يلانج", "فشار", "فانيليا", "خشب الصندل", "بذور الأمبريت", "زهر البرتقال", "خوخ", "عنبر"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 135,
        "name": "Pure XS For Him",
        "description": "عطر التناقضات المثير. يجمع بين برودة الزنجبيل وحرارة الفانيليا والمر، لرجل يملك جاذبية لا تقاوم.",
        "price": 150000,
        "image": "/images/products/Pure Xs Paco Rabanne Man/pure-xs-paco-rabanne-man-1.avif",
        "images": [
            "/images/products/Pure Xs Paco Rabanne Man/pure-xs-paco-rabanne-man-1.avif",
            "/images/products/Pure Xs Paco Rabanne Man/pure-xs-paco-rabanne-man-2.avif",
            "/images/products/Pure Xs Paco Rabanne Man/pure-xs-paco-rabanne-man-3.avif"
        ],
        "category": "men",
        "gender": "رجالي",
        "concentration": "Eau de Toilette",
        "notes": ["زنجبيل", "نسغ أخضر", "زعتر", "فانيليا", "قرفة", "جلود", "مشروب كحولي", "أرز", "المر", "سكر"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 136,
        "name": "Reed Diffuser Golden Silva",
        "description": "عطر مميز من السراج للعطور. يمنحك تجربة عطرية فريدة تدوم طويلاً.",
        "price": 150000,
        "image": "/images/products/Reed Diffuser Golden Silva Cikolata/reed-diffuser-golden-silva-cikolata-1.png",
        "images": [
            "/images/products/Reed Diffuser Golden Silva Cikolata/reed-diffuser-golden-silva-cikolata-1.png"
        ],
        "category": "oils",
        "gender": "للجنسين",
        "concentration": "Diffuser",
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },

    {
        "id": 138,
        "name": "Si Intense Giorgio Armani",
        "description": "عطر التشيبر الشرقي الغني. نسخة أكثر كثافة وجاذبية من عطر Si الشهير، يمزج بين الكشمش الأسود والورد والباتشولي.",
        "price": 150000,
        "image": "/images/products/Sì Intense Giorgio Armani/sì-intense-giorgio-armani-1.webp",
        "images": [
            "/images/products/Sì Intense Giorgio Armani/sì-intense-giorgio-armani-1.webp",
            "/images/products/Sì Intense Giorgio Armani/sì-intense-giorgio-armani-2.webp"
        ],
        "category": "women",
        "gender": "نسائي",
        "concentration": "Eau de Parfum",
        "notes": ["كشمش أسود", "ورد تركي", "دافانا", "باتشولي", "بنزوين"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 139,
        "name": "Si Passione Giorgio Armani",
        "description": "عطر الشغف والحب. زجاجة حمراء جريئة تحتوي على مزيج مشرق من الكمثرى والفلفل الوردي والورد، لامرأة قوية وحازمة.",
        "price": 150000,
        "image": "/images/products/Sì Passione Giorgio Armani/sì-passione-giorgio-armani-1.avif",
        "images": [
            "/images/products/Sì Passione Giorgio Armani/sì-passione-giorgio-armani-1.avif"
        ],
        "category": "women",
        "gender": "نسائي",
        "concentration": "Eau de Parfum",
        "notes": ["كمثرى", "كشمش أسود", "فلفل وردي", "جريب فروت", "أناناس", "ورد", "ياسمين", "فانيليا", "أرز"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 140,
        "name": "Tom Ford Black Orchid",
        "description": "عطر أيقوني فاخر وغامض للجنسين. يمزج بين الأوركيد الأسود والتوابل والباتشولي في زجاجة سوداء أنيقة تعكس الفخامة.",
        "price": 150000,
        "image": "/images/products/Tom Ford Black Orchid/tom-ford-black-orchid-1.avif",
        "images": [
            "/images/products/Tom Ford Black Orchid/tom-ford-black-orchid-1.avif",
            "/images/products/Tom Ford Black Orchid/tom-ford-black-orchid-2.avif",
            "/images/products/Tom Ford Black Orchid/tom-ford-black-orchid-3.webp"
        ],
        "category": "french",
        "gender": "للجنسين",
        "concentration": "Eau de Parfum",
        "notes": ["ترفل", "جاردينيا", "كشمش أسود", "يلانج يلانج", "برغموت", "أوركيد أسود", "توابل", "فواكه", "باتشولي", "بخور", "شوكولاتة"],
        "isFeatured": true,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 141,
        "name": "Tom Ford Oud Wood Intense",
        "description": "عطر العود الأسطوري بلمسة أكثر كثافة. يجمع بين العود الفاخر وحشيشة الملاك والسرو، لتجربة عطرية دخانية وعميقة.",
        "price": 150000,
        "image": "/images/products/Tom Ford Oud Wood Intense/tom-ford-oud-wood-intense-1.avif",
        "images": [
            "/images/products/Tom Ford Oud Wood Intense/tom-ford-oud-wood-intense-1.avif",
            "/images/products/Tom Ford Oud Wood Intense/tom-ford-oud-wood-intense-2.avif",
            "/images/products/Tom Ford Oud Wood Intense/tom-ford-oud-wood-intense-3.avif"
        ],
        "category": "french",
        "gender": "للجنسين",
        "concentration": "Eau de Parfum",
        "notes": ["عود", "حشيشة الملاك", "سرو", "زنجبيل", "عرعر", "castoreum"],
        "isFeatured": true,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 142,
        "name": "Trussardi Donna",
        "description": "عطر الأنوثة الإيطالية الراقية. مزيج مشرق من يوزو والحمضيات مع قلب زهري أبيض وقاعدة خشبية دافئة.",
        "price": 150000,
        "image": "/images/products/Trussardi Donna/trussardi-donna-1.avif",
        "images": [
            "/images/products/Trussardi Donna/trussardi-donna-1.avif",
            "/images/products/Trussardi Donna/trussardi-donna-2.avif",
            "/images/products/Trussardi Donna/trussardi-donna-3.webp"
        ],
        "category": "women",
        "gender": "نسائي",
        "concentration": "Eau de Parfum",
        "notes": ["يوزو", "ليمون", "فواكه مائية", "زهر البرتقال", "شاي الياسمين", "لوتس", "خشب الصندل", "باتشولي", "فانيليا"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },

    {
        "id": 145,
        "name": "Victoria's Secret Bombshell",
        "description": "عطر الثقة والتألق. مزيج فاكهي زهري مشرق من فاكهة العاطفة والفاوانيا والأوركيد، يمنحك إحساساً بالانتعاش والجاذبية.",
        "price": 150000,
        "image": "/images/products/Victoria Secret Bombshell/victoria-secret-bombshell-1.jpg",
        "images": [
            "/images/products/Victoria Secret Bombshell/victoria-secret-bombshell-1.jpg",
            "/images/products/Victoria Secret Bombshell/victoria-secret-bombshell-2.jpg"
        ],
        "category": "women",
        "gender": "نسائي",
        "concentration": "Eau de Parfum",
        "notes": ["ثمار العاطفة", "جريب فروت", "أناناس", "يوسفي", "فراولة", "فاوانيا", "أوركيد", "ياسمين", "مسك"],
        "isFeatured": true,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },
    {
        "id": 146,
        "name": "Victoria's Secret Very Sexy Orchid",
        "description": "عطر ليلي ساحر ومغرٍ. يجمع بين ثراء الكشمش الأسود وأناقة الأوركيد وعمق الباتشولي، لإطلالة لا تنسى.",
        "price": 150000,
        "image": "/images/products/Victoria'S Secret Very Sexy Orchid/victoria's-secret-very-sexy-orchid-1.jpg",
        "images": [
            "/images/products/Victoria'S Secret Very Sexy Orchid/victoria's-secret-very-sexy-orchid-1.jpg",
            "/images/products/Victoria'S Secret Very Sexy Orchid/victoria's-secret-very-sexy-orchid-2.jpg",
            "/images/products/Victoria'S Secret Very Sexy Orchid/victoria's-secret-very-sexy-orchid-3.jpg"
        ],
        "category": "women",
        "gender": "نسائي",
        "concentration": "Eau de Parfum",
        "notes": ["كشمش أسود", "حمضيات", "فلفل وردي", "أوركيد", "سوسن", "باتشولي", "خشب الصندل"],
        "isFeatured": false,
        "isOffer": false,
        sizes: [
            { size: "50 مل", price: 150000 },
            { size: "100 مل", price: 200000 }
        ]
    },

    {
        id: 1768578012523,
        name: "212",
        description: "hammer",
        price: 1499999,
        image: "/images/uploads/1768577952257-212-Sexy-men-Toilette.jpg",
        images: ["/images/uploads/1768577952257-212-Sexy-men-Toilette.jpg"],
        category: "men",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        isFeatured: true,
        isOffer: false,
        sizes: [
            { size: "50 مل", price: 1499999 },
            { size: "100 مل", price: 1549999 }
        ]
    },

    {
        id: 1768578470406,
        name: "Nice ",
        description: "hammer",
        price: 1500000,
        image: "/images/uploads/1768582962531-Absolutely-Irresistible-Givenchy-Perfum.jpg",
        images: ["/images/uploads/1768582962531-Absolutely-Irresistible-Givenchy-Perfum.jpg"],
        category: "men",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        isFeatured: true,
        isOffer: false,
        sizes: [
            { size: "50 مل", price: 1500000 },
            { size: "100 مل", price: 1550000 }
        ]
    },
    
    
    {
        id: 1768587272658,
        name: "Diala",
        description: "schön ",
        price: 31331,
        originalPrice: -5,
        image: "/images/uploads/1768587262498-Acqua-Di-Gio2-Giorigo-Armani-Perfum.jpg",
        images: ["/images/uploads/1768587262498-Acqua-Di-Gio2-Giorigo-Armani-Perfum.jpg"],
        category: "men",
        gender: "رجالي",
        concentration: "Eau de Parfum",
        size: "100 مل",
        isFeatured: false,
        isOffer: true
    },];
