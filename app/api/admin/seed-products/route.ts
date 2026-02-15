
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import fs from 'fs';
import path from 'path';

// قائمة المنتجات التي استخرجتها من الصور (القائمة البيضاء)
const PRODUCTS_SOURCE = [
    { name: "Mugler A*Men Pure Havane", price: 24000 },
    { name: "Creed Aventus Travel Gift Set", price: 27000 },
    { name: "Maison Francis Kurkdjian Baccarat Rouge 540", price: 30000 },
    { name: "Carolina Herrera Bad Boy", price: 22000 },
    { name: "Bvlgari Man in Black", price: 23000 },
    { name: "Chanel Bleu de Chanel", price: 25000 },
    { name: "Creed Aventus", price: 30000 },
    { name: "Creed Original Santal", price: 26000 },
    { name: "Creed Aventus Gift Set", price: 29000 },
    { name: "Diesel Fuel for Life Homme", price: 18000 },
    { name: "Diesel Only the Brave", price: 19000 },
    { name: "Dior Miss Dior Eau de Parfum (2019)", price: 24000 },
    { name: "Dior J’adore", price: 25000 },
    { name: "Dolce & Gabbana The One", price: 23000 },
    { name: "Giorgio Armani Stronger With You Intensely", price: 23000 },
    { name: "Giorgio Armani Stronger With You Leather", price: 22000 },
    { name: "Giorgio Armani Code", price: 24000 },
    { name: "Giorgio Armani Stronger With You Eau de Parfum Intense", price: 24000 },
    { name: "Carolina Herrera Good Girl", price: 23000 },
    { name: "Hugo Boss Boss Bottled", price: 21000 },
    { name: "Hugo Boss Hugo Man (Hugo EDT)", price: 20000 },
    { name: "Paco Rabanne Invictus", price: 22000 },
    { name: "Paco Rabanne Invictus Legend", price: 23000 },
    { name: "JOOP! Homme", price: 21000 },
    { name: "Dior Joy by Dior", price: 24000 },
    { name: "Dolce & Gabbana K by Dolce & Gabbana", price: 23000 },
    { name: "Tiziana Terenzi Kirke", price: 26000 },
    { name: "Issey Miyake L’Eau Majeure d’Issey", price: 23000 },
    { name: "Creed Millésime Impérial", price: 28000 },
    { name: "Burberry My Burberry Parfum", price: 24000 },
    { name: "Paco Rabanne XS Black", price: 22000 },
    { name: "Paco Rabanne Olympea Legend Eau de Parfum", price: 23000 },
    { name: "Paco Rabanne Pure XS", price: 22000 },
    { name: "Paco Rabanne Pure XS for Him", price: 22000 },
    { name: "Raumduft Reed Diffuser Golden Silver Schokolade", price: 15000 },
    { name: "Dior Sauvage Eau de Parfum", price: 25000 },
    { name: "Giorgio Armani Sì Intense", price: 24000 },
    { name: "Giorgio Armani Sì Passione", price: 24000 },
    { name: "Hermès Terre d’Hermès", price: 25000 },
    { name: "Tom Ford Black Orchid", price: 26000 },
    { name: "Tom Ford Oud Wood Intense", price: 27000 },
    { name: "Trussardi Donna", price: 22000 },
    { name: "Valentino Uomo Eau de Toilette", price: 24000 },
    { name: "Versace Eros", price: 23000 },
    { name: "Victoria’s Secret Bombshell", price: 22000 },
    { name: "Victoria’s Secret Very Sexy Orchid", price: 22000 }
];

