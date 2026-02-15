
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
    try {
        await dbConnect();

        // 1. Get all products sorted by their creation date (oldest first)
        // If no createdAt, sort by _id
        const products = await Product.find({}).sort({ createdAt: 1, _id: 1 });

        let counter = 1;
        let logs = [];

        for (const product of products) {
            // Update the 'id' field to be a simple sequential number
            // We convert to string because your schema likely uses String for ID based on previous files
            const newId = counter.toString();

            if (product.id !== newId) {
                product.id = newId;
                await product.save();
                logs.push(`Renumbered: ${product.name} -> ID ${newId}`);
            }
            counter++;
        }

        return NextResponse.json({
            success: true,
            message: `Reordered ${counter - 1} products successfully.`,
            logs: logs
        });

    } catch (error) {
        return NextResponse.json({ error: 'Reorder failed', details: error }, { status: 500 });
    }
}
