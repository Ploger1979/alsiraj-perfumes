"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductSize } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/format';
import styles from '@/app/products/[id]/product-details.module.css';

interface ProductDetailsProps {
    product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
    // إدارة عربة التسوق: نستخدم هذا الخطاف للوصول إلى وظائف السلة
    const { addToCart } = useCart();
    const router = useRouter();

    // =========================================================================================
    // 🛍️ PRODUCT DISPLAY LOGIC (منطق عرض المنتج)
    // =========================================================================================

    // 1️⃣ استرجاع الأحجام (Get Sizes)
    // نعرض الأحجام المخزنة مباشرة في `product.sizes`.
    // تم إلغاء التسعير التلقائي، لذا نعتمد على البيانات المخزنة يدوياً من الأدمن.
    const displaySizes = product.sizes;


    // 2️⃣ الحالة الأولية (Initial State)
    // - الحجم المختار: نبدأ بأول حجم في القائمة تلقائياً.
    const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(
        displaySizes && displaySizes.length > 0 ? displaySizes[0] : undefined
    );

    // - الصورة المختارة: نبدأ بالصورة الرئيسية للمنتج.
    // يتم تحديث هذه الحالة عند النقر على أسهم التنقل (Slideshow).
    const [selectedImage, setSelectedImage] = useState<string>(product.image);

    // تكلفة التوصيل الثابتة لجميع المحافظات

    // دالة إضافة المنتج للسلة
    const handleAddToCart = () => {
        // تجهيز كائن المنتج للإضافة مع السعر والحجم المختارين
        const productToAdd = {
            ...product,
            price: selectedSize ? selectedSize.price : product.price,
            name: selectedSize ? `${product.name} (${selectedSize.size})` : product.name
        };
        // Hack: Temporarily changing ID logic might break types if ID is strict number.
        // For now, we just add it. The context merges by ID.
        addToCart(productToAdd);
    };

    // حساب السعر الحالي بناءً على الحجم المختار
    const currentPrice = selectedSize ? selectedSize.price : product.price;

    const DELIVERY_COST = 5000;
    const FREE_SHIPPING_THRESHOLD = 100000; // مجاني فوق 100,000 دينار
    const isFreeShipping = currentPrice >= FREE_SHIPPING_THRESHOLD;

