import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'يرجى ملء جميع الحقول' }, { status: 400 });
        }

        // إعداد Nodemailer
        // ملاحظة: يجب إعداد المتغيرات البيئية في .env.local لتعمل هذه الخدمة
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
            port: parseInt(process.env.EMAIL_PORT || '465'),
            secure: process.env.EMAIL_PORT === '465', // true for 465
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // 1. إرسال الإشعار لبريد الموقع
        const mailOptionsToAdmin = {
            from: `"نموذج تواصل - السراج" <${process.env.EMAIL_USER}>`,
            to: 'info@alsiraj-perfumes.com',
            replyTo: email,
            subject: `رسالة جديدة من: ${name}`,
            text: `الاسم: ${name}\nالبريد: ${email}\nالرسالة: ${message}`,
            html: `
                <div style="direction: rtl; font-family: sans-serif; border: 1px solid #c9a84c; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #c9a84c;">وصلتك رسالة جديدة من الموقع</h2>
                    <p><strong>الاسم:</strong> ${name}</p>
                    <p><strong>البريد:</strong> ${email}</p>
                    <p><strong>الرسالة:</strong></p>
                    <p style="background: #fdfaf0; padding: 15px; border-radius: 5px; border: 1px dashed #c9a84c;">${message}</p>
                </div>
            `,
        };

        // 2. إرسال نسخة تأكيدية للعميل (Auto-reply)
        const mailOptionsToUser = {
            from: `"شركة السراج للعطور" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'شكراً لتواصلك مع السراج للعطور',
            html: `
                <div style="direction: rtl; font-family: sans-serif; text-align: center; padding: 20px;">
                    <img src="https://alsiraj-perfumes.com/logo-ohne-bg.png" alt="Al Siraj Logo" style="width: 100px; margin-bottom: 20px;" />
                    <h2 style="color: #c9a84c;">أهلاً بك يا ${name}</h2>
                    <p>لقد استلمنا رسالتك بنجاح وسنقوم بالرد عليك في أقرب وقت ممكن.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 0.9rem; color: #888;">نسخة من رسالتك:</p>
                    <p style="font-style: italic; color: #555;">"${message}"</p>
                </div>
            `,
        };

        // إرسال الإيميلات
        await transporter.sendMail(mailOptionsToAdmin);

        // إرسال الرد التلقائي (اختياري، يمكن تعطيله إذا كان السيرفر محدوداً)
        try {
            await transporter.sendMail(mailOptionsToUser);
        } catch (err) {
            console.error('Failed to send auto-reply:', err);
        }

        return NextResponse.json({ success: true, message: 'تم إرسال رسالتك بنجاح' });
    } catch (error) {
        console.error('Contact API error:', error);
        return NextResponse.json({ error: 'فشل إرسال الرسالة، يرجى المحاولة لاحقاً' }, { status: 500 });
    }
}
