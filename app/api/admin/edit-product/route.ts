
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

        // 1. Fetch the existing product to get current state
        const product = await Product.findOne({ id: id });

        if (!product) {
            return NextResponse.json({ error: 'لم يتم العثور على المنتج لتعديله' }, { status: 404 });
        }

        const oldPrice = product.price;

        // 2. Prepare new values
        const isOffer = data.isOffer || false;
        let newPrice = Number(data.price);
        let newOriginalPrice = 0;

        if (isOffer) {
            newPrice = Number(data.salePrice);
            newOriginalPrice = Number(data.price);
        } else {
            newPrice = Number(data.price);
            newOriginalPrice = 0;
        }

        // 3. Update standard fields
        // 3. Update standard fields
        product.name = data.name;
        product.description = data.description;

        // =========================================================================================
        // 🖼️ SMART IMAGE HANDLING (نظام الصور الذكي)
        // =========================================================================================
        // 1. نتأكد أن مصفوفة الصور موجودة
        if (!product.images) product.images = [];

        // 2. نحفظ الصورة الرئيسية الحالية في الألبوم قبل أي تعديل
        if (product.image && !product.images.includes(product.image)) {
            product.images.push(product.image);
        }

        // 3. إذا قام الأدمن برفع صورة جديدة
        if (data.image) {
            // إذا كان المنتج بدون صورة، نضعها كصورة رئيسية
            if (!product.image) {
                product.image = data.image;
            }
            // نضيف الصورة الجديدة للألبوم دائماً
            if (!product.images.includes(data.image)) {
                product.images.push(data.image);
            }
        }

        // 4. دمج مصفوفة الصور إذا تم إرسالها بالكامل
        if (data.images && Array.isArray(data.images)) {
            data.images.forEach((img: string) => {
                if (!product.images.includes(img)) {
                    product.images.push(img);
                }
            });
        }
        // =========================================================================================

        product.category = data.category;
        product.gender = data.gender;
        product.concentration = data.concentration;
        product.size = data.size; // Display size string
        product.isFeatured = data.isFeatured;
        product.isOffer = isOffer;
        product.notes = data.notes;

        // 4. Update Root Prices
        product.price = newPrice;
        product.originalPrice = newOriginalPrice;

        // =========================================================================================
        // 💰 MANUAL PRICING (التسعير اليدوي)
        // =========================================================================================
        // هنا نقوم بحفظ قائمة الأحجام كما هي بالضبط من المدخلات.
        // لا توجد أي معادلات رياضية أو تغيير تلقائي للأسعار.
        if (data.sizes && Array.isArray(data.sizes)) {
            product.sizes = data.sizes.map((s: any) => ({
                size: s.size,
                price: Number(s.price),
                originalPrice: Number(s.originalPrice || 0)
            }));
        }

        // 6. Save changes
        await product.save();

        return NextResponse.json({ success: true, message: 'تم تحديث بيانات المنتج والأسعار بذكاء', product });
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'فشل تحديث المنتج' }, { status: 500 });
    }
}
