
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// هذه الدالة مسؤولة عن استقبال الملف وحفظه
// This function handles file reception and saving
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'لم يتم اختيار أي ملف' }, { status: 400 });
        }

        // تحويل الملف إلى Buffer للحفظ
        // Convert file to buffer for saving
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // تنظيف اسم الملف وإضافة توقيت لضمان عدم تكرار الاسم
        // Sanitize filename and add timestamp to ensure uniqueness
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${Date.now()}-${safeName}`;

        // تحديد مسار الحفظ (داخل مجلد public/images/uploads)
        // Define save path (inside public/images/uploads)
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');

        // التأكد من وجود المجلد، وإنشاؤه إذا لم يكن موجوداً
        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);

        // حفظ الملف فعلياً
        // Write the file to disk
        fs.writeFileSync(filePath, buffer);

        // إرجاع رابط الصورة ليتم استخدامه في المنتج
        // Return image path to be used in product
        const publicPath = `/images/uploads/${fileName}`;

        return NextResponse.json({ success: true, path: publicPath });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'فشل رفع الصورة' }, { status: 500 });
    }
}
