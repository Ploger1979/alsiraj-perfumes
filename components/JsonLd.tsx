export default function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Store",
        "name": "السراج للعطور | Alsiraj Perfumes",
        "image": "https://alsiraj-perfumes.com/alsiraj-cover.png",
        "logo": "https://alsiraj-perfumes.com/logo-og.png",
        "description": "اكتشف عالم الفخامة مع السراج للعطور. نقدم أرقى العطور الفرنسية والشرقية، زيوت عطرية فاخرة، وعطور النيش.",
        "url": "https://alsiraj-perfumes.com",
        "telephone": "+9647735856711",
        "email": "info@alsiraj-perfumes.com",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "DE"
        },
        "priceRange": "€€",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ],
                "opens": "09:00",
                "closes": "20:00"
            }
        ],
        "sameAs": [
            "https://www.facebook.com/profile.php?id=100066571796739",
            "https://www.instagram.com/alsirajperfumes/",
            "https://www.tiktok.com/@alsirajperfumes3"
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
