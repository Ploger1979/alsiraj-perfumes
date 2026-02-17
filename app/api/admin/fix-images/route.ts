import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product'; // Assuming Product model is in @/models/Product

export async function GET() {
    try {
        await dbConnect();

        // 1. Find all products that match "Sauvage" (case-insensitive)
        const products = await Product.find({ name: { $regex: 'Sauvage', $options: 'i' } });

        if (products.length === 0) {
            return NextResponse.json({ message: 'No product found with name Sauvage' });
        }

        const logs: string[] = [];

        for (const p of products) {
            const oldImages = p.images || [];

            // 2. Simply reset the `images` array to contain ONLY the main `image`
            // This effectively removes any "deleted" or "old" images that were stuck in the array
            if (p.image) {
                p.images = [p.image];
                await p.save();
                logs.push(`Cleaned up ${p.name}: Kept only ${p.image}. Removed ${oldImages.length > 1 ? oldImages.length - 1 : 0} other images.`);
            } else {
                logs.push(`Skipped ${p.name}: No main image set.`);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Images cleaned up for Sauvage products.',
            logs
        });

    } catch (error) {
        console.error('Check failed:', error);
        return NextResponse.json({ error: 'Fix failed', details: String(error) }, { status: 500 });
    }
}