    return (
        <div className={styles.container}>
            <div className={`container ${styles.productWrapper}`}>
                {/* Image Section */}
                <div className={styles.imageSection}>
                    {/* 
                      🖼️ SLIDESHOW LOGIC (منطق عرض الصور المتعددة)
                      - إذا كان هناك أكثر من صورة في `product.images`، نعرض أسهم التنقل.
                      - الزر الأيمن والأيسر يقومان بتغيير `selectedImage` من المصفوفة.
                    */}
                    <div className={styles.mainImageContainer} style={{ position: 'relative' }}>
                        {product.images && product.images.length > 1 && (
                            <button
                                onClick={() => {
                                    const images = product.images!;
                                    const currentIndex = images.indexOf(selectedImage || product.image);
                                    const prevIndex = (currentIndex - 1 + images.length) % images.length;
                                    setSelectedImage(images[prevIndex]);
                                }}
                                style={{
                                    position: 'absolute',
                                    left: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    cursor: 'pointer',
                                    zIndex: 10,
                                    fontSize: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                &#10095;
                            </button>
                        )}

                        <img
                            src={selectedImage || product.image}
                            alt={product.name}
                            className={styles.productImage}
                        />

                        {product.images && product.images.length > 1 && (
                            <button
                                onClick={() => {
                                    const images = product.images!;
                                    const currentIndex = images.indexOf(selectedImage || product.image);
                                    const nextIndex = (currentIndex + 1) % images.length;
                                    setSelectedImage(images[nextIndex]);
                                }}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    cursor: 'pointer',
                                    zIndex: 10,
                                    fontSize: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                &#10094;
                            </button>
                        )}
                    </div>
                </div>

                {/* Details Section */}
                <div className={styles.detailsSection}>
                    <div className={styles.brand}>السراج للعطور</div>
                    <h1 className={styles.title}>
                        {product.name}
                        {product.nameAr && <span style={{ display: 'block', fontSize: '0.6em', color: '#888', marginTop: '8px' }}>{product.nameAr}</span>}
                    </h1>
                    <div className={styles.concentration}>
                        {product.concentration || 'Eau de Parfum'} | {product.gender || 'للجنسين'}
                    </div>



                    {/* 
                       📏 SIZE SELECTION (اختيار الحجم)
                       - نعرض قائمة بالأحجام المتاحة `displaySizes`.
                       - عند النقر على حجم، نحدث `selectedSize`.
                       - نعرض السعر (والسعر قبل الخصم) الخاص بكل حجم.
                    */}
                    {displaySizes && displaySizes.length > 0 && (
                        <div className={styles.sizeSelection}>
                            {displaySizes.map((sizeOption, index) => (
                                <div
                                    key={index}
                                    className={`${styles.sizeOption} ${selectedSize?.size === sizeOption.size ? styles.selected : ''}`}
                                    onClick={() => setSelectedSize(sizeOption)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div className={styles.sizeRadio}></div>
                                        <div style={{ marginRight: '1rem', fontWeight: 500 }}>
                                            {sizeOption.size}
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'left' }}>
                                        {(sizeOption.originalPrice || 0) > 0 && (
                                            <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.8rem' }}>
                                                {formatCurrency(sizeOption.originalPrice || 0)}
                                            </div>
                                        )}
                                        <div style={{ color: selectedSize?.size === sizeOption.size ? '#000' : '#d4af37', fontWeight: 'bold' }}>
                                            {formatCurrency(sizeOption.price)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Meta Info */}
                    <div className={styles.metaInfo}>
                        <div className={styles.stockStatus}>
                            <span style={{ fontSize: '1.2rem' }}>●</span>
                            <span>متوفر (Online)</span>
                        </div>
                        <div className={styles.deliveryInfo}>
                            <span>
                                {isFreeShipping
                                    ? "✨ هذا المنتج مؤهل للشحن المجاني"
                                    : `شحن مجاني للطلبات فوق ${formatCurrency(FREE_SHIPPING_THRESHOLD)}`
                                }
                            </span>
                        </div>
                        <div className={styles.deliveryInfo}>
                            <span>التوصيل: يومين - 4 أيام عمل</span>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    {/* Delivery & Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                        <div style={{ background: 'rgba(212,175,55,0.07)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.2)' }}>
                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.95rem' }}>
                                🚚 التوصيل لجميع المحافظات
                            </p>
                            {isFreeShipping && (
                                <p style={{ margin: '4px 0 0', color: 'var(--color-gold, #c9a84c)', fontSize: '0.9rem' }}>
                                    ✨ التوصيل مجاني لطلبك!
                                </p>
                            )}
                        </div>

                        {/* زر الإضافة للسلة */}
                        <button onClick={handleAddToCart} className={styles.addToCartBtn}>
                            أضف إلى السلة
                        </button>

                        {/* زر الطلب عبر الواتساب */}
                        <button
                            onClick={() => {
                                const price = selectedSize ? selectedSize.price : product.price;
                                const sizeLabel = selectedSize ? selectedSize.size : (product.size || 'Standard');

                                const deliveryCost = isFreeShipping ? 0 : DELIVERY_COST;
                                const totalWithDelivery = price + deliveryCost;

                                let message = "مرحباً، أود إتمام الطلب التالي:\n\n";
                                message += `* ${product.name} (${sizeLabel}): 1 × ${formatCurrency(price)}\n`;
                                message += `\n------------------\n`;
                                message += `المجموع الفرعي: ${formatCurrency(price)}\n`;
                                message += isFreeShipping
                                    ? `التوصيل: مجاني ✨\n`
                                    : `التوصيل لجميع المحافظات: ${formatCurrency(deliveryCost)}\n`;
                                message += `\n*المجموع الكلي: ${formatCurrency(totalWithDelivery)}*\n`;
                                message += `------------------\n`;
                                message += "\nيرجى تأكيد الطلب وتزويدي بموعد الاستلام.";

                                const url = `https://wa.me/9647749191691?text=${encodeURIComponent(message)}`;
                                window.open(url, '_blank');
                            }}
                            className={styles.whatsappBtn}
                        >
                            اطلب عبر الواتساب (الدفع عند الاستلام)
                        </button>

                        <button
                            onClick={() => router.back()}
                            className={styles.backBtn}
                        >
                            عودة للقائمة
                        </button>
                    </div>

                    {/* Product Info Accordion/List */}
                    <div className={styles.productInfo}>
                        <h3 className={styles.infoTitle}>تفاصيل المنتج</h3>
                        <p className={styles.description}>{product.description}</p>

                        {product.notes && product.notes.length > 0 && (
                            <div style={{ marginTop: '1.5rem' }}>
                                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 600 }}>المكونات العطرية:</h4>
                                <ul className={styles.notes}>
                                    {product.notes.map((note, idx) => (
                                        <li key={idx} className={styles.noteItem}>{note}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
