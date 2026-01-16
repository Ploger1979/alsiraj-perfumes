"use client";

import { useState, useRef } from 'react';

import { formatCurrency } from '@/utils/format';
import { useRouter } from 'next/navigation';

export default function InvoiceGenerator() {
    const router = useRouter();
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [locationType, setLocationType] = useState(''); // baghdad or provinces, or empty
    const [deliveryCost, setDeliveryCost] = useState(0);
    const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);
    const [notes, setNotes] = useState('');

    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
    const [manualTotal, setManualTotal] = useState<number | string>(''); // If empty string, use calculated total

    const componentRef = useRef(null);

    // تحديث سعر التوصيل تلقائياً
    const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value;
        setLocationType(type);
        if (type === 'baghdad') setDeliveryCost(5000);
        else if (type === 'provinces') setDeliveryCost(8000);
        else setDeliveryCost(0);
    };

    // حساب المجاميع
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const calculatedTotal = subtotal + deliveryCost;
    // const finalTotal = manualTotal !== '' ? Number(manualTotal) : calculatedTotal; // Not used directly in render but logic exists

    const handleAddItem = () => {
        setItems([...items, { name: '', quantity: 1, price: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...items];
        // @ts-ignore
        newItems[index][field] = value;
        setItems(newItems);
    };

    // Print functionality
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="invoice-container">
            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white; color: black; }
                    .invoice-paper { box-shadow: none !important; border: none !important; margin: 0 !important; width: 100% !important; }
                }
                .invoice-paper {
                    background: white;
                    color: black;
                    padding: 40px;
                    max-width: 800px;
                    margin: 0 auto;
                    box-shadow: 0 0 20px rgba(0,0,0,0.1);
                    direction: rtl;
                    font-family: 'Times New Roman', serif;
                }
            `}</style>

            {/* Form Section (Hidden when printing) */}
            <div className="no-print container" style={{ paddingTop: '120px', paddingBottom: '2rem', paddingRight: '2rem', paddingLeft: '2rem', direction: 'rtl' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <button
                        onClick={() => router.push('/admin/dashboard')}
                        className="btn"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '2rem',
                            padding: '12px 24px',
                            fontSize: '1.1rem',
                            backgroundColor: '#333',
                            color: 'white',
                            border: '1px solid #555',
                            cursor: 'pointer',
                            borderRadius: '8px'
                        }}
                    >
                        ⬅️ الرجوع إلى لوحة التحكم (Dashboard)
                    </button>
                </div>

                <h1 style={{ marginBottom: '2rem', color: 'var(--color-gold)' }}>إنشاء فاتورة / عقد بيع</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Customer Details Input */}
                    <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '8px' }}>
                        <h3>بيانات العميل والفاتورة</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <input
                                placeholder="اسم العميل"
                                value={customerName}
                                onChange={e => setCustomerName(e.target.value)}
                                style={{ padding: '8px' }}
                            />
                            <input
                                placeholder="رقم الهاتف"
                                value={customerPhone}
                                onChange={e => setCustomerPhone(e.target.value)}
                                style={{ padding: '8px' }}
                            />
                            <input
                                placeholder="العنوان"
                                value={customerAddress}
                                onChange={e => setCustomerAddress(e.target.value)}
                                style={{ padding: '8px' }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <label style={{ whiteSpace: 'nowrap' }}>تاريخ الفاتورة:</label>
                                <input
                                    type="date"
                                    value={invoiceDate}
                                    onChange={e => setInvoiceDate(e.target.value)}
                                    style={{ padding: '8px', width: '100%' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <select
                                    value={locationType}
                                    onChange={handleLocationChange}
                                    style={{ padding: '8px', flex: 1 }}
                                >
                                    <option value="">اختر نوع التوصيل...</option>
                                    <option value="baghdad">داخل بغداد</option>
                                    <option value="provinces">خارج بغداد (محافظات)</option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="سعر التوصيل"
                                    value={deliveryCost}
                                    onChange={e => setDeliveryCost(Number(e.target.value))}
                                    style={{ padding: '8px', width: '100px' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Items Input */}
                    <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '8px' }}>
                        <h3>المنتجات</h3>
                        {items.map((item, index) => (
                            <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <input
                                    placeholder="اسم المنتج"
                                    value={item.name}
                                    onChange={e => handleItemChange(index, 'name', e.target.value)}
                                    style={{ flex: 2, padding: '5px', minWidth: '0' }}
                                />
                                <input
                                    type="number"
                                    placeholder="العدد"
                                    value={item.quantity}
                                    onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))}
                                    style={{ width: '50px', padding: '5px' }}
                                />
                                <input
                                    type="number"
                                    placeholder="السعر"
                                    value={item.price}
                                    onChange={e => handleItemChange(index, 'price', Number(e.target.value))}
                                    style={{ flex: 1, padding: '5px', minWidth: '0' }}
                                />
                                <button onClick={() => handleRemoveItem(index)} style={{ color: 'red' }}>×</button>
                            </div>
                        ))}
                        <button onClick={handleAddItem} className="btn" style={{ marginTop: '0.5rem' }}>+ إضافة منتج</button>

                        {/* Manual Total Override */}
                        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 'bold' }}>
                                المبلغ الكلي النهائي:
                                <input
                                    type="number"
                                    value={manualTotal}
                                    onChange={e => setManualTotal(e.target.value)}
                                    placeholder={formatCurrency(calculatedTotal)}
                                    style={{ padding: '8px', width: '150px', fontSize: '1.1rem', fontWeight: 'bold' }}
                                />
                            </label>
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                                * اتركه فارغاً ليظهر فارغاً في الفاتورة، أو اكتب الرقم المطلوب.
                            </p>
                        </div>
                    </div>
                </div>

                <h3 style={{ marginTop: '1rem' }}>ملاحظات</h3>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}
                    placeholder="ملاحظات إضافية (مثل وقت التسليم)..."
                />

                <button onClick={handlePrint} className="btn btn-primary" style={{ marginTop: '2rem', width: '100%' }}>
                    🖨️ طباعة الفاتورة / حفظ PDF
                </button>
            </div>

            {/* The Actual Invoice (Visible on screen and print) */}
            <div className="invoice-paper" ref={componentRef} style={{ marginTop: '40px', border: '1px solid #ddd' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ margin: 0 }}>مؤسسة السراج للعطور</h2>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Alsiraj Perfumes</p>
                            <p style={{ margin: '5px 0 0', fontSize: '0.8rem' }}>بغداد - العراق</p>
                        </div>
                        <img src="/logo-ohne-bg.png" alt="Logo" style={{ width: '100px', filter: 'invert(1)' }} />
                        <div style={{ textAlign: 'left' }}>
                            <h2 style={{ margin: 0 }}>فاتورة بيع</h2>
                            <p style={{ margin: 0 }}>Sales Receipt</p>
                            <p style={{ margin: '5px 0 0' }}>التاريخ: {new Date(invoiceDate).toLocaleDateString('en-GB')}</p>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.1rem' }}>
                    <div style={{ flex: 1 }}>
                        <p><strong>حضرة السيد/ة:</strong> {customerName}</p>
                        <p><strong>رقم الهاتف:</strong> {customerPhone}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p><strong>العنوان:</strong> {customerAddress}</p>
                        <p><strong>نوع التوصيل:</strong> {locationType === 'baghdad' ? 'داخل بغداد' : locationType === 'provinces' ? 'خارج بغداد (محافظات)' : '................'}</p>
                    </div>
                </div>

                {/* Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #000' }}>
                            <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>#</th>
                            <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>المادة (Item)</th>
                            <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>العدد (Qty)</th>
                            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>سعر المفرد</th>
                            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => (
                            <tr key={i}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{i + 1}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.name}</td>
                                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>{item.quantity}</td>
                                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>{formatCurrency(item.price)}</td>
                                <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>{formatCurrency(item.price * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: '250px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                            <span>المجموع الفرعي:</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                            <span>أجور التوصيل:</span>
                            <span>{deliveryCost > 0 ? formatCurrency(deliveryCost) : ''}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '2px solid #000', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>المبلغ الكلي:</span>
                            <span style={{ fontSize: '1.3rem' }}>
                                {manualTotal !== ''
                                    ? formatCurrency(Number(manualTotal))
                                    : (deliveryCost > 0 || subtotal > 0) ? formatCurrency(calculatedTotal) : ''}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer / Contract Text */}
                <div style={{ marginTop: '40px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                    <p><strong>ملاحظات:</strong> {notes}</p>
                    <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                        * البضاعة المباعة لا ترد ولا تستبدل إلا في حال وجود عيب مصنعي.
                        <br />
                        * الدفع عند الاستلام (Cash on Delivery).
                        <br />
                        * يرجى التأكد من المنتجات عند الاستلام.
                    </p>
                </div>

                <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p>توقيع المستلم</p>
                        <br /><br />
                        <p>.........................</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p>توقيع وختم الإدارة</p>
                        <br /><br />
                        <p>السراج للعطور</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
