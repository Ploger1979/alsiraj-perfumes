
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updatedData } = body;

        if (!id) {
            return NextResponse.json({ error: 'معرف المنتج مطلوب' }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'data', 'products.ts');
        let fileContent = fs.readFileSync(filePath, 'utf8');

        // البحث عن المنتج لاستبداله
        // سنستخدم نفس استراتيجية الحذف: العثور على الكتلة واستبدالها بالكتلة الجديدة

        // 1. تحديد مكان المنتج القديم
        const objectRegex = new RegExp(`\\{\\s*["']?id["']?\\s*:\\s*${id}\\s*,[\\s\\S]*?\\}(?:\\s*,)?`, 'g');

        if (!objectRegex.test(fileContent)) {
            return NextResponse.json({ error: 'لم يتم العثور على المنتج لتعديله' }, { status: 404 });
        }

        // 2. تجهيز كائن المنتج الجديد
        // ملاحظة: نحافظ على الـ ID القديم
        const newProductString = `
    {
        id: ${id},
        name: "${updatedData.name}",
        description: "${updatedData.description}",
        price: ${updatedData.isOffer ? updatedData.salePrice : updatedData.price},
        ${updatedData.isOffer ? `originalPrice: ${updatedData.price},` : ''}
        image: "${updatedData.image}",
        images: ${updatedData.images && updatedData.images.length > 0 ? JSON.stringify(updatedData.images) : `["${updatedData.image}"]`},
        category: "${updatedData.category}",
        gender: "${updatedData.gender}",
        concentration: "${updatedData.concentration}",
        size: "${updatedData.size}",
        isFeatured: ${updatedData.isFeatured},
        isOffer: ${updatedData.isOffer || false}
    },`;

        // 3. استبدال القديم بالجديد
        const updatedContent = fileContent.replace(objectRegex, newProductString);

        fs.writeFileSync(filePath, updatedContent, 'utf8');

        return NextResponse.json({ success: true, message: 'تم تحديث بيانات المنتج بنجاح' });

    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'فشل تحديث المنتج' }, { status: 500 });
    }
}
