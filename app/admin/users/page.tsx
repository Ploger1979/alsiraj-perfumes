
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, UserPlus, Shield } from 'lucide-react';

export default function UsersManagement() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password.length < 6) {
            setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();

            if (data.success) {
                setSuccess('تم إضافة المشرف بنجاح');
                setUsername('');
                setPassword('');
                fetchUsers(); // Refresh list
            } else {
                setError(data.error || 'حدث خطأ');
            }
        } catch (err) {
            setError('فشل الاتصال بالسيرفر');
        }
    };

    const handleDeleteUser = async (id: string, name: string) => {
        if (!confirm(`هل أنت متأكد من حذف المشرف "${name}"؟`)) return;

        try {
            const res = await fetch('/api/admin/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();
            if (data.success) {
                fetchUsers();
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert('فشل الحذف');
        }
    };

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px', direction: 'rtl' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--color-gold)' }}>إدارة المشرفين</h1>
                <button
                    onClick={() => router.push('/admin/dashboard')}
                    className="btn"
                >
                    العودة للوحة التحكم
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Form Section */}
                <div style={{
                    background: 'var(--card-bg)',
                    padding: '2rem',
                    borderRadius: '12px',
                    border: '1px solid var(--card-border)',
                    height: 'fit-content'
                }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <UserPlus size={24} color="var(--color-gold)" />
                        إضافة مشرف جديد
                    </h3>

                    <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>اسم المستخدم / البريد</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', background: '#222', color: '#fff' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>كلمة المرور</label>
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="6 أحرف على الأقل"
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', background: '#222', color: '#fff' }}
                            />
                        </div>

                        {error && <div style={{ color: '#ff4444', fontSize: '0.9rem' }}>{error}</div>}
                        {success && <div style={{ color: '#00C851', fontSize: '0.9rem' }}>{success}</div>}

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            إضافة
                        </button>
                    </form>
                </div>

                {/* List Section */}
                <div style={{
                    background: 'var(--card-bg)',
                    padding: '2rem',
                    borderRadius: '12px',
                    border: '1px solid var(--card-border)'
                }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Shield size={24} color="var(--color-gold)" />
                        قائمة المشرفين المسجلين
                    </h3>

                    {loading ? (
                        <p>جاري التحميل...</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {users.map((user: any) => (
                                <div key={user._id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '8px'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user.username}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#888' }}>
                                            تاريخ الإضافة: {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-gold)', marginTop: '4px' }}>
                                            {user.role}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDeleteUser(user._id, user.username)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#ff4444',
                                            padding: '8px'
                                        }}
                                        title="حذف المشرف"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                            {users.length === 0 && <p style={{ color: '#888' }}>لا يوجد مشرفين</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
