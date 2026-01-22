"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminAuth() {
    const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState<string | React.ReactNode>('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (view === 'forgot') {
            // ... (keep forgot password logic or update if needed) ...
            try {
                const res = await fetch('/api/auth/reset-request', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });
                const data = await res.json();
                if (res.ok) {
                    if (data.debugLink) {
                        setSuccess(
                            <span>
                                {data.message} <br />
                                <a href={data.debugLink} style={{ color: 'blue', textDecoration: 'underline' }}>
                                    اضغط هنا لاستعادة كلمة المرور (رابط مؤقت)
                                </a>
                            </span>
                        );
                    } else {
                        setSuccess(data.message || 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
                    }
                } else {
                    setError(data.error);
                }
            } catch (err) {
                setError('حدث خطأ في الاتصال');
            }
            return;
        }

        const endpoint = view === 'login' ? '/api/auth/login' : '/api/auth/signup';
        // For login, we only need username and password
        const body = { username, password };
        if (view === 'signup') {
            // If we allow signup (maybe not? better to remove signup for public)
            // Ideally public signup should be disabled for an admin panel. 
            // We should restrict creating users to the logged-in admin.
            // But if the user WANTS signup, we will connect it.
            // Let's assume for now we only fix login, and maybe disable signup in UI or connect it if endpoints exist.
            // As per request "add other admins", usually done from dashboard.
            // I will update login part here.
            Object.assign(body, { email });
        }

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (data.success) { // Our API returns { success: true }
                if (view === 'login') {
                    // sessionStorage.setItem('isAdmin', 'true'); 
                    // No need for session storage if we rely on cookie, or keep it for client compat
                    sessionStorage.setItem('isAdmin', 'true');
                    router.push('/admin/dashboard');
                } else {
                    setSuccess('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
                    setView('login');
                    setPassword('');
                }
            } else {
                setError(data.message || data.error || 'حدث خطأ');
            }
        } catch (err) {
            setError('حدث خطأ في الاتصال');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            paddingTop: '80px',
            direction: 'rtl'
        }}>
            <form onSubmit={handleSubmit} style={{
                background: 'var(--card-bg)',
                padding: '2.5rem',
                borderRadius: '16px',
                border: '1px solid var(--card-border)',
                width: '100%',
                maxWidth: '450px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
                <h2 style={{ textAlign: 'center', color: 'var(--color-gold)', fontSize: '2rem', marginBottom: '1rem' }}>
                    {view === 'login' ? 'تسجيل الدخول' : (view === 'signup' ? 'إنشاء حساب جديد' : 'نسيت كلمة المرور')}
                </h2>

                {error && <div style={{ color: '#ff4444', background: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>{error}</div>}
                {success && <div style={{ color: '#00C851', background: 'rgba(0,200,0,0.1)', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>{success}</div>}

                {view === 'forgot' ? (
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>أدخل البريد الإلكتروني المسجل</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@mail.com"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                ) : (
                    <>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>اسم المستخدم</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {view === 'signup' && (
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@mail.com"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>كلمة المرور</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        paddingLeft: '40px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        fontSize: '1rem'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        left: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#666'
                                    }}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {view === 'login' && (
                            <div style={{ textAlign: 'left', marginTop: '-10px' }}>
                                <button
                                    type="button"
                                    onClick={() => { setView('forgot'); setError(''); setSuccess(''); }}
                                    style={{ background: 'none', border: 'none', color: 'var(--color-gold)', cursor: 'pointer', fontSize: '0.9rem' }}
                                >
                                    نسيت كلمة المرور؟
                                </button>
                            </div>
                        )}
                    </>
                )}

                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '12px', fontSize: '1.1rem' }}>
                    {view === 'login' ? 'دخول' : (view === 'signup' ? 'تسجيل حساب' : 'إرسال الرابط')}
                </button>

                <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)' }}>
                    {view === 'login' ? (
                        <p>
                            ليس لديك حساب؟{' '}
                            <span
                                onClick={() => { setView('signup'); setError(''); setSuccess(''); }}
                                style={{ color: 'var(--color-gold)', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                سجل الآن
                            </span>
                        </p>
                    ) : (
                        <p>
                            {view === 'signup' ? 'لديك حساب بالفعل؟' : 'تذكرت كلمة المرور؟'}{' '}
                            <span
                                onClick={() => { setView('login'); setError(''); setSuccess(''); }}
                                style={{ color: 'var(--color-gold)', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                تسجيل الدخول
                            </span>
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}
