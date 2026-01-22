"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import styles from "./SearchModal.module.css";
import { X, Search } from "lucide-react";
import { products } from "@/data/products";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";

// نافذة البحث عن المنتجات
export default function SearchModal() {
    // نستخدم السياق (Context) لمعرفة ما إذا كانت نافذة البحث مفتوحة أم لا
    const { isSearchOpen, setIsSearchOpen } = useCart();
    const [query, setQuery] = useState(""); // النص الذي يكتبه المستخدم للبحث
    const inputRef = useRef<HTMLInputElement>(null); // مرجع لحقل الإدخال للتركيز عليه تلقائياً

    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isSearchOpen]);

    // تصفية المنتجات بناءً على نص البحث (الاسم أو الوصف)
    const filteredProducts = query
        ? products.filter((p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
        )
        : [];

    if (!isSearchOpen) return null;

    return (
        <div className={`${styles.overlay} ${isSearchOpen ? styles.open : ""}`}>
            <div className={styles.container}>
                <button onClick={() => setIsSearchOpen(false)} className={styles.closeBtn}>
                    <X size={32} />
                </button>

                <div className={styles.inputWrapper}>
                    <Search className={styles.searchIcon} size={24} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="ابحث عن عطر..."
                        className={styles.input}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {/* نتائج البحث */}
                <div className={styles.results}>
                    {filteredProducts.map((product) => (
                        <Link
                            href={`/products/${product.id}`}
                            key={product.id}
                            className={styles.resultItem}
                            onClick={() => setIsSearchOpen(false)}
                        >
                            <img src={product.image} alt={product.name} className={styles.resultImage} />
                            <div className={styles.resultInfo}>
                                <div className={styles.resultName}>{product.name}</div>
                                <div className={styles.resultPrice}>{formatCurrency(product.price)}</div>
                            </div>
                        </Link>
                    ))}
                    {query && filteredProducts.length === 0 && (
                        <div style={{ color: "var(--text-muted)", textAlign: "center", marginTop: "2rem" }}>
                            لا توجد نتائج
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
