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
                                <a href="https://www.instagram.com/alsirajperfumes/" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.instagram}`} aria-label="Instagram">
                                    <Instagram size={20} />
                                </a>
                                <a href="https://www.facebook.com/profile.php?id=100066571796739" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.facebook}`} aria-label="Facebook">
                                    <Facebook size={20} />
                                </a>
                                <a href="https://www.tiktok.com/@alsirajperfumes3" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.tiktok}`} aria-label="TikTok">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="19"
                                        height="19"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        stroke="none"
                                    >
                                        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
                                    </svg>
                                </a>
                                <a href="https://wa.me/4915735435630" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.whatsapp}`} aria-label="WhatsApp">
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
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </a>
                            </div>
                            <p className={styles.contactInfo}>البريد الإلكتروني: info@alsiraj-perfumes.com</p>
                        </div>
                    </div>

                    {/* حقوق النشر */}
                    <div className={styles.copyright}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <p>
                                &copy; {new Date().getFullYear()} السراج للعطور. جميع الحقوق محفوظة.
                            </p>
                            <img
                                src="/logo-ohne-bg.png"
                                alt="Alsiraj Logo"
                                style={{
                                    height: '40px',
                                    width: 'auto',
                                    filter: 'brightness(1.5)', // Adjust for dark theme if needed
                                    opacity: 0.9
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
