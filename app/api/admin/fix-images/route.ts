
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import fs from 'fs';
import path from 'path';

// =========================================================================================
// 🌍 ULTIMATE IMAGE FIXER (إصلاح الصور النهائي)
// Uses strictly reliable CDN links (Sephora, FragranceX, Amazon)
// =========================================================================================

const RELIABLE_IMAGES: Record<string, string> = {
    // 🌟 THE "MUST FIX" LIST (Using 100% reliable links now)

    // Baccarat Rouge 540 (Red Bottle)
    "Maison Francis Kurkdjian Baccarat Rouge 540": "https://img.fragrancex.com/images/products/sku/large/mfkbrou5425s.jpg",

    // Si Passione (Red Bottle) - Sephora link usually stable, or FragranceX
    "Giorgio Armani Si Passione": "https://img.fragrancex.com/images/products/sku/large/giorgio-armani-si-passione-eau-de-parfum-spray-3-4-oz-women.jpg",

    // Boss Bottled (Classic No.6)
    "Hugo Boss Boss Bottled": "https://img.fragrancex.com/images/products/sku/large/hugo-boss-no-6-bottled-eau-de-toilette-spray-3-3-oz-men.jpg",

    // Hugo Man (Green Canteen)
    "Hugo Boss Hugo Man (Hugo EDT)": "https://img.fragrancex.com/images/products/sku/large/hugomts34.jpg",

    // Pure XS (Snake Bottle)
    "Paco Rabanne Pure XS": "https://img.fragrancex.com/images/products/sku/large/pacpux34.jpg",

    // Invictus (Trophy)
    "Paco Rabanne Invictus": "https://img.fragrancex.com/images/products/sku/large/pacinvicts34.jpg",

    // Terre d'Hermes
    "Hermès Terre d’Hermès": "https://img.fragrancex.com/images/products/sku/large/hertdh33ts.jpg",

    // Tom Ford Oud Wood
    "Tom Ford Oud Wood Intense": "https://img.fragrancex.com/images/products/sku/large/tomowiu34.jpg",

    // Creed Millésime Impérial (Gold Bottle)
    "Creed Millésime Impérial": "https://img.fragrancex.com/images/products/sku/large/cremiu33.jpg",

    // Creed Aventus Gift Set logic
    "Creed Aventus Travel Gift Set": "https://creedboutique.com/cdn/shop/files/Aventus-Travel-Set-Creed-Fragrances_1400x.jpg",

    // Bad Boy
    "Carolina Herrera Bad Boy": "https://img.fragrancex.com/images/products/sku/large/chbbm34.jpg",
};

function getTokens(str: string) {
    if (!str) return [];
    return str.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 2);
}

export async function GET() {
    try {
        await dbConnect();

        let logs: string[] = [];
        let updatedCount = 0;

        // 1. RELIABLE IMAGE OVERRIDE (Fix known bad images first)
        for (const [nameKey, imageUrl] of Object.entries(RELIABLE_IMAGES)) {
            // Find products matching loosely
            const products = await Product.find({ name: { $regex: nameKey, $options: 'i' } });

            for (const p of products) {
                // FORCE UPDATE for the problematic ones
                // Or update if missing/placeholder
                let forceUpdate = false;
                if (nameKey.includes("Baccarat") || nameKey.includes("Passione") || nameKey.includes("Boss Bottled")) {
                    forceUpdate = true;
                }

                if (forceUpdate || !p.image || p.image.includes('placeholder')) {
                    p.image = imageUrl;
                    p.images = [imageUrl];
                    await p.save();
                    updatedCount++;
                    logs.push(`Fixed ${p.name} with reliable image`);
                }
            }
        }

        // 2. LOCAL FOLDER MATCH (For everything else)
        const products = await Product.find({});
        const imagesDir = path.join(process.cwd(), 'public', 'images', 'products');

        let productFolders: string[] = [];
        try {
            if (fs.existsSync(imagesDir)) {
                productFolders = fs.readdirSync(imagesDir).filter(file => fs.statSync(path.join(imagesDir, file)).isDirectory());
            }
        } catch (e) {
            console.error(e);
        }

        for (const product of products) {
            // Include a condition to check if the image is valid - to not overwrite the Reliable Images we just set
            // If image is from FragranceX/Sephora/Amazon/Creed, KEEP IT.
            if (product.image && (product.image.includes('fragrancex') || product.image.includes('sephora') || product.image.includes('creed') || product.image.includes('amazon'))) continue;

            // Only attempt local fix if we haven't fixed it yet or it's still placeholder
            if (!product.image || product.image.includes('placeholder')) {
                const productTokens = getTokens(product.name);
                let bestMatch = { folder: '', score: 0 };

                productFolders.forEach(folder => {
                    const folderTokens = getTokens(folder);
                    let score = 0;
                    productTokens.forEach(pToken => {
                        if (folderTokens.includes(pToken)) score += 3;
                        else if (folderTokens.some(fToken => fToken.includes(pToken) || pToken.includes(fToken))) score += 1;
                    });

                    if (score > bestMatch.score) bestMatch = { folder: folder, score: score };
                });

                if (bestMatch.score >= 4) {
                    const folderPath = path.join(imagesDir, bestMatch.folder);
                    try {
                        const files = fs.readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
                        if (files.length > 0) {
                            product.image = `/images/products/${bestMatch.folder}/${files[0]}`;
                            product.images = files.map(f => `/images/products/${bestMatch.folder}/${f}`);
                            await product.save();
                            updatedCount++;
                            logs.push(`Local fix: ${product.name} -> ${bestMatch.folder}`);
                        }
                    } catch (e) { }
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Ultimate Fix Complete. Updated ${updatedCount}.`,
            logs: logs
        });

    } catch (error) {
        return NextResponse.json({ error: 'Fix failed', details: error }, { status: 500 });
    }
}
