
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import fs from 'fs';
import path from 'path';

// قائمة منتجات مع بدائل روابط متعددة (Multi-Source Fallback)
const TARGETS: Record<string, string[]> = {
    "passione": [
        "https://m.media-amazon.com/images/I/51pK6y3k7QL._SX522_.jpg", // Amazon 1
        "https://fimgs.net/mdimg/perfume/375x500.48002.jpg",            // Fragrantica (Needs UA)
        "https://www.sephora.com/productimages/sku/s2030575-main-zoom.jpg?imwidth=500" // Sephora
    ],
    "intense": [
        "https://m.media-amazon.com/images/I/61Sdwf-xPUL._SL1500_.jpg", // Generic Boss default? Wait, Si Intense
        "https://fimgs.net/mdimg/perfume/375x500.64555.jpg",
        "https://m.media-amazon.com/images/I/71Y-F0fV+TL._SL1500_.jpg" // Stronger With You Intensely
    ],
    "boss bottled": [
        "https://m.media-amazon.com/images/I/71I6g-s+SFL._SY355_.jpg", // Amazon
        "https://fimgs.net/mdimg/perfume/375x500.383.jpg",
        "https://m.media-amazon.com/images/I/61Sdwf-xPUL._SL1500_.jpg"
    ],
    "baccarat": [
        "https://upload.wikimedia.org/wikipedia/commons/3/33/Baccarat_Rouge_540.jpg",
        "https://m.media-amazon.com/images/I/61qHk0+hLNL._SL1500_.jpg",
        "https://fimgs.net/mdimg/perfume/375x500.31291.jpg"
    ]
};

export async function GET() {
    try {
        await dbConnect();
        const logs: string[] = [];
        const publicDir = path.join(process.cwd(), 'public', 'images', 'products');

        // Create base directory
        if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

        for (const [key, urls] of Object.entries(TARGETS)) {
            // Find Matching Products
            const products = await Product.find({ name: { $regex: key, $options: 'i' } });

            if (products.length === 0) continue;

            for (const product of products) {
                let downloaded = false;
                const safeName = product.name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
                const folderPath = path.join(publicDir, safeName);

                if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

                // Try URLs one by one
                for (const url of urls) {
                    try {
                        console.log(`Trying to download for ${product.name}: ${url}`);
                        const res = await fetch(url, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                            }
                        });

                        if (!res.ok) continue; // Try next URL

                        const buffer = Buffer.from(await res.arrayBuffer());

                        // Check if valid image (not small html error page)
                        if (buffer.length < 1000) continue;

                        const fileName = '1.jpg';
                        const filePath = path.join(folderPath, fileName);
                        fs.writeFileSync(filePath, buffer);

                        // Success! Update DB and break loop
                        const dbPath = `/images/products/${safeName}/${fileName}`;
                        product.image = dbPath;
                        product.images = [dbPath];
                        await product.save();

                        logs.push(`✅ SUCCESS: ${product.name} loaded from ${url}`);
                        downloaded = true;
                        break;

                    } catch (e: any) {
                        console.error(e);
                    }
                }

                if (!downloaded) {
                    logs.push(`❌ FAILED all sources for: ${product.name}`);
                }
            }
        }

        return NextResponse.json({ success: true, logs });

    } catch (error) {
        return NextResponse.json({ error: 'Failed', details: error }, { status: 500 });
    }
}
