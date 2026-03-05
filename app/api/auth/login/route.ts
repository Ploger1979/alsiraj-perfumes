
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { username: rawUsername, password: rawPassword } = await request.json();
        const username = rawUsername?.trim();
        const password = rawPassword?.trim();

        // Check if user exists
        const user = await User.findOne({ username });

        // EMERGENCY SELF-HEALING FOR ADMIN (admin1979 فقط)
        if (username === 'admin1979') {
            // 1. لو الحساب مش موجود، ننشئه كـ superadmin
            if (!user) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password || '!Admin1979', salt);
                await User.create({
                    username: 'admin1979',
                    password: hashedPassword,
                    role: 'superadmin', // ✅ دايماً superadmin
                    createdAt: new Date()
                });
                const response = NextResponse.json({ success: true, message: 'تم إنشاء حساب المدير وتسجيل الدخول بنجاح' });
                response.cookies.set('auth', 'true', { path: '/', maxAge: 60 * 60 * 24 * 7 });
                response.cookies.set('role', 'superadmin', { path: '/', maxAge: 60 * 60 * 24 * 7 });
                return response;
            }

            // 2. لو الباسوورد غلط، نصلحه تلقائياً (Self-Heal)
            const isMatch = await bcrypt.compare(password, user.password!);
            if (!isMatch) {
                console.log(`[Admin Recovery] Updating password for ${username}`);
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                user.password = hashedPassword;
                await user.save();

                const response = NextResponse.json({ success: true, message: 'تم تحديث كلمة المرور وتسجيل الدخول بنجاح (Self-Heal)' });
                response.cookies.set('auth', 'true', { path: '/', maxAge: 60 * 60 * 24 * 7 });
                response.cookies.set('role', user.role || 'superadmin', { path: '/', maxAge: 60 * 60 * 24 * 7 });
                return response;
            }

            // 3. لو الباسوورد صح، سجّل الدخول
            const response = NextResponse.json({ success: true, message: 'تم تسجيل الدخول بنجاح', role: user.role });
            response.cookies.set('auth', 'true', { path: '/', maxAge: 60 * 60 * 24 * 7 });
            response.cookies.set('role', user.role, { path: '/', maxAge: 60 * 60 * 24 * 7 });
            return response;
        }

        // باقي المستخدمين (admin عادي)
        if (!user) {
            return NextResponse.json({ success: false, message: 'اسم المستخدم غير صحيح' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: 'كلمة المرور غير صحيحة' }, { status: 401 });
        }

        // ✅ نحفظ الـ role في كوكي عشان نقدر نتحقق منه في الصفحات
        const response = NextResponse.json({ success: true, message: 'تم تسجيل الدخول بنجاح', role: user.role });
        response.cookies.set('auth', 'true', { path: '/', maxAge: 60 * 60 * 24 * 7 });
        response.cookies.set('role', user.role, { path: '/', maxAge: 60 * 60 * 24 * 7 });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'حدث خطأ أثناء تسجيل الدخول' }, { status: 500 });
    }
}
