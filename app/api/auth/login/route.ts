
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!fs.existsSync(usersFilePath)) {
            return NextResponse.json({ error: 'لم يتم العثور على أي مستخدمين، يرجى التسجيل أولاً' }, { status: 404 });
        }

        const fileContent = fs.readFileSync(usersFilePath, 'utf8');
        const users = JSON.parse(fileContent);

        // تشفير كلمة المرور المدخلة للمقارنة
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // البحث عن المستخدم
        const user = users.find((u: any) => u.username === username && u.password === hashedPassword);

        if (user) {
            return NextResponse.json({ success: true, message: 'تم تسجيل الدخول بنجاح' });
        } else {
            return NextResponse.json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' }, { status: 401 });
        }

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
    }
}
