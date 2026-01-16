"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./CategoryBar.module.css";

export default function CategoryBar() {
    const pathname = usePathname();

    const categories = [
        { name: "الكل", path: "/products" },
        { name: "Eau de Toilette", path: "/products/perfumes/eau-de-toilette" },
        { name: "فرنسي", path: "/products/perfumes/french" },
        { name: "زيوت", path: "/products/perfumes/oils" },
        { name: "رجالي", path: "/products/perfumes/men" },
        { name: "نسائي", path: "/products/perfumes/women" },
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
