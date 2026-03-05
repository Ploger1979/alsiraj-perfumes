"use client";

import { useState } from 'react';
import { formatCurrency } from '@/utils/format';
import { useRouter } from 'next/navigation';

export default function InvoiceGenerator() {
    const router = useRouter();
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [deliveryCost, setDeliveryCost] = useState(0);
    const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);
    const [notes, setNotes] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);
    const [manualTotal, setManualTotal] = useState<number | string>('');

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const calculatedTotal = subtotal + deliveryCost;
    const finalTotal = manualTotal !== '' ? Number(manualTotal) : calculatedTotal;

    const handleAddItem = () => setItems([...items, { name: '', quantity: 1, price: 0 }]);
    const handleRemoveItem = (index: number) => setItems(items.filter((_, i) => i !== index));
    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...items];
        // @ts-ignore
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handlePrint = () => window.print();

    const formatDateAr = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('ar-IQ', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div>
            <style>{`
                /* ==========================================
                   PRINT STYLES - إخفاء كل شيء ما عدا الفاتورة
                ========================================== */
                @media print {
                    html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                    }
                    .no-print { display: none !important; }
                    .invoice-wrapper {
                        padding: 0 !important;
                        margin: 0 !important;
                        background: white !important;
                    }
                    .invoice-paper {
                        box-shadow: none !important;
                        border: none !important;
                        margin: 0 !important;
                        padding: 24px !important;
                        max-width: 100% !important;
                        border-radius: 0 !important;
                    }
                }

                /* ==========================================
                   FORM STYLES
                ========================================== */
                .inv-form-section {
                    background: var(--card-bg, #1a1a2e);
                    border: 1px solid rgba(212,175,55,0.2);
                    border-radius: 12px;
                    padding: 1.5rem;
                }
                .inv-form-section h3 {
                    color: var(--color-gold, #c9a84c);
                    margin: 0 0 1rem 0;
                    font-size: 1rem;
                    border-bottom: 1px solid rgba(212,175,55,0.2);
                    padding-bottom: 0.5rem;
                }
                .inv-input {
                    width: 100%;
                    padding: 10px 12px;
                    border-radius: 8px;
                    border: 1px solid rgba(255,255,255,0.15);
                    background: rgba(255,255,255,0.05);
                    color: var(--color-text, #fff);
                    font-size: 0.95rem;
                    box-sizing: border-box;
                    direction: rtl;
                }
                .inv-input:focus { outline: none; border-color: #c9a84c; }
                .inv-input::placeholder { color: #888; }

                /* ==========================================
                   INVOICE PAPER STYLES
                ========================================== */
                .invoice-paper {
                    background: #fff;
                    color: #1a1a1a;
                    padding: 40px;
                    max-width: 820px;
                    margin: 0 auto;
                    border-radius: 12px;
                    box-shadow: 0 8px 40px rgba(0,0,0,0.3);
                    direction: rtl;
                    font-family: 'Cairo', 'Tajawal', 'Arial', sans-serif;
                    position: relative;
                    overflow: hidden;
                }

                /* الشعار كخلفية مائية احترافية */
                .invoice-watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 420px;
                    height: 420px;
                    opacity: 0.07;
                    pointer-events: none;
                    z-index: 0;
                    filter: invert(15%) sepia(60%) saturate(600%) hue-rotate(190deg) brightness(0.6) contrast(1.2);
                }

                .invoice-content { position: relative; z-index: 1; }

                /* Header */
                .inv-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 0;
                    margin-bottom: 0;
                }
                .inv-header-left {
                    flex: 1;
                }
                .inv-header-center {
                    flex: 0 0 auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 0 24px;
                }
                .inv-header-right {
                    flex: 1;
                    text-align: left;
                }
                .inv-header-divider {
                    height: 4px;
                    background: linear-gradient(90deg, #c9a84c 0%, #e8c94c 50%, #c9a84c 100%);
                    margin: 18px 0 20px;
                    border-radius: 2px;
                }
                .inv-company-name {
                    font-size: 1.55rem;
                    font-weight: 900;
                    color: #0f1923;
                    margin: 0 0 4px 0;
                    letter-spacing: -0.5px;
                }
                .inv-company-sub {
                    font-size: 0.82rem;
                    color: #c9a84c;
                    font-weight: 700;
                    margin: 0 0 3px 0;
                }
                .inv-company-contact {
                    font-size: 0.76rem;
                    color: #555;
                    margin: 1px 0;
                }
                .inv-title {
                    font-size: 2rem;
                    font-weight: 900;
                    color: #0f1923;
                    margin: 0;
                    letter-spacing: 1px;
                }
                .inv-title span {
                    color: #c9a84c;
                }
                .inv-number {
                    font-size: 0.9rem;
                    color: #777;
                    margin: 4px 0 2px 0;
                    direction: ltr;
                }
                .inv-date {
                    font-size: 0.85rem;
                    color: #333;
                    margin: 2px 0 0 0;
                }
                .inv-logo-ring {
                    width: 130px;
                    height: 130px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #0f1923 0%, #1a2a3a 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 0 4px #c9a84c, 0 0 0 7px rgba(201,168,76,0.15), 0 8px 30px rgba(0,0,0,0.25);
                }

                /* Customer info */
                .inv-customer {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0;
                    background: #f8f6f0;
                    border-radius: 10px;
                    overflow: hidden;
                    margin-bottom: 24px;
                    border: 1px solid #e0d8c8;
                }
                .inv-customer-field {
                    font-size: 0.92rem;
                    color: #333;
                    padding: 14px 16px;
                    border-bottom: 1px solid #e0d8c8;
                    border-left: 1px solid #e0d8c8;
                }
                .inv-customer-field:nth-child(odd) { border-left: 3px solid #c9a84c; }
                .inv-customer-field:nth-child(even) { border-left: none; }
                .inv-customer-field strong {
                    display: block;
                    font-size: 0.72rem;
                    color: #c9a84c;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 3px;
                    font-weight: 700;
                }

                /* Table */
                .inv-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                    font-size: 0.9rem;
                }
                .inv-table thead tr {
                    background: linear-gradient(135deg, #0f1923 0%, #1a2a3a 100%);
                    color: #c9a84c;
                }
                .inv-table thead tr th:first-child { border-radius: 0 8px 0 0; }
                .inv-table thead tr th:last-child  { border-radius: 8px 0 0 0; }
                .inv-table th {
                    padding: 13px 12px;
                    text-align: right;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    font-size: 0.82rem;
                }
                .inv-table th:last-child, .inv-table td:last-child { text-align: left; }
                .inv-table th:nth-child(3), .inv-table td:nth-child(3) { text-align: center; }
                .inv-table tbody tr:nth-child(even) { background: #fafaf7; }
                .inv-table tbody tr { transition: background 0.15s; }
                .inv-table td {
                    padding: 12px;
                    border-bottom: 1px solid #ede8da;
                    color: #333;
                    vertical-align: middle;
                }

                /* Totals */
                .inv-totals {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 28px;
                }
                .inv-totals-box {
                    min-width: 260px;
                    border: 1px solid #e0d8c8;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .inv-total-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 14px;
                    font-size: 0.92rem;
                    border-bottom: 1px solid #e0d8c8;
                }
                .inv-total-row:last-child {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    color: #c9a84c;
                    font-weight: 900;
                    font-size: 1.1rem;
                    border-bottom: none;
                }

                /* Footer */
                .inv-terms {
                    background: #f8f6f0;
                    border-radius: 8px;
                    padding: 14px;
                    margin-bottom: 24px;
                    font-size: 0.8rem;
                    color: #666;
                    line-height: 1.8;
                }
                .inv-signatures {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 2px solid #e0d8c8;
                }
                .inv-sig-block {
                    text-align: center;
                    min-width: 150px;
                }
                .inv-sig-line {
                    border-bottom: 2px solid #333;
                    width: 140px;
                    margin: 30px auto 8px;
                }
                .inv-sig-label {
                    font-size: 0.82rem;
                    color: #555;
                }

                .inv-gold-badge {
                    display: inline-block;
                    background: linear-gradient(135deg, #c9a84c, #e8c94c);
                    color: #1a1a1a;
                    font-size: 0.7rem;
                    font-weight: 700;
                    padding: 2px 8px;
                    border-radius: 20px;
                    margin-top: 4px;
                }
            `}</style>

            {/* ==========================================
                ADMIN FORM (مخفي عند الطباعة)
            ========================================== */}
            <div className="no-print" style={{ background: 'var(--bg-dark, #0d1117)', minHeight: '100vh', padding: '120px 2rem 4rem', direction: 'rtl' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <button
                            onClick={() => router.push('/admin/dashboard')}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px 20px', fontSize: '0.95rem', backgroundColor: '#1f1f2e', color: '#c9a84c', border: '1px solid #c9a84c', cursor: 'pointer', borderRadius: '8px' }}
                        >
                            ⬅ لوحة التحكم
                        </button>
                        <h1 style={{ margin: 0, color: '#c9a84c', fontSize: '1.5rem' }}>🧾 إنشاء فاتورة بيع</h1>
                        <button
                            onClick={handlePrint}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px 20px', fontSize: '0.95rem', backgroundColor: '#c9a84c', color: '#1a1a1a', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold' }}
                        >
                            🖨️ طباعة / PDF
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

                        {/* بيانات العميل */}
                        <div className="inv-form-section">
                            <h3>📋 بيانات العميل</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <input className="inv-input" placeholder="اسم العميل" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                                <input className="inv-input" placeholder="رقم الهاتف" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                                <input className="inv-input" placeholder="العنوان / المحافظة" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} />
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '4px' }}>تاريخ الفاتورة</label>
                                        <input className="inv-input" type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '4px' }}>رقم الفاتورة</label>
                                        <input className="inv-input" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '4px' }}>أجور التوصيل (دينار)</label>
                                    <input className="inv-input" type="number" placeholder="0" value={deliveryCost} onChange={e => setDeliveryCost(Number(e.target.value))} />
                                </div>
                            </div>
                        </div>

                        {/* المنتجات */}
                        <div className="inv-form-section">
                            <h3>📦 المنتجات</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto', paddingLeft: '4px' }}>
                                {items.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <input
                                            className="inv-input"
                                            placeholder="اسم العطر / المنتج"
                                            value={item.name}
                                            onChange={e => handleItemChange(index, 'name', e.target.value)}
                                            style={{ flex: 3 }}
                                        />
                                        <input
                                            className="inv-input"
                                            type="number"
                                            placeholder="كمية"
                                            value={item.quantity}
                                            onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))}
                                            style={{ width: '55px', flex: 'none', textAlign: 'center' }}
                                        />
                                        <input
                                            className="inv-input"
                                            type="number"
                                            placeholder="السعر"
                                            value={item.price || ''}
                                            onChange={e => handleItemChange(index, 'price', Number(e.target.value))}
                                            style={{ flex: 2, textAlign: 'left', direction: 'ltr' }}
                                        />
                                        <button
                                            onClick={() => handleRemoveItem(index)}
                                            style={{ background: 'rgba(255,60,60,0.15)', border: '1px solid rgba(255,60,60,0.3)', color: '#ff6060', borderRadius: '6px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1rem', flexShrink: 0 }}
                                        >×</button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleAddItem}
                                style={{ marginTop: '0.75rem', width: '100%', padding: '8px', background: 'rgba(201,168,76,0.1)', border: '1px dashed #c9a84c', color: '#c9a84c', borderRadius: '8px', cursor: 'pointer' }}
                            >+ إضافة منتج</button>

                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '4px' }}>المبلغ الكلي (إذا أردت تجاوز الحساب التلقائي)</label>
                                <input
                                    className="inv-input"
                                    type="number"
                                    value={manualTotal}
                                    onChange={e => setManualTotal(e.target.value)}
                                    placeholder={`تلقائي: ${calculatedTotal.toLocaleString()} دينار`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ملاحظات */}
                    <div className="inv-form-section">
                        <h3>📝 ملاحظات</h3>
                        <textarea
                            className="inv-input"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="ملاحظات إضافية تظهر في الفاتورة..."
                            rows={2}
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <button
                        onClick={handlePrint}
                        style={{ marginTop: '1.5rem', width: '100%', padding: '14px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #c9a84c, #e8c94c)', color: '#1a1a1a', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        🖨️ طباعة الفاتورة / حفظ كـ PDF
                    </button>
                </div>
            </div>

            {/* ==========================================
                INVOICE PAPER - الفاتورة الحقيقية
            ========================================== */}
            <div className="invoice-wrapper" style={{ padding: '40px 20px', background: '#e8e0d0' }}>
                <div className="invoice-paper">

                    {/* Watermark */}
                    <img src="/logo-ohne-bg.png" alt="" className="invoice-watermark" aria-hidden="true" />

                    <div className="invoice-content">

                        {/* ─── HEADER ─── */}
                        <div className="inv-header">
                            {/* يسار: بيانات الشركة */}
                            <div className="inv-header-left">
                                <h2 className="inv-company-name">شركة السراج للعطور</h2>
                                <p className="inv-company-sub">الموزع الرسمي لوكلاء العراق</p>
                                <p className="inv-company-contact">📞 +964 774 919 1691</p>
                                <span className="inv-gold-badge">Al Siraj Perfumes ★</span>
                            </div>

                            {/* وسط: الشعار بدون خلفية */}
                            <div className="inv-header-center">
                                <img
                                    src="/logo-ohne-bg.png"
                                    alt="Al Siraj Logo"
                                    style={{
                                        width: '130px',
                                        height: '130px',
                                        objectFit: 'contain',
                                        filter: 'invert(15%) sepia(60%) saturate(600%) hue-rotate(190deg) brightness(0.6) contrast(1.2)',
                                    }}
                                />
                            </div>

                            {/* يمين: عنوان الفاتورة */}
                            <div className="inv-header-right">
                                <h1 className="inv-title">فاتورة <span>بيع</span></h1>
                                <p className="inv-number">#{invoiceNumber}</p>
                                <p className="inv-date">📅 {formatDateAr(invoiceDate)}</p>
                            </div>
                        </div>

                        {/* خط ذهبي فاصل */}
                        <div className="inv-header-divider"></div>

                        {/* ─── CUSTOMER INFO ─── */}
                        <div className="inv-customer">
                            <div className="inv-customer-field">
                                <strong>اسم العميل</strong>
                                {customerName || '.....................'}
                            </div>
                            <div className="inv-customer-field">
                                <strong>رقم الهاتف</strong>
                                {customerPhone || '.....................'}
                            </div>
                            <div className="inv-customer-field">
                                <strong>العنوان / المحافظة</strong>
                                {customerAddress || '.....................'}
                            </div>
                            <div className="inv-customer-field">
                                <strong>طريقة الدفع</strong>
                                دفع عند الاستلام (COD)
                            </div>
                        </div>

                        {/* ─── TABLE ─── */}
                        <table className="inv-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '40px' }}>#</th>
                                    <th>المنتج / العطر</th>
                                    <th style={{ width: '70px' }}>الكمية</th>
                                    <th style={{ width: '140px', textAlign: 'left' }}>سعر المفرد</th>
                                    <th style={{ width: '140px', textAlign: 'left' }}>الإجمالي</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, i) => (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center', color: '#999' }}>{i + 1}</td>
                                        <td style={{ fontWeight: item.name ? '600' : '400', color: item.name ? '#1a1a1a' : '#bbb' }}>
                                            {item.name || '—'}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                        <td style={{ textAlign: 'left', direction: 'ltr', fontSize: '0.88rem' }}>{formatCurrency(item.price)}</td>
                                        <td style={{ textAlign: 'left', direction: 'ltr', fontWeight: '700', color: '#c9a84c', fontSize: '0.88rem' }}>{formatCurrency(item.price * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* ─── TOTALS ─── */}
                        <div className="inv-totals">
                            <div className="inv-totals-box">
                                <div className="inv-total-row">
                                    <span>المجموع الفرعي:</span>
                                    <span style={{ direction: 'ltr' }}>{formatCurrency(subtotal)}</span>
                                </div>
                                {deliveryCost > 0 && (
                                    <div className="inv-total-row">
                                        <span>أجور التوصيل:</span>
                                        <span style={{ direction: 'ltr' }}>{formatCurrency(deliveryCost)}</span>
                                    </div>
                                )}
                                <div className="inv-total-row">
                                    <span>💰 المبلغ الكلي:</span>
                                    <span style={{ direction: 'ltr' }}>
                                        {manualTotal !== ''
                                            ? formatCurrency(Number(manualTotal))
                                            : (finalTotal > 0 ? formatCurrency(finalTotal) : '—')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ─── NOTES & TERMS ─── */}
                        <div className="inv-terms">
                            {notes && <p style={{ marginBottom: '8px', color: '#444', fontWeight: '600' }}>📝 {notes}</p>}
                            <p>• البضاعة المباعة لا ترد ولا تستبدل إلا في حالة وجود عيب مصنعي.</p>
                            <p>• الدفع عند الاستلام — يرجى التأكد من المنتجات قبل توقيع الاستلام.</p>
                            <p>• شكراً لثقتكم بشركة السراج للعطور 🌟</p>
                        </div>

                        {/* ─── SIGNATURES ─── */}
                        <div className="inv-signatures">
                            <div className="inv-sig-block">
                                <div className="inv-sig-line"></div>
                                <p className="inv-sig-label">توقيع المستلم</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <img
                                    src="/logo-ohne-bg.png"
                                    alt=""
                                    style={{
                                        width: '65px',
                                        height: '65px',
                                        objectFit: 'contain',
                                        filter: 'invert(15%) sepia(60%) saturate(600%) hue-rotate(190deg) brightness(0.6) contrast(1.2)',
                                    }}
                                />
                                <p style={{ fontSize: '0.72rem', color: '#c9a84c', margin: '4px 0 0', fontWeight: '700', letterSpacing: '0.5px' }}>شركة السراج للعطور</p>
                            </div>
                            <div className="inv-sig-block">
                                <div className="inv-sig-line"></div>
                                <p className="inv-sig-label">توقيع وختم الإدارة</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
