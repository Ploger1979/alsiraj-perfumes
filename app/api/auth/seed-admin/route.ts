
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        await dbConnect();

        // Check if admin already exists
        const userExists = await User.findOne({ username: 'aymanploger@gmail.com' });
        if (userExists) {
            return NextResponse.json({ message: 'Admin user already exists' });
        }

        // Create admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt); // Default password, change immediately!

        const newUser = new User({
            username: 'aymanploger@gmail.com',
            password: hashedPassword,
            role: 'admin'
        });

        await newUser.save();

        return NextResponse.json({ success: true, message: 'Admin user created successfully' });

    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 });
    }
}
