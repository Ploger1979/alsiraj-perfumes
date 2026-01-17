"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";

// زر "أضف للسلة" المستخدم داخل بطاقات المنتجات
export default function AddToCartButton({ product }: { product: Product }) {
    const { addToCart } = useCart();

    return (
        <button
            className="btn"
            onClick={() => addToCart(product)}
        >
            أضف إلى السلة
        </button>
    );
}
