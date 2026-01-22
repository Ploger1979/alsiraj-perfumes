
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json({ error: 'معرف المنتج مطلوب' }, { status: 400 });
        }

        const updateData: any = {
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
            notes: data.notes
        };

        if (data.isOffer) {
            updateData.price = Number(data.salePrice);
            updateData.originalPrice = Number(data.price);
        } else {
            updateData.price = Number(data.price);
            // Explicitly set originalPrice to null/undefined to ensure it fails the "exists" check
            updateData.originalPrice = null;
            updateData.$unset = { originalPrice: 1 };
        }

        // Use findOneAndUpdate with overwrite/set options carefully
        const product = await Product.findOneAndUpdate(
            { id: id },
            updateData,
            { new: true }
        );

        if (!product) {
            return NextResponse.json({ error: 'لم يتم العثور على المنتج لتعديله' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'تم تحديث بيانات المنتج بنجاح', product });
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'فشل تحديث المنتج' }, { status: 500 });
    }
}
