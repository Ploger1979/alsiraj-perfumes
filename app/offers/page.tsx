
import { products as staticProducts } from '../../data/products';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';

export const metadata = {
    title: 'العروض الخاصة | السراج للعطور',
    description: 'تصفح أفضل العروض والخصومات على العطور العالمية في العراق.',
};

export const dynamic = 'force-dynamic';

export default async function OffersPage() {
    await dbConnect();
    let allProducts = await Product.find({}).lean();
    if (!allProducts || allProducts.length === 0) {
        allProducts = staticProducts as any;
    }

    allProducts = JSON.parse(JSON.stringify(allProducts));

    // تصفية المنتجات لجلب التي عليها عرض حقيقي (isOffer = true AND has originalPrice)
    const offerProducts = allProducts.filter((p: any) => p.isOffer && p.originalPrice && p.originalPrice > 0);

    return (
        <>

            <main className="container" style={{ paddingTop: '100px', paddingBottom: '50px', minHeight: '80vh' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-gold)' }}>العروض الخاصة 🔥</h1>
                    <p style={{ color: 'white', fontSize: '1.2rem' }}>اغتنم الفرصة وتسوق عطورك المفضلة بأفضل الأسعار</p>
                </div>

                {offerProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--card-bg)', borderRadius: '12px' }}>
                        <p style={{ fontSize: '1.2rem' }}>لا توجد عروض حالياً، يرجى التحقق لاحقاً!</p>
                        <Link href="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
                            تصفح كل المنتجات
                        </Link>
                    </div>
                ) : (
                    <div className="products-grid">
                        {offerProducts.map((product: any) => (
                            <div key={product.id} className="product-card" style={{ position: 'relative' }}>
                                {/* شارة الخصم */}
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'red',
                                    color: 'white',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    zIndex: 2,
                                    fontSize: '0.9rem'
                                }}>
                                    عرض خاص
                                </div>

                                <div className="product-image-container">
                                    <Link href={`/products/${product.id}`}>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="product-image"
                                            style={{ cursor: "pointer" }}
                                        />
                                    </Link>
                                </div>
                                <div className="product-info">
                                    <h3 className="product-title">{product.name}</h3>
                                    <p className="product-category" style={{ color: '#888', marginBottom: '0.5rem' }}>{product.category}</p>

                                    <div className="product-price" style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
                                        {product.isOffer && product.originalPrice ? (
                                            <>
                                                <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9em' }}>
                                                    {product.originalPrice.toLocaleString()} د.ع
                                                </span>
                                                <span style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2em' }}>
                                                    {product.price.toLocaleString()} د.ع
                                                </span>
                                            </>
                                        ) : (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>
                                                {product.price.toLocaleString()} د.ع
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'center', width: '100%' }}>
                                        <AddToCartButton product={product} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

        </>
    );
}
