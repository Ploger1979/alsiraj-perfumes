
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { ...data } = body;

        // 1. Smart Check: Does a product with this name already exist?
        // We use a case-insensitive regex match to be user-friendly
        const existingProduct = await Product.findOne({
            name: { $regex: new RegExp(`^${data.name.trim()}$`, 'i') }
        });

        if (existingProduct) {
            // =========================================================================================
            // 🔄 SMART MERGE LOGIC (نظام الدمج الذكي)
            // =========================================================================================
            // الهدف: إذا وجدنا منتجاً بنفس الاسم، لا نقوم بإنشاء منتج جديد مكرر.
            // بدلاً من ذلك، نقوم بدمج البيانات الجديدة (الأحجام والصور) مع المنتج الموجود.

            // 1️⃣ معالجة الأحجام (Sizes Logic)
            // -----------------------------------------------------------------------------------------
            // نحصل على الأحجام الجديدة من الطلب.
            // نقارن كل حجم جديد بالأحجام الموجودة:
            // - إذا كان الحجم موجوداً (مثلاً 100ml)، نقوم بتحديث سعره.
            // - إذا كان الحجم جديداً (مثلاً 50ml)، نقوم بإضافته للقائمة.
            const newSizes = (data.sizes && Array.isArray(data.sizes)) ? data.sizes : [];
            const normalize = (str: string) => str ? str.toLowerCase().replace(/\s/g, '') : '';
            let updatedSizes = [...(existingProduct.sizes || [])];

            newSizes.forEach((newS: any) => {
                const existingIndex = updatedSizes.findIndex(
                    (exS: any) => normalize(exS.size) === normalize(newS.size)
                );

                const sizeEntry = {
                    size: newS.size,
                    price: Number(newS.price),
                    originalPrice: Number(newS.originalPrice || 0)
                };

                if (existingIndex > -1) {
                    updatedSizes[existingIndex] = sizeEntry; // تحديث السعر للحجم الموجود
                } else {
                    updatedSizes.push(sizeEntry); // إضافة حجم جديد
                }
            });

            existingProduct.sizes = updatedSizes;

            // 2️⃣ معالجة الصور (Image Gallery Logic)
            // -----------------------------------------------------------------------------------------
            // الهدف: عدم حذف الصور القديمة، بل إضافة الصور الجديدة كألبوم.

            // أ) التأكد أن مصفوفة الصور موجودة
            if (!existingProduct.images) existingProduct.images = [];

            // ب) التأكد أن الصورة الرئيسية الحالية محفوظة في الألبوم
            if (existingProduct.image && !existingProduct.images.includes(existingProduct.image)) {
                existingProduct.images.push(existingProduct.image);
            }

            // ج) إذا تم رفع صورة جديدة، تصبح هي الصورة الرئيسية
            if (data.image && data.image !== existingProduct.image) {
                // حفظ الصورة القديمة في الألبوم إذا لم تكن موجودة
                if (existingProduct.image && !existingProduct.images.includes(existingProduct.image)) {
                    existingProduct.images.push(existingProduct.image);
                }

                // تعيين الجديدة كصورة رئيسية
                existingProduct.image = data.image;

                // إضافتها للألبوم أيضاً
                if (!existingProduct.images.includes(data.image)) {
                    existingProduct.images.push(data.image);
                }
            }

            // د) دمج أي صور إضافية مرسلة كمصفوفة `images`
            if (data.images && Array.isArray(data.images)) {
                data.images.forEach((img: string) => {
                    if (!existingProduct.images.includes(img)) {
                        existingProduct.images.push(img);
                    }
                });
            }

            // 3️⃣ تحديث بقية البيانات (Info Update)
            // -----------------------------------------------------------------------------------------
            // نقوم بتحديث الوصف، الفئة، والتركيز ليطابق أحدث إدخال.
            existingProduct.description = data.description || existingProduct.description;
            existingProduct.nameAr = data.nameAr || existingProduct.nameAr;
            existingProduct.category = data.category || existingProduct.category;
            existingProduct.gender = data.gender || existingProduct.gender;
            existingProduct.concentration = data.concentration || existingProduct.concentration;

            // 4️⃣ تحديث السعر الرئيسي (Root Price)
            // -----------------------------------------------------------------------------------------
            // نجعل السعر الرئيسي للمنتج هو سعر "أول حجم" في القائمة المحدثة، لضمان التناسق.
            if (updatedSizes.length > 0) {
                existingProduct.price = updatedSizes[0].price;
                existingProduct.size = updatedSizes[0].size;
            }

            await existingProduct.save();

            return NextResponse.json({
                success: true,
                message: `تم دمج الحجم الجديد مع المنتج الموجود مسبقاً (${existingProduct.name}) بنجاح! ♻️`,
                product: existingProduct
            });
        }

        // --- NEW PRODUCT LOGIC (Fallback) ---

        // =========================================================================================
        // 🔢 SEQUENTIAL ID GENERATION (توليد رقم تسلسلي)
        // =========================================================================================
        // بدلاً من استخدام التاريخ العشوائي، نبحث عن آخر رقم ID ونضيف عليه 1.
        const lastProduct = await Product.findOne().sort({ id: -1 });
        const newId = (lastProduct && lastProduct.id) ? lastProduct.id + 1 : 1;

        // Prepare the object
        const productData: any = {
            id: newId,
            name: data.name,
            nameAr: data.nameAr || '',
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
            productData.price = Number(data.price);           // سعر البيع الحالي
            productData.originalPrice = Number(data.originalPrice); // السعر قبل الخصم (الأعلى)
        } else {
            productData.price = Number(data.price);
            // No originalPrice
        }

        // Handle manual sizes if provided
        if (data.sizes && Array.isArray(data.sizes)) {
            productData.sizes = data.sizes.map((s: any) => ({
                size: s.size,
                price: Number(s.price),
                originalPrice: Number(s.originalPrice || 0)
            }));
        }

        const newProduct = new Product(productData);
        await newProduct.save();

        return NextResponse.json({ success: true, message: 'تم إضافة المنتج بنجاح', product: newProduct });
    } catch (error) {
        console.error('Add product error:', error);
        return NextResponse.json({ error: 'فشل إضافة المنتج' }, { status: 500 });
    }
}
