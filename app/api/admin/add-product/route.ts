
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { ...data } = body;

        // Prepare the object
        const productData: any = {
            id: Date.now(), // Generate ID
            name: data.name,
            description: data.description,
            image: data.image,
            images: data.images,
            category: data.category,
            gender: data.gender,
            concentration: data.concentration,
            size: data.size,
            isFeatured: data.isFeatured,
            isOffer: data.isOffer || false,
        };

        if (data.isOffer) {
            productData.price = Number(data.salePrice);
            productData.originalPrice = Number(data.price);
        } else {
            productData.price = Number(data.price);
            // No originalPrice
        }

        const newProduct = new Product(productData);
        await newProduct.save();

        return NextResponse.json({ success: true, message: 'تم إضافة المنتج بنجاح', product: newProduct });
    } catch (error) {
        console.error('Add product error:', error);
        return NextResponse.json({ error: 'فشل إضافة المنتج' }, { status: 500 });
    }
}
