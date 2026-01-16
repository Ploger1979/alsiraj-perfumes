
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 });
        }

        if (!fs.existsSync(usersFilePath)) {
            return NextResponse.json({ error: 'لا يوجد مستخدمين مسجلين' }, { status: 404 });
        }

        const fileContent = fs.readFileSync(usersFilePath, 'utf8');
        const users = JSON.parse(fileContent);

        const user = users.find((u: any) => u.email === email);

        if (!user) {
            // For security, we might want to return success even if email not found, 
            // but for this internal tool, explicit error is better for UX.
            return NextResponse.json({ error: 'البريد الإلكتروني غير مسجل' }, { status: 404 });
        }

        // Generate a reset token (simulation)
        // In a real app, save this token to the user record with an expiration date
        const resetToken = Math.random().toString(36).substring(2, 15);

        // Simulate sending email
        console.log('----------------------------------------------------');
        console.log(`[SIMULATION] Sending Password Reset Email to: ${email}`);
        console.log(`Link: http://${request.headers.get('host')}/admin/reset-password?token=${resetToken}&email=${email}`);
        console.log('----------------------------------------------------');

        // Note to User: Since we don't have an SMTP server (like SendGrid or Gmail SMTP) configured,
        // we are logging the link to the server console. 
        // In production, use 'nodemailer' here.

        return NextResponse.json({
            success: true,
            message: 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني (تحقق من Console للمحاكاة)'
        });

    } catch (error) {
        console.error('Reset Request Error:', error);
        return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
    }
}
