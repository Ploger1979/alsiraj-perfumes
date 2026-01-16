import Link from "next/link";
import Image from "next/image";

export default function PerfumesPage() {
    return (
        <div className="container" style={{ padding: "4rem 1.5rem" }}>
            <h1 style={{ fontSize: "3rem", marginBottom: "4rem", textAlign: "center" }}>مجموعات العطور</h1>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                <Link href="/products/perfumes/french" style={{ display: "block", position: "relative", height: "400px", overflow: "hidden", borderRadius: "8px" }}>
                    <Image
                        src="https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=1000&auto=format&fit=crop"
                        alt="French Perfumes"
                        fill
                        style={{ objectFit: "cover", transition: "transform 0.5s" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <h2 style={{ fontSize: "2.5rem", color: "#FFFFFF", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>عطور فرنسية</h2>
                    </div>
                </Link>

                <Link href="/products/perfumes/oils" style={{ display: "block", position: "relative", height: "400px", overflow: "hidden", borderRadius: "8px" }}>
                    <Image
                        src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1000&auto=format&fit=crop"
                        alt="Perfume Oils"
                        fill
                        style={{ objectFit: "cover", transition: "transform 0.5s" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <h2 style={{ fontSize: "2.5rem", color: "#FFFFFF", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>زيوت عطرية</h2>
                    </div>
                </Link>
            </div>
        </div>
    );
}
