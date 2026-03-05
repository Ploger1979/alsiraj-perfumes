'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }

        if (password !== confirm) {
            setError('كلمتا المرور غير متطابقتين');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess('تم تغيير كلمة المرور بنجاح! سيتم توجيهك لتسجيل الدخول...');
                setTimeout(() => router.push('/admin'), 2500);
            } else {
                setError(data.error || 'حدث خطأ، حاول مرة أخرى');
            }
        } catch {
            setError('فشل الاتصال بالسيرفر');
        } finally {
            setLoading(false);
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
                <h2 style={{ textAlign: 'center', color: 'var(--color-gold)', fontSize: '2rem', marginBottom: '0.5rem' }}>
                    كلمة مرور جديدة 🔐
                </h2>
                <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {email}
                </p>

                {error && <div style={{ color: '#ff4444', background: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>{error}</div>}
                {success && <div style={{ color: '#00C851', background: 'rgba(0,200,0,0.1)', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>{success}</div>}

                {!success && (
                    <>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>كلمة المرور الجديدة</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="6 أحرف على الأقل"
                                    style={{ width: '100%', padding: '12px', paddingLeft: '40px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>تأكيد كلمة المرور</label>
                            <input
                                type="password"
                                required
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder="أعد كتابة كلمة المرور"
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary"
                            style={{ padding: '12px', fontSize: '1.1rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
                            disabled={loading}>
                            {loading ? 'جاري الحفظ...' : 'حفظ كلمة المرور الجديدة'}
                        </button>
                    </>
                )}
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>جاري التحميل...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
