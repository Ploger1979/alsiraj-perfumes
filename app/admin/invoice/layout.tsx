import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'فاتورة بيع | شركة السراج للعطور',
};

// Layout منفصل للفاتورة - بدون navbar وكات bar
export default function InvoiceLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* إخفاء navbar وcategoryBar عند طباعة الفاتورة فقط */}
            <style>{`
                @media print {
                    nav, header,
                    [class*="navbar"], [class*="Navbar"],
                    [class*="categoryBar"], [class*="CategoryBar"],
                    [class*="bar_bar"], [class*="scrolled"] {
                        display: none !important;
                    }
                    body > *:first-child { display: none !important; }
                }
            `}</style>
            {children}
        </>
    );
}
