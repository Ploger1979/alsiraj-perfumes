"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useCart } from "@/context/CartContext";
import styles from "./SearchModal.module.css";
import { X, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";

interface Product {
    id: number;
    name: string;
    nameAr?: string;
    description?: string;
    price: number;
    image: string;
    category?: string;
    concentration?: string;
}

// نافذة البحث - تجلب من MongoDB مباشرة (لا static data)
export default function SearchModal() {
    const { isSearchOpen, setIsSearchOpen } = useCart();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // التركيز على حقل البحث عند فتح النافذة
    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
        // إعادة تعيين عند الإغلاق
        if (!isSearchOpen) {
            setQuery("");
            setResults([]);
            setHasSearched(false);
        }
    }, [isSearchOpen]);

    // البحث مع Debounce (ينتظر 400ms بعد آخر حرف)
    const performSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        setLoading(true);
        setHasSearched(true);

        try {
            const res = await fetch(`/api/products?q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            setResults(data.products || []);
        } catch (err) {
            console.error('Search error:', err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounce - ينتظر 400ms قبل البحث
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            performSearch(query);
        }, 400);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, performSearch]);

    if (!isSearchOpen) return null;

    return (
        <div className={`${styles.overlay} ${isSearchOpen ? styles.open : ""}`}>
            <div className={styles.container}>
                <button onClick={() => setIsSearchOpen(false)} className={styles.closeBtn}>
                    <X size={32} />
                </button>

                <div className={styles.inputWrapper}>
                    {loading ? (
                        <Loader2 className={styles.searchIcon} size={24} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                        <Search className={styles.searchIcon} size={24} />
                    )}
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="ابحث عن عطر بالاسم أو الوصف..."
                        className={styles.input}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button
                            onClick={() => { setQuery(""); setResults([]); }}
                            style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', padding: '0 8px' }}
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* نتائج البحث */}
                <div className={styles.results}>
                    {results.map((product) => (
                        <Link
                            href={`/products/${product.id}`}
                            key={product.id}
                            className={styles.resultItem}
                            onClick={() => setIsSearchOpen(false)}
                        >
                            <img src={product.image} alt={product.name} className={styles.resultImage} />
                            <div className={styles.resultInfo}>
                                <div className={styles.resultName}>
                                    {product.name}
                                    {product.nameAr && (
                                        <span style={{ fontSize: '0.8rem', color: '#aaa', marginRight: '6px' }}>
                                            {product.nameAr}
                                        </span>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '2px' }}>
                                    {product.concentration && `${product.concentration}`}
                                    {product.category && ` · ${product.category}`}
                                </div>
                                <div className={styles.resultPrice}>{formatCurrency(product.price)}</div>
                            </div>
                        </Link>
                    ))}

                    {/* لا توجد نتائج */}
                    {hasSearched && !loading && results.length === 0 && (
                        <div style={{ color: "var(--text-muted)", textAlign: "center", marginTop: "2rem", padding: "1rem" }}>
                            <Search size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <p>لا توجد نتائج لـ "{query}"</p>
                            <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>جرّب كلمات مختلفة أو تحقق من التهجئة</p>
                        </div>
                    )}

                    {/* تلميح أولي */}
                    {!query && !hasSearched && (
                        <div style={{ color: "var(--text-muted)", textAlign: "center", marginTop: "2rem", opacity: 0.5 }}>
                            <Search size={40} style={{ marginBottom: '1rem' }} />
                            <p>ابدأ الكتابة للبحث في جميع العطور</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
