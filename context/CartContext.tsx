"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';

// تعريف نوع البيانات لعنصر في السلة (يرث من المنتج ويضيف الكمية)
export interface CartItem extends Product {
    quantity: number;
}

// تعريف الوظائف والبيانات التي توفرها سلة التسوق
interface CartContextType {
    cart: CartItem[]; // قائمة المنتجات في السلة
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    isSearchOpen: boolean;
    setIsSearchOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// مزود السلة: هذا المكون يغلف التطبيق ليوفر حالة السلة للجميع
export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]); // حالة تخزين منتجات السلة
    const [isCartOpen, setIsCartOpen] = useState(false); // هل القائمة الجانبية للسلة مفتوحة؟
    const [isSearchOpen, setIsSearchOpen] = useState(false); // هل نافذة البحث مفتوحة؟

    // عند تحميل الموقع: محاولة استرجاع السلة المحفوظة من ذاكرة المتصفح
    useEffect(() => {
        const savedCart = localStorage.getItem('alsiraj_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // عند تغيير السلة: حفظ النسخة الجديدة في ذاكرة المتصفح
    useEffect(() => {
        localStorage.setItem('alsiraj_cart', JSON.stringify(cart));
    }, [cart]);

    // دالة إضافة منتج للسلة
    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            // البحث إذا كان المنتج موجوداً مسبقاً بنفس المعرّف
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                // إذا وجد، نزيد الكمية فقط
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            // إذا لم يوجد، نضيفه كعنصر جديد
            return [...prevCart, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true); // نفتح السلة تلقائياً ليرى المستخدم ما أضاف
    };

    const removeFromCart = (productId: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    // حساب إجمالي عدد القطع والسعر الكلي
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
                isCartOpen,
                setIsCartOpen,
                isSearchOpen,
                setIsSearchOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// خطاف (Hook) مخصص لتسهيل استخدام السلة في أي مكان في التطبيق
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
