
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { username, password, email } = await request.json();

        // Validation
        if (!username || !password) {
            return NextResponse.json({ error: 'اسم المستخدم وكلمة المرور مطلوبان' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json({ error: 'اسم المستخدم هذا مستخدم بالفعل' }, { status: 400 });
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new Admin User
        // Note: By default we are making them admin as requested.
        const newUser = new User({
            username: username || email, // Allow using email as username
            password: hashedPassword,
            role: 'admin',
            createdAt: new Date()
        });

        await newUser.save();

        return NextResponse.json({ success: true, message: 'تم إنشاء الحساب بنجاح' });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الحساب' }, { status: 500 });
    }
}
