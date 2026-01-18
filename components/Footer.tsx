import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import styles from "./Footer.module.css";

// مكون تذييل الصفحة (فوتر) الذي يظهر في أسفل كل الصفحات
export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {/* Brand */}
                        <div className={styles.brand}>
                            <h3>السراج للعطور</h3>
                            <p>
                                اكتشف جوهر الفخامة مع مجموعتنا المتميزة<br /> من العطور الفرنسية والزيوت الأصلية.
                            </p>
                        </div>

                        {/* Links */}
                        <div className={styles.column}>
                            <h4>روابط سريعة</h4>
                            <ul>
                                <li><Link href="/products">جميع المنتجات</Link></li>
                                <li><Link href="/products/offers">عروض خاصة</Link></li>
                                <li><Link href="/about">من نحن</Link></li>
                                <li><Link href="/contact">تواصل معنا</Link></li>
                            </ul>
                        </div>

                        {/* Categories */}
                        <div className={styles.column}>
                            <h4>المجموعات</h4>
                            <ul>
                                <li><Link href="/products/perfumes/french">عطور فرنسية</Link></li>
                                <li><Link href="/products/perfumes/oils">زيوت عطرية</Link></li>
                                <li><Link href="/products/perfumes/men">مجموعة الرجال</Link></li>
                                <li><Link href="/products/perfumes/women">مجموعة النساء</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className={styles.column}>
                            <h4>تواصل معنا</h4>
                            <div className={styles.socials}>
                                <a href="https://www.instagram.com/alsiraj_perfumes" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><Instagram size={20} /></a>
                                <a href="https://www.facebook.com/profile.php?id=100066571796739" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><Facebook size={20} /></a>
                                <a href="https://www.tiktok.com/@alsiraj_perfumes" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                    </svg>
                                </a>
                            </div>
                            <p className={styles.contactInfo}>البريد الإلكتروني: info@alsiraj.com</p>
                        </div>
                    </div>

                    {/* حقوق النشر */}
                    <div className={styles.copyright}>
                        <p>
                            &copy; {new Date().getFullYear()} السراج للعطور. جميع الحقوق محفوظة.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
