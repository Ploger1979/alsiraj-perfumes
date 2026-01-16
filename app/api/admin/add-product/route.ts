
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// دالة لمعالجة الطلب (POST)
// Handler for POST requests
export async function POST(request: Request) {
    try {
        // قراءة البيانات المرسلة من النموذج
        // Read data sent from the form
        const body = await request.json();

        // تحديد مسار ملف المنتجات
        // Define path to products.ts
        const filePath = path.join(process.cwd(), 'data', 'products.ts');

        // قراءة محتوى الملف الحالي
        // Read current file content
        let fileContent = fs.readFileSync(filePath, 'utf8');

        // إنشاء معرف جديد (ID)
        // Generate a new unique ID based on timestamp to avoid collisions
        const newId = Date.now(); // Simple ID generation

        // Prepare the new product object as a string
        const newProductString = `,
    {
        id: ${newId},
        name: "${body.name}",
        description: "${body.description}",
        price: ${body.isOffer ? body.salePrice : body.price},
        ${body.isOffer ? `originalPrice: ${body.price},` : ''}
        image: "${body.image}",
        images: ["${body.image}"],
        category: "${body.category}",
        gender: "${body.gender}",
        concentration: "${body.concentration}",
        size: "${body.size}",
        isFeatured: ${body.isFeatured},
        isOffer: ${body.isOffer}
    },`;

        // البحث عن مكان إغلاق المصفوفة لإدراج المنتج قبلها
        // Find the closing bracket of the products array to insert before it
        // We look for the last '];'
        const insertPosition = fileContent.lastIndexOf('];');

        if (insertPosition === -1) {
            return NextResponse.json({ error: 'Could not find closing bracket in products.ts' }, { status: 500 });
        }

        // دمج المحتوى القديم مع المنتج الجديد
        // Merge old content with the new product
        const updatedContent =
            fileContent.substring(0, insertPosition) +
            newProductString +
            fileContent.substring(insertPosition);

        // حفظ الملف
        // Save the file
        fs.writeFileSync(filePath, updatedContent, 'utf8');

        return NextResponse.json({ success: true, message: 'Product added successfully' });

    } catch (error) {
        console.error('Error adding product:', error);
        return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
    }
}
