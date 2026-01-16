import Link from "next/link";

export default function CartPage() {
    return (
        <div className="container" style={{ padding: "4rem 1.5rem", minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <h1 style={{ fontSize: "3rem", marginBottom: "2rem" }}>سلة التسوق</h1>
            <p style={{ fontSize: "1.2rem", color: "var(--color-text-muted)", marginBottom: "2rem" }}>سلة التسوق الخاصة بك فارغة حاليًا.</p>
            <Link href="/products" className="btn btn-primary">
                متابعة التسوق
            </Link>
        </div>
    );
}
