"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./CategoryBar.module.css";

// شريط التصنيفات الذي يظهر تحت الناف بار (فلترة المنتجات)
export default function CategoryBar() {
    const pathname = usePathname(); // معرفة الصفحة الحالية لتمييز الزر النشط

    // قائمة التصنيفات: الاسم والرابط
    const categories = [
        { name: "الكل", path: "/products" },
        { name: "ماركات عالمية", path: "/products/perfumes/french" },
        { name: "تيستيرات", path: "/products/perfumes/eau-de-toilette" },
        { name: "رجالي", path: "/products/perfumes/men" },
        { name: "نسائي", path: "/products/perfumes/women" },
        { name: "يونيسكس", path: "/products/perfumes/unisex" },
        { name: "زيوت عطرية", path: "/products/perfumes/oils" },
    ];

    return (
        <div className={styles.bar}>
            <div className={styles.container}>
                {categories.map((cat) => {
                    const isActive = pathname === cat.path;
                    return (
                        <Link
                            key={cat.path}
                            href={cat.path}
                            className={`${styles.link} ${isActive ? styles.active : ""}`}
                        >
                            {cat.name}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
