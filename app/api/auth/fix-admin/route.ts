
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        await dbConnect();

        const username = 'admin1979';
        const newPassword = '!Admin1979';

        // 1. Delete existing user to ensure a clean slate
        await User.findOneAndDelete({ username });

        // 2. Create fresh user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const newUser = new User({
            username,
            email: 'aymanploger@gmail.com', // Optional if schema requires
            password: hashedPassword,
            role: 'admin',
            createdAt: new Date()
        });

        await newUser.save();

        return NextResponse.json({
            success: true,
            message: `User ${username} has been RESET. New password is: ${newPassword}`,
            action: 'Deleted old user and created new one.'
        });

    } catch (error: any) {
        console.error('Fix Admin Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
