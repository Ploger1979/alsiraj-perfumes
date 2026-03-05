import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'البيانات غير مكتملة' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }, { status: 400 });
        }

        // ابحث عن المستخدم بالإيميل أو بالـ username
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.findOne({ username: email });
        }
        // استرداد خاص لـ admin1979
        if (!user && email === 'aymanploger@gmail.com') {
            user = await User.findOne({ username: 'admin1979' });
        }

        if (!user) {
            return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
        }

        // تشفير الباسوورد الجديد وحفظه
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        return NextResponse.json({ success: true, message: 'تم تحديث كلمة المرور بنجاح' });

    } catch (error: any) {
        console.error('Reset Password Error:', error);
        return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
    }
}
