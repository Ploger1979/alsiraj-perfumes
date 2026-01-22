
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

// Force dynamic is NOT needed if we don't cache, but good to be safe for admin APIs
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();

        // Fetch specific fields or all.
        // We fetching everything just like the file version.
        const products = await Product.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
