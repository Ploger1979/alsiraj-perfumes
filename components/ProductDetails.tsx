"use client";

import { useState } from 'react';
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

    // حالة الحجم المختار: نبدأ بأول حجم متاح إذا وجد، وإلا نتركه فارغاً
    const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(
        product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
    );

    // حالة الصورة المختارة: نبدأ بالصورة الرئيسية للمنتج
    const [selectedImage, setSelectedImage] = useState<string>(product.image);

    // حالة نوع التوصيل: الافتراضي داخل بغداد
    const [deliveryType, setDeliveryType] = useState<'baghdad' | 'provinces'>('baghdad');

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
    const currentOriginalPrice = selectedSize ? selectedSize.originalPrice : product.originalPrice;

    return (
        <div className={styles.container}>
            <div className={`container ${styles.productWrapper}`}>
                {/* Image Section */}
                <div className={styles.imageSection}>
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
                    <h1 className={styles.title}>{product.name}</h1>
                    <div className={styles.concentration}>
                        {product.concentration || 'Eau de Parfum'} | {product.gender || 'للجنسين'}
                    </div>



                    {/* Size Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className={styles.sizeSelection}>
                            {product.sizes.map((sizeOption, index) => (
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
                                        {sizeOption.originalPrice && (
                                            <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.8rem' }}>
                                                {formatCurrency(sizeOption.originalPrice)}
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
                            <span>شحن مجاني للطلبات فوق 200,000 د.ع</span>
                        </div>
                        <div className={styles.deliveryInfo}>
                            <span>التوصيل: يومين - 4 أيام عمل</span>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    {/* Delivery & Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                        {/* Delivery Selector */}
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>موقع التوصيل:</label>
                            <select
                                value={deliveryType}
                                onChange={(e) => setDeliveryType(e.target.value as 'baghdad' | 'provinces')}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #444',
                                    backgroundColor: '#222',
                                    color: '#fff'
                                }}
                            >
                                <option value="baghdad">داخل بغداد (5,000 د.ع)</option>
                                <option value="provinces">خارج بغداد / محافظات (8,000 د.ع)</option>
                            </select>
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
                                const deliveryCost = deliveryType === 'baghdad' ? 5000 : 8000;
                                const locationLabel = deliveryType === 'baghdad' ? 'داخل بغداد' : 'محافظات';
                                const totalWithDelivery = price + deliveryCost;

                                let message = "مرحباً، أود إتمام الطلب التالي:\n\n";
                                message += `* ${product.name} (${sizeLabel}): 1 × ${formatCurrency(price)}\n`;

                                message += `\n------------------\n`;
                                message += `المجموع الفرعي: ${formatCurrency(price)}\n`;
                                message += `التوصيل (${locationLabel}): ${formatCurrency(deliveryCost)}\n`;

                                message += `\n*المجموع الكلي: ${formatCurrency(totalWithDelivery)}*\n`;
                                message += `------------------\n`;

                                message += "\nيرجى تأكيد الطلب وتزويدي بموعد الاستلام.";

                                const url = `https://wa.me/4915735435630?text=${encodeURIComponent(message)}`;
                                window.open(url, '_blank');
                            }}
                            className={styles.whatsappBtn}
                        >
                            اطلب عبر الواتساب (الدفع عند الاستلام)
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
