import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'السراج للعطور',
        short_name: 'السراج للعطور',
        description: 'أفضل العطور العالمية والشرقية في أوروبا',
        start_url: '/',
        display: 'standalone',
        background_color: '#0B1221',
        theme_color: '#D4AF37',
        orientation: 'portrait',
        lang: 'ar',
        scope: '/',
        categories: ['shopping', 'lifestyle'],
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
