import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 });
        }

        // Specific Admin Recovery Logic
        let targetUser = null;

        // 1. Check by email directly
        targetUser = await User.findOne({ email });

        // 2. Fallback: Check if it's the main admin email trying to recover 'admin1979'
        if (!targetUser && email === 'aymanploger@gmail.com') {
            targetUser = await User.findOne({ username: 'admin1979' });
        }

        if (!targetUser) {
            return NextResponse.json({ error: `البريد الإلكتروني غير مسجل (DB Check). إيميل: ${email}` }, { status: 404 });
        }

        // Generate a reset token
        const resetToken = Math.random().toString(36).substring(2, 15);

        // Construct the reset link
        const host = request.headers.get('host');
        const protocol = host?.includes('localhost') ? 'http' : 'https';
        const resetLink = `${protocol}://${host}/admin/reset-password?token=${resetToken}&email=${email}`;

        // Attempt to send email
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'استعادة كلمة المرور - السراج للعطور',
                html: `
                    <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
                        <h2 style="color: #d4af37;">طلب استعادة كلمة المرور</h2>
                        <p>مرحباً،</p>
                        <p>لقد تلقينا طلباً لاستعادة كلمة المرور الخاصة بحسابك في السراج للعطور.</p>
                        <p>اضغط على الرابط أدناه لتعيين كلمة مرور جديدة:</p>
                        <a href="${resetLink}" style="display: inline-block; background-color: #d4af37; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">تغيير كلمة المرور</a>
                        <p>أو انسخ الرابط التالي:</p>
                        <p>${resetLink}</p>
                        <p style="color: #666; font-size: 12px; margin-top: 30px;">إذا لم تطلب هذا التغيير، يرجى تجاهل هذه الرسالة.</p>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);

            return NextResponse.json({
                success: true,
                message: 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح.'
            });
        } else {
            console.log('----------------------------------------------------');
            console.log(`[SIMULATION] Email Env vars missing. sending to: ${email}`);
            console.log(`Link: ${resetLink}`);
            console.log('----------------------------------------------------');

            // IMPORTANT: For debugging/setup phase, we return the link in the message so it's visible in the UI alert if email fails.
            // This is a temporary convenience for the user to get back in.
            return NextResponse.json({
                success: true,
                message: 'لم يتم إعداد خدمة البريد الإلكتروني بعد. (راجع Console أو انسخ هذا الرابط مؤقتاً للتجربة)',
                debugLink: resetLink
            });
        }

    } catch (error) {
        console.error('Reset Request Error:', error);
        return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
    }
}