function normalizeStr(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export async function GET() {
    try {
        await dbConnect();

        const imagesDir = path.join(process.cwd(), 'public', 'images', 'products');

        // 1. Get all directories in images/products
        let productFolders: string[] = [];
        try {
            productFolders = fs.readdirSync(imagesDir).filter(file => {
                return fs.statSync(path.join(imagesDir, file)).isDirectory();
            });
        } catch (e) {
            return NextResponse.json({ error: "Could not read images directory", details: e });
        }

        const results = [];
        let createdCount = 0;
        let updatedCount = 0;

        // 2. Iterate through our source list
        for (const item of PRODUCTS_SOURCE) {
            // Fuzzy Find Folder
            // Logic: Check if folder name contains key parts of the product name
            const normalizedItemName = normalizeStr(item.name);

            // Try 1: Exactish match
            let matchedFolder = productFolders.find(folder => normalizeStr(folder) === normalizedItemName);

            // Try 2: Loose match (contains words)
            if (!matchedFolder) {
                const words = item.name.toLowerCase().split(' ').filter(w => w.length > 2);

                // Find folder that contains the MOST matching words
                let bestMatch = { folder: '', score: 0 };

                productFolders.forEach(folder => {
                    const normalizedFolder = folder.toLowerCase();
                    let score = 0;
                    words.forEach(w => {
                        if (normalizedFolder.includes(w)) score++;
                    });

                    // Specific tweaks for tough ones
                    if (item.name.includes("Sauvage") && folder.includes("Sauvage")) score += 5;
                    if (item.name.includes("A*Men") && folder.includes("A MEN")) score += 5;
                    if (item.name.includes("J’adore") && folder.includes("Jadore")) score += 5;
                    if (item.name.includes("Schokolade") && folder.includes("Cikolata")) score += 5; // Reed Diffuser special case

                    if (score > bestMatch.score) {
                        bestMatch = { folder: folder, score: score };
                    }
                });

                if (bestMatch.score >= 2) { // Threshold
                    matchedFolder = bestMatch.folder;
                }
            }

            // Get Image File
            let mainImage = '/images/placeholder.jpg';
            let galleryImages: string[] = [];

            if (matchedFolder) {
                const folderPath = path.join(imagesDir, matchedFolder);
                const files = fs.readdirSync(folderPath);
                const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

                if (imageFiles.length > 0) {
                    mainImage = `/images/products/${matchedFolder}/${imageFiles[0]}`;
                    // Add all to gallery
                    galleryImages = imageFiles.map(f => `/images/products/${matchedFolder}/${f}`);
                }
            } else {
                console.log(`⚠️ No folder found for: ${item.name}`);
            }

            // Check if product exists
            const existingProduct = await Product.findOne({
                name: { $regex: new RegExp(`^${item.name}$`, 'i') }
            });

            // Prepare Data
            const productData = {
                name: item.name,
                price: item.price,
                description: `Experience the luxury of ${item.name}.`,
                category: item.name.toLowerCase().includes("men") || item.name.toLowerCase().includes("homme") || item.name.toLowerCase().includes("boy") ? "men" : "women", // Simple guess
                gender: item.name.toLowerCase().includes("men") || item.name.toLowerCase().includes("homme") || item.name.toLowerCase().includes("boy") ? "رجالي" : "نسائي",
                concentration: "Eau de Parfum",
                image: mainImage,
                images: galleryImages,
                sizes: [
                    { size: "100ml", price: item.price, originalPrice: 0 }
                ]
            };

            // Adjust specific categories manually
            if (item.name.includes("Reed Diffuser")) {
                productData.category = "home";
                productData.gender = "للبيت";
                productData.sizes = [{ size: "Standard", price: item.price, originalPrice: 0 }];
            }
            if (item.name.includes("Gift Set")) {
                productData.sizes = [{ size: "Set", price: item.price, originalPrice: 0 }];
            }

            if (existingProduct) {
                // Update price and images if missing
                existingProduct.price = item.price;
                if (!existingProduct.image) existingProduct.image = mainImage;
                if (!existingProduct.images || existingProduct.images.length === 0) existingProduct.images = galleryImages;

                // Do NOT overwrite existing sizes if they exist, but maybe update price?
                // Let's safe update: Only update if sizes array is empty or default
                if (!existingProduct.sizes || existingProduct.sizes.length === 0) {
                    existingProduct.sizes = productData.sizes;
                }

                await existingProduct.save();
                updatedCount++;
                results.push({ name: item.name, status: 'Updated', image: mainImage });
            } else {
                // Determine ID
                const lastProduct = await Product.findOne().sort({ id: -1 });
                const newId = (lastProduct && lastProduct.id) ? lastProduct.id + 1 : 1;

                await Product.create({
                    ...productData,
                    id: newId
                });
                createdCount++;
                results.push({ name: item.name, status: 'Created', image: mainImage });
            }
        }

        return NextResponse.json({
            success: true,
            created: createdCount,
            updated: updatedCount,
            details: results
        });

    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: 'Seed failed', details: error }, { status: 500 });
    }
}
