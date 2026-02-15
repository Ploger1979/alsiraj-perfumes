
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

// =========================================================================================
// 🎯 TARGETED CLEANUP & FIX (تنظيف محدد وإصلاح الصور)
// =========================================================================================

// 1. DELETE THESE PRODUCTS Completely (Clean duplicates)
const PRODUCTS_TO_DELETE = [
    "Paco Rabanne Invictus Legend", // Cross out in red
    "Paco Rabanne Pure XS for Him", // Duplicate of Pure XS
];

// 2. DEDUPLICATE THESE (Keep 1, Delete duplicates)
const PRODUCTS_TO_DEDUPLICATE = [
    "Creed Aventus Travel Gift Set",
    "Mugler A*Men Pure Havane",
    "Hugo Boss Hugo Man (Hugo EDT)",
];

// 3. FORCE FIX BROKEN IMAGES (Override current image)
const FORCE_FIX_IMAGES: Record<string, string> = {
    // Baccarat Rouge 540 (Red Bottle - Extrait style or EDP)
    // Using a very reliable clean image from Fragrantica or similar
    "Maison Francis Kurkdjian Baccarat Rouge 540": "https://fimgs.net/mdimg/perfume/375x500.31291.jpg",

    // Si Passione (Red Bottle)
    "Giorgio Armani Si Passione": "https://fimgs.net/mdimg/perfume/375x500.48002.jpg",

    // Boss Bottled (Grey/White Bottle)
    "Hugo Boss Boss Bottled": "https://fimgs.net/mdimg/perfume/375x500.383.jpg", // Correct ID for Boss Bottled

    // Terre d'Hermes
    "Hermès Terre d’Hermès": "https://fimgs.net/mdimg/perfume/375x500.17.jpg",
};

export async function GET() {
    try {
        await dbConnect();

        const logs: string[] = [];
        let deletedCount = 0;
        let fixedCount = 0;

        // A. DELETE UNWANTED
        for (const name of PRODUCTS_TO_DELETE) {
            const result = await Product.deleteMany({ name: name });
            if (result.deletedCount > 0) {
                logs.push(`🗑️ Deleted completely: ${name} (${result.deletedCount} items)`);
                deletedCount += result.deletedCount;
            }
        }

        // B. DEDUPLICATE (Keep 1)
        for (const name of PRODUCTS_TO_DEDUPLICATE) {
            const duplicates = await Product.find({ name: name }).sort({ _id: 1 }); // Oldest first
            if (duplicates.length > 1) {
                // Keep the one with an image if possible, otherwise keep the first one
                let keeper = duplicates[0];
                const keeperHasImage = keeper.image && !keeper.image.includes('placeholder');

                // Try to find a better keeper
                if (!keeperHasImage) {
                    const better = duplicates.find(d => d.image && !d.image.includes('placeholder'));
                    if (better) keeper = better;
                }

                // Delete others
                for (const p of duplicates) {
                    if (p._id.toString() !== keeper._id.toString()) {
                        await Product.findByIdAndDelete(p._id);
                        logs.push(`🧹 Removed duplicate: ${name}`);
                        deletedCount++;
                    }
                }
            }
        }

        // C. FORCE FIX IMAGES
        // We find products matching our Force Fix list
        for (const [name, imageUrl] of Object.entries(FORCE_FIX_IMAGES)) {
            const productsToFix = await Product.find({ name: new RegExp(name, 'i') }); // Case insensitive search

            for (const p of productsToFix) {
                // Force update image
                p.image = imageUrl;
                p.images = [imageUrl]; // Set gallery to this single good image
                await p.save();
                logs.push(`✅ Fixed image for: ${p.name}`);
                fixedCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Cleanup Complete. Deleted ${deletedCount}, Fixed Images: ${fixedCount}`,
            logs: logs
        });

    } catch (error) {
        console.error("Cleanup Error:", error);
        return NextResponse.json({ error: 'Cleanup Failed', details: error }, { status: 500 });
    }
}
