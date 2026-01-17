// صفحة "من نحن" التعريفية
export default function AboutPage() {
    return (
        <div className="container" style={{ padding: "4rem 1.5rem" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
                <br />
                <br />
                <br />
                <h1 style={{ fontSize: "3rem", marginBottom: "2rem" }}>من نحن</h1>
                <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "var(--color-text-muted)", marginBottom: "2rem" }}>
                    السراج للعطور هي دار عطور فاخرة متخصصة في صناعة أرقى العطور والزيوت العطرية ،
                    مستوحاة من عمق التراث العطري العربي وأناقة الروائح الفرنسية، نقدم مجموعة متقنة تجسد الفخامة والرقي في أدق تفاصيلها
                </p>
                <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "var(--color-text-muted)", marginBottom: "2rem" }}>
                    مهمتنا هي تزويد عملائنا بأحدث وأجود العطور، حيث تمثل كل زجاجة تحفة فنية مصممة خصيصًا لإثارة المشاعر وترك بصمة تدوم في الذاكرة.
                </p>
                <div style={{ marginTop: "4rem" }}>
                    <img
                        src="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=2000&auto=format&fit=crop"
                        alt="من نحن"
                        style={{ width: "100%", borderRadius: "8px" }}
                    />
                </div>
            </div>
        </div>
    );
}
