
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

        // Prepare the update object based on offer logic
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
            // Always update these if present
            notes: data.notes
        };

        if (data.isOffer) {
            // If it IS an offer:
            // The main price becomes the sale price
            // The originalPrice becomes the input price (from the form's "price" field)
            updateData.price = Number(data.salePrice);
            updateData.originalPrice = Number(data.price);
        } else {
            // If it IS NOT an offer:
            // The main price is the input price
            // We explicitly unset originalPrice to remove it
            updateData.price = Number(data.price);
            updateData.$unset = { originalPrice: 1 }; // Remove originalPrice field
        }

        const product = await Product.findOneAndUpdate(
            { id: id },
            updateData,
            { new: true } // Return the updated document
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
