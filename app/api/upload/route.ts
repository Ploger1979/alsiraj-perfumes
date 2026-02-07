import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// إعداد Cloudinary إذا توفرت المفاتيح
// Configure Cloudinary if keys are present
const cloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

if (cloudinaryConfigured) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'لم يتم اختيار أي ملف' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // الخيار الأول: الرفع على Cloudinary (للإنتاج)
        // Option 1: Upload to Cloudinary (Production)
        if (cloudinaryConfigured) {
            try {
                const uploadResult = await new Promise<any>((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: 'alsiraj-products' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    ).end(buffer);
                });

                return NextResponse.json({ success: true, path: uploadResult.secure_url });
            } catch (cloudError) {
                console.error('Cloudinary upload failed:', cloudError);
                return NextResponse.json({ error: 'فشل الرفع السحابي' }, { status: 500 });
            }
        }

        // الخيار الثاني: الرفع المحلي (Localhost فقط)
        // Option 2: Local Upload (Localhost only)
        // تنظيف اسم الملف وإضافة توقيت
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${Date.now()}-${safeName}`;
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);

        // تحذير في الإنتاج
        if (process.env.NODE_ENV === 'production') {
            console.warn("WARNING: Uploading to local filesystem in production. Images will be lost on redeploy.");
        }

        return NextResponse.json({
            success: true,
            path: `/images/uploads/${fileName}`,
            warning: process.env.NODE_ENV === 'production' ? 'تم الرفع محلياً (غير آمن للإنتاج)' : undefined
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'فشل رفع الصورة' }, { status: 500 });
    }
}
