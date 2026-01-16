
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

// دالة مساعدة للحصول على المستخدمين
function getUsers() {
    if (!fs.existsSync(usersFilePath)) {
        return [];
    }
    const fileContent = fs.readFileSync(usersFilePath, 'utf8');
    try {
        return JSON.parse(fileContent);
    } catch {
        return [];
    }
}

export async function POST(request: Request) {
    try {
        const { username, password, email } = await request.json();

        if (!username || !password || !email) {
            return NextResponse.json({ error: 'البيانات غير مكتملة' }, { status: 400 });
        }

        const users = getUsers();

        // التحقق مما إذا كان المستخدم موجوداً بالفعل
        if (users.find((u: any) => u.username === username)) {
            return NextResponse.json({ error: 'اسم المستخدم مسجل مسبقاً' }, { status: 400 });
        }

        if (users.find((u: any) => u.email === email)) {
            return NextResponse.json({ error: 'البريد الإلكتروني مسجل مسبقاً' }, { status: 400 });
        }

        // تشفير كلمة المرور (Hashing) للأمان
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        const newUser = {
            id: Date.now(),
            username,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        // إضافة المستخدم وحفظ الملف
        users.push(newUser);

        // التأكد من وجود المجلد data
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }

        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');

        return NextResponse.json({ success: true, message: 'تم إنشاء الحساب بنجاح' });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
    }
}
