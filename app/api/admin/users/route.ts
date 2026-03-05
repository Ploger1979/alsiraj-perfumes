
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        await dbConnect();
        // Return all users but hide passwords
        const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, users });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password: hashedPassword,
            role: 'admin' // المستخدمون الجدد يكونوا admin فقط
        });

        await newUser.save();

        return NextResponse.json({ success: true, message: 'User created successfully', user: { username, role: 'admin' } });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // 🔒 حماية حساب superadmin من الحذف
        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        if (userToDelete.role === 'superadmin') {
            return NextResponse.json({ error: 'لا يمكن حذف حساب المدير العام' }, { status: 403 });
        }

        await User.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'User deleted successfully' });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
