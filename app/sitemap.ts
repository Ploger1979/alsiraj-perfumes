import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://alsiraj-perfumes.com'

    // 1. الصفحات الثابتة
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/products/perfumes/men`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/products/perfumes/women`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/products/perfumes/unisex`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ]

    // 2. جلب جميع المنتجات من قاعدة البيانات لجعلها تظهر في جوجل
    try {
        await dbConnect()
        const products = await Product.find({}, { id: 1, updatedAt: 1 }).lean()

        const productUrls: MetadataRoute.Sitemap = products.map((product: any) => ({
            url: `${baseUrl}/products/${product.id}`,
            lastModified: product.updatedAt || new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        }))

        return [...staticPages, ...productUrls]
    } catch (error) {
        console.error('Sitemap error:', error)
        return staticPages
    }
}
