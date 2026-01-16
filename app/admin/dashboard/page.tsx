"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';


// صفحة لوحة التحكم لإضافة المنتجات
// Dashboard page for adding products
export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'add' | 'list' | 'invoice'>('add');
    const [productsList, setProductsList] = useState<any[]>([]);

    const [editingId, setEditingId] = useState<number | null>(null);

    const tableContainerRef = useRef<HTMLDivElement>(null);
    const topScrollRef = useRef<HTMLDivElement>(null);
    const [tableWidth, setTableWidth] = useState(0);

    useEffect(() => {
        const updateWidth = () => {
            if (activeTab === 'list' && tableContainerRef.current) {
                setTableWidth(tableContainerRef.current.scrollWidth);
            }
        };

        // Initial check
        updateWidth();
        // Check after a small timeout to ensure rendering is complete
        setTimeout(updateWidth, 100);

        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, [productsList, activeTab]);

    const handleScroll = (source: 'top' | 'table') => {
        if (source === 'top' && tableContainerRef.current && topScrollRef.current) {
            tableContainerRef.current.scrollLeft = topScrollRef.current.scrollLeft;
        } else if (source === 'table' && topScrollRef.current && tableContainerRef.current) {
            topScrollRef.current.scrollLeft = tableContainerRef.current.scrollLeft;
        }
    };

    // الحالة لتخزين بيانات المنتج الجديد
    // State to hold new product data
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        category: 'men',
        gender: 'رجالي',
        concentration: 'Eau de Toilette',
        size: '100ml',
        isFeatured: false,
        isOffer: false,
        salePrice: '',
        images: [] as string[]
    });

    useEffect(() => {
        // التحقق من صلاحية الدخول
        if (!sessionStorage.getItem('isAdmin')) {
            router.push('/admin');
        }
    }, [router]);

    // جلب المنتجات عند فتح تبويب القائمة
    useEffect(() => {
        if (activeTab === 'list') {
            fetchProducts();
        }
    }, [activeTab]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            if (res.ok) {
                // ترتيب المنتجات الأحدث أولاً
                setProductsList(data.products.reverse());
            }
        } catch (error) {
            console.error('Error fetching products');
        }
    };

    const handleEdit = (product: any) => {
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.isOffer && product.originalPrice ? product.originalPrice : product.price,
            image: product.image,
            category: product.category,
            gender: product.gender,
            concentration: product.concentration,
            size: product.size || '100ml',
            isFeatured: product.isFeatured || false,
            isOffer: product.isOffer || false,
            salePrice: product.isOffer ? product.price : '',
            images: product.images || [product.image]
        });
        setEditingId(product.id);
        setActiveTab('add'); // Switch to form
        window.scrollTo(0, 0); // Scroll to top
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            image: '',
            category: 'men',
            gender: 'رجالي',
            concentration: 'Eau de Toilette',
            size: '100ml',
            isFeatured: false,
            isOffer: false,
            salePrice: '',
            images: []
        });
        setEditingId(null);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.')) return;

        try {
            const res = await fetch('/api/admin/delete-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('تم الحذف بنجاح');
                fetchProducts(); // Refresh list
            } else {
                alert('فشل الحذف: ' + data.error);
            }
        } catch (e) {
            alert('حدث خطأ');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const endpoint = editingId ? '/api/admin/edit-product' : '/api/admin/add-product';
        const bodyContent = editingId ? { ...formData, id: editingId } : formData;

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyContent),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(editingId ? 'تم تحديث المنتج بنجاح! ✅' : 'تم إضافة المنتج بنجاح! 🎉');
                resetForm();
            } else {
                setMessage(`حدث خطأ: ${data.error}`);
            }
        } catch (error) {
            setMessage('حدث خطأ أثناء الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px', direction: 'rtl' }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    height: 12px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.05);
                    border-radius: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #d4af37;
                    border-radius: 6px;
                    border: 3px solid transparent;
                    background-clip: content-box;
                }
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #d4af37 rgba(255,255,255,0.05);
                }
            `}} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>{editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                        onClick={() => {
                            sessionStorage.removeItem('isAdmin');
                            router.push('/admin');
                        }}
                        className="btn"
                        style={{ borderColor: 'red', color: 'red', width: '100%' }}
                    >
                        تسجيل الخروج
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="btn"
                        style={{ fontSize: '0.9rem' }}
                    >
                        العودة للموقع 🏠
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
                <button
                    onClick={() => { setActiveTab('add'); resetForm(); }}
                    className={`btn ${activeTab === 'add' ? 'btn-primary' : ''}`}
                >
                    {editingId ? 'العودة للإضافة' : 'إضافة منتج'}
                </button>
                <button
                    onClick={() => setActiveTab('list')}
                    className={`btn ${activeTab === 'list' ? 'btn-primary' : ''}`}
                >
                    إدارة المنتجات (تعديل/حذف)
                </button>
                <button
                    onClick={() => router.push('/admin/invoice')}
                    className="btn"
                >
                    نظام الفواتير 📄
                </button>
            </div>

            {message && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: message.includes('نجاح') ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                    border: `1px solid ${message.includes('نجاح') ? 'green' : 'red'}`,
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    {message}
                </div>
            )}

            {activeTab === 'add' ? (
                <form onSubmit={handleSubmit} style={{
                    background: 'var(--card-bg)',
                    padding: '2rem',
                    borderRadius: '12px',
                    border: '1px solid var(--card-border)',
                    display: 'grid',
                    gap: '1.5rem',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    {/* اسم المنتج */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>اسم المنتج</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            placeholder="مثال: Dior Sauvage"
                        />
                    </div>

                    {/* الوصف */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>وصف المنتج</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' }}
                            placeholder="اكتب وصفاً جذاباً للمنتج..."
                        />
                    </div>

                    {/* السعر والصورة */}
                    {/* السعر */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>السعر (دينار عراقي)</label>
                        <input
                            type="number"
                            required
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            placeholder="مثال: 150000"
                        />
                    </div>

                    {/* خيار العرض (اختياري) */}
                    <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', border: '1px dashed #ccc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: formData.isOffer ? '1rem' : '0' }}>
                            <input
                                type="checkbox"
                                id="isOffer"
                                checked={formData.isOffer}
                                onChange={(e) => setFormData({ ...formData, isOffer: e.target.checked })}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="isOffer" style={{ fontWeight: 'bold', cursor: 'pointer', color: formData.isOffer ? 'var(--color-gold)' : '#333' }}>
                                تفعيل هذا المنتج كعرض خاص (Sale) 🔥
                            </label>
                        </div>

                        {formData.isOffer && (
                            <div className="animate-fade-in">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'red' }}>سعر العرض (بعد الخصم)</label>
                                <input
                                    type="number"
                                    required={formData.isOffer}
                                    value={formData.salePrice}
                                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid red' }}
                                    placeholder="أدخل السعر الجديد المخفض..."
                                />
                                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                                    * سيظهر السعر القديم ({formData.price || '...'}) مشطوباً، وسيتم اعتماد هذا السعر الجديد للبيع.
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>صورة المنتج</label>

                        {/* مربع الرفع */}
                        <div
                            style={{
                                border: '2px dashed var(--color-gold)',
                                borderRadius: '8px',
                                padding: '1rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: formData.image ? 'transparent' : 'rgba(212, 175, 55, 0.05)',
                                position: 'relative',
                                minHeight: '150px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column'
                            }}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    if (!e.target.files?.[0]) return;

                                    const file = e.target.files[0];
                                    const data = new FormData();
                                    data.append('file', file);

                                    // تعيين حالة التحميل
                                    const uploadLabel = document.getElementById('upload-status');
                                    if (uploadLabel) uploadLabel.innerText = "جاري رفع الصورة...";

                                    try {
                                        const res = await fetch('/api/upload', {
                                            method: 'POST',
                                            body: data
                                        });
                                        const result = await res.json();

                                        if (result.success) {
                                            setFormData({ ...formData, image: result.path });
                                        } else {
                                            alert('فشل الرفع: ' + result.error);
                                        }
                                    } catch (err) {
                                        alert('حدث خطأ أثناء الرفع');
                                    } finally {
                                        if (uploadLabel) uploadLabel.innerText = "";
                                    }
                                }}
                                style={{
                                    opacity: 0,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    cursor: 'pointer',
                                    zIndex: 10
                                }}
                            />

                            {formData.image ? (
                                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '140px',
                                            objectFit: 'contain',
                                            borderRadius: '4px'
                                        }}
                                    />
                                    <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: 'green' }}>تم اختيار الصورة بنجاح ✅</p>
                                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#666' }}>(اضغط لتغيير الصورة)</p>
                                </div>
                            ) : (
                                <>
                                    <span style={{ fontSize: '2rem' }}>📷</span>
                                    <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>اضغط هنا لرفع صورة</p>
                                    <p style={{ fontSize: '0.8rem', color: '#666' }} id="upload-status">أو قم بسحب الصورة وإفلاتها هنا</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* خيارات إضافية (القسم، النوع، التركيز، الحجم) */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            {/* القسم */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>القسم (Category)</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', background: '#333', color: '#fff' }}
                                >
                                    <option value="men">رجالي (Men)</option>
                                    <option value="women">نسائي (Women)</option>
                                    <option value="unisex">للجنسين (Unisex)</option>
                                    <option value="french">فرنسي (French)</option>
                                    <option value="oils">زيوت (Oils)</option>
                                </select>
                            </div>

                            {/* النوع */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>النوع (Gender)</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', background: '#333', color: '#fff' }}
                                >
                                    <option value="رجالي">رجالي</option>
                                    <option value="نسائي">نسائي</option>
                                    <option value="للجنسين">للجنسين</option>
                                </select>
                            </div>

                            {/* التركيز */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>التركيز</label>
                                <select
                                    value={formData.concentration}
                                    onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', background: '#333', color: '#fff' }}
                                >
                                    <option value="Eau de Toilette">Eau de Toilette</option>
                                    <option value="Parfum">Parfum</option>
                                    <option value="Oil">Oil</option>
                                </select>
                            </div>
                        </div>

                        {/* الحجم */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>الحجم (Size)</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {['50ml', '100ml', '150ml'].map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, size })}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '20px',
                                            border: formData.size === size ? '2px solid var(--color-gold)' : '1px solid #666',
                                            background: formData.size === size ? 'var(--color-gold)' : 'transparent',
                                            color: formData.size === size ? '#000' : '#fff',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {/* إدخال مخصص للحجم إذا لزم الأمر */}
                            <input
                                type="text"
                                value={formData.size}
                                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                placeholder="أو اكتب الحجم يدوياً..."
                                style={{ marginTop: '0.5rem', width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: 'transparent', color: '#fff' }}
                            />
                        </div>
                    </div>


                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="btn"
                                style={{ marginTop: '1rem', padding: '1rem', flex: 1, borderColor: '#ccc' }}
                            >
                                إلغاء
                            </button>
                        )}
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem', flex: 2 }}
                        >
                            {loading ? 'جاري الحفظ...' : (editingId ? 'تحديث المنتج' : 'حفظ المنتج')}
                        </button>
                    </div>
                </form >
            ) : activeTab === 'list' ? (
                <div style={{ background: 'var(--card-bg)', padding: '1rem', borderRadius: '8px' }}>
                    <h2 style={{ marginBottom: '1rem' }}>المنتجات الحالية ({productsList.length})</h2>

                    {/* Top Scrollbar Restored */}
                    <div
                        ref={topScrollRef}
                        onScroll={() => handleScroll('top')}
                        className="custom-scrollbar"
                        style={{
                            overflowX: 'auto',
                            overflowY: 'hidden',
                            marginBottom: '10px',
                            width: '100%',
                            height: '20px' // Touch target height
                        }}
                    >
                        <div style={{ width: tableWidth, height: '1px' }}></div>
                    </div>
                    <div
                        ref={tableContainerRef}
                        onScroll={() => handleScroll('table')}
                        style={{ overflowX: 'auto' }}
                    >
                        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                            <thead>
                                <tr style={{ background: '#f5f5f5', color: 'black' }}>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>الصورة</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>الاسم</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>السعر</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>الحجم</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>القسم</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productsList.map((product) => (
                                    <tr key={product.id}>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.id}</td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                            <img src={product.image} alt={product.name} width={50} height={50} style={{ objectFit: 'contain' }} />
                                        </td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.name}</td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.price}</td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.size || '100ml'}</td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.category}</td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="btn"
                                                style={{ padding: '5px 10px', marginRight: '5px', borderColor: 'var(--color-gold)', color: 'var(--color-gold)', fontSize: '0.8rem' }}
                                            >
                                                تعديل ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="btn"
                                                style={{ padding: '5px 10px', borderColor: 'red', color: 'red', fontSize: '0.8rem' }}
                                            >
                                                حذف 🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : null
            }
        </div >
    );
}
