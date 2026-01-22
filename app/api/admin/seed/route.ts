
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { products as initialProducts } from '@/data/products';

export async function GET() {
    try {
        await dbConnect();

        const count = await Product.countDocuments();
        if (count > 0) {
            return NextResponse.json({ message: 'Database already seeded', count });
        }

        // Insert seed data
        await Product.insertMany(initialProducts);

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully',
            productsAdded: initialProducts.length
        });

    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: 'Failed to seed database: ' + (error as Error).message }, { status: 500 });
    }
}
