"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import styles from "./CartDrawer.module.css";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";

// مكون القائمة الجانبية للسلة
export default function CartDrawer() {
    // جلب بيانات ووظائف السلة من المزود (Context)
    const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalPrice } = useCart();

    const DELIVERY_COST = 5000; // تكلفة التوصيل لجميع المحافظات
    const FREE_SHIPPING_THRESHOLD = 100000; // الشحن مجاني للطلبات فوق 100,000 دينار
    const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
    const deliveryCost = isFreeShipping ? 0 : DELIVERY_COST;
    const finalTotal = totalPrice + deliveryCost;

    if (!isCartOpen) return null;

    return (
        <>
            <div
                className={`${styles.overlay} ${isCartOpen ? styles.open : ""}`}
                onClick={() => setIsCartOpen(false)}
            />
            {/* القائمة الجانبية نفسها */}
            <div className={`${styles.drawer} ${isCartOpen ? styles.open : ""}`}>
                <div className={styles.header}>
                    <h2 className={styles.title}>سلة المشتريات</h2>
                    <button onClick={() => setIsCartOpen(false)} className={styles.closeBtn}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.items}>
                    {cart.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <p>السلة فارغة حالياً</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className={styles.item}>
                                <img src={item.image} alt={item.name} className={styles.itemImage} />
                                <div className={styles.itemDetails}>
                                    <div className={styles.itemName}>
                                        {item.name}
                                        {item.nameAr && <div style={{ fontSize: '0.85em', color: '#aaa', marginTop: '2px' }}>{item.nameAr}</div>}
                                    </div>
                                    <div className={styles.itemPrice}>{formatCurrency(item.price)}</div>
                                    <div className={styles.quantityControls}>
                                        <button
                                            className={styles.qtyBtn}
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            className={styles.qtyBtn}
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Plus size={14} />
                                        </button>
                                        <button
                                            className={styles.qtyBtn}
                                            style={{ marginRight: 'auto', color: '#ff4444', borderColor: '#ff4444' }}
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.deliverySelector} style={{ marginBottom: '1rem', padding: '10px', background: 'rgba(212,175,55,0.07)', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.2)' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>
                                🚚 التوصيل لجميع المحافظات
                            </p>
                            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--color-gold, #c9a84c)' }}>
                                {isFreeShipping ? '✨ التوصيل مجاني لطلبك!' : `5,000 دينار عراقي`}
                            </p>
                        </div>

                        <div className={styles.total} style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                            <span>المجموع الفرعي:</span>
                            <span>{formatCurrency(totalPrice)}</span>
                        </div>
                        <div className={styles.total} style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
                            <span>التوصيل:</span>
                            <span>{formatCurrency(deliveryCost)}</span>
                        </div>
                        <div className={styles.total} style={{ borderTop: '1px solid #eee', paddingTop: '10px', fontSize: '1.2rem' }}>
                            <span>المجموع الكلي:</span>
                            <span>{formatCurrency(finalTotal)}</span>
                        </div>

                        {/* زر إتمام الشراء: يقوم بتجهيز رسالة واتساب مفصلة بالطلب */}
                        <button
                            className={styles.checkoutBtn}
                            onClick={() => {
                                const phoneNumber = "9647749191691";

                                let message = "مرحباً، أود إتمام الطلب التالي:\n\n";
                                cart.forEach(item => {
                                    message += `- ${item.name}: ${item.quantity} × ${formatCurrency(item.price)}\n`;
                                });

                                message += `\n------------------\n`;
                                message += `المجموع الفرعي: ${formatCurrency(totalPrice)}\n`;
                                message += isFreeShipping
                                    ? `التوصيل: مجاني ✨\n`
                                    : `التوصيل لجميع المحافظات: ${formatCurrency(DELIVERY_COST)}\n`;
                                message += `\n*المجموع الكلي: ${formatCurrency(finalTotal)}*\n`;
                                message += `------------------\n`;
                                message += "\nيرجى تأكيد الطلب وتزويدي بموعد الاستلام.";

                                const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                                window.open(url, '_blank');
                            }}
                        >
                            إتمام الشراء عبر واتساب
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
