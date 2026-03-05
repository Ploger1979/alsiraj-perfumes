
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { products as staticProducts } from '@/data/products';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';

        // جلب كل المنتجات من الداتابيز
        let allProducts = await Product.find({}).lean();

        // فولباك للملف الثابت لو الداتابيز فارغة
        if (!allProducts || allProducts.length === 0) {
            allProducts = staticProducts as any;
        }

        const safeProducts = JSON.parse(JSON.stringify(allProducts));

        // لو فيه query نفلتر، لو لأ نرجع كل المنتجات
        if (query.trim()) {
            const lowerQuery = query.toLowerCase();
            const filtered = safeProducts.filter((p: any) =>
                (p.name && p.name.toLowerCase().includes(lowerQuery)) ||
                (p.nameAr && p.nameAr.toLowerCase().includes(lowerQuery)) ||
                (p.description && p.description.toLowerCase().includes(lowerQuery)) ||
                (p.category && p.category.toLowerCase().includes(lowerQuery)) ||
                (p.concentration && p.concentration.toLowerCase().includes(lowerQuery))
            );
            return NextResponse.json({ products: filtered });
        }

        return NextResponse.json({ products: safeProducts });

    } catch (error) {
        console.error('Products API error:', error);
        return NextResponse.json({ error: 'فشل جلب المنتجات', products: [] }, { status: 500 });
    }
}
