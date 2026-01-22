
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();

        // Generate a new ID (timestamp based to match current pattern, or could use auto-increment if strictly needed)
        // Using timestamp is safe enough for low volume.
        const newProduct = new Product({
            id: Date.now(),
            ...body
        });

        await newProduct.save();

        return NextResponse.json({ success: true, message: 'تم إضافة المنتج بنجاح', product: newProduct });
    } catch (error) {
        console.error('Add product error:', error);
        return NextResponse.json({ error: 'فشل إضافة المنتج' }, { status: 500 });
    }
}
