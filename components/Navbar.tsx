"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, Search, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import styles from "./Navbar.module.css";

import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { setIsCartOpen, setIsSearchOpen, totalItems } = useCart();

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/logo-ohne-bg.png"
                        alt="السراج للعطور"
                        width={150}
                        height={80}
                        style={{
                            objectFit: 'contain',
                            filter: mounted && theme === 'light'
                                ? 'brightness(0) saturate(100%) invert(8%) sepia(34%) saturate(6560%) hue-rotate(209deg) brightness(93%) contrast(100%)'
                                : 'none',
                            transition: 'filter 0.3s ease'
                        }}
                        priority
                    />
                </Link>

                <div className={styles.desktopMenu}>
                    <Link href="/">الرئيسية</Link>
                    <Link href="/products">المنتجات</Link>
                    <Link href="/offers">العروض</Link>
                    <Link href="/about">من نحن</Link>
                    <Link href="/contact">تواصل معنا</Link>
                </div>

                <div className={styles.icons}>
                    {mounted && (
                        <button
                            className={styles.iconButton}
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    )}
                    <button
                        className={styles.iconButton}
                        onClick={() => setIsSearchOpen(true)}
                    >
                        <Search size={20} />
                    </button>
                    <button
                        className={styles.cartIcon}
                        onClick={() => setIsCartOpen(true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <ShoppingCart size={20} />
                        <span className={styles.cartCount}>{totalItems}</span>
                    </button>
                </div>

                <button className={styles.mobileButton} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div >

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={styles.mobileMenu}
                    >
                        <div className={styles.mobileLinks}>
                            <Link href="/" onClick={() => setIsOpen(false)}>الرئيسية</Link>
                            <Link href="/products" onClick={() => setIsOpen(false)}>المنتجات</Link>
                            <Link href="/offers" onClick={() => setIsOpen(false)}>العروض</Link>
                            <Link href="/about" onClick={() => setIsOpen(false)}>من نحن</Link>
                            <Link href="/contact" onClick={() => setIsOpen(false)}>تواصل معنا</Link>
                            <button
                                onClick={() => { setIsCartOpen(true); setIsOpen(false); }}
                                style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', textAlign: 'right' }}
                            >
                                السلة ({totalItems})
                            </button>
                            {mounted && (
                                <button
                                    className={styles.iconButton}
                                    style={{ justifyContent: "center", width: "100%" }}
                                    onClick={() => {
                                        setTheme(theme === "dark" ? "light" : "dark");
                                        setIsOpen(false);
                                    }}
                                >
                                    {theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
}
