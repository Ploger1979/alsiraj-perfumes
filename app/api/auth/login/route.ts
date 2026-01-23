
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

        // EMERGENCY BACKDOOR (Trimmed):
        if ((username === 'admin1979' && password === '!Admin1979') || (username === 'admin1979' && password === '123456')) {
            // Bypass all DB checks
            const response = NextResponse.json({ success: true, message: 'تم تسجيل الدخول بنجاح (Bypass)' });
            response.cookies.set('auth', 'true', { path: '/', maxAge: 60 * 60 * 24 * 7 });
            return response;
        }

        if (!user) {
            return NextResponse.json({ success: false, message: `مستخدم غير موجود. وصلني: ${username}` }, { status: 401 });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password!);

        if (!isMatch) {
            return NextResponse.json({ success: false, message: `كلمة المرور خطأ (v3). وصلني: [${password}]` }, { status: 401 });
        }

        // If successful, we can return a success message.
        // In a real app, we would set a session cookie here or return a JWT token.
        // For simplicity with the existing frontend flow, we'll return success: true.
        // Ideally, we should use HTTP-only cookies for session management.

        // Let's create a simple token or just rely on client-side state for this specific "static-like" project transition,
        // BUT actually the client-side code sets a cookie 'auth'. 
        // We should just return success and let the client handle the cookie setting for now to minimize friction,
        // OR better: set the cookie here on the server side for security.

        const response = NextResponse.json({ success: true, message: 'تم تسجيل الدخول بنجاح' });

        // Set a simple auth cookie (in real production, sign this!)
        // For now, we mimic the previous behavior but validated against DB.
        response.cookies.set('auth', 'true', {
            httpOnly: false, // Client needs to read it for now based on existing logic? Or we change logic.
            // Existing logic uses `Cookies.set('auth', 'true')` on client.
            // We can keep client logic for now to reduce refactoring risk.
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'حدث خطأ أثناء تسجيل الدخول' }, { status: 500 });
    }
}
