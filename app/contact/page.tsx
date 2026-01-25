// صفحة "تواصل معنا"
export default function ContactPage() {
  return (
    <div className="container" style={{ padding: "4rem 1.5rem" }}>
      <br />
      <br />
      <br />
      <h1
        style={{ fontSize: "3rem", marginBottom: "3rem", textAlign: "center" }}
      >
        تواصل معنا
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "4rem",
        }}
      >
        {/* معلومات الاتصال (يسار الشاشة في الشاشات الكبيرة) */}
        <div>
          <h2 style={{ marginBottom: "1.5rem" }}>ابقى على تواصل</h2>
          <p style={{ marginBottom: "1rem", color: "var(--color-text-muted)" }}>
            لديك أسئلة حول منتجاتنا؟ نحن هنا للمساعدة.
          </p>
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>البريد الإلكتروني:</strong> info@alsiraj-perfumes.com
            </p>
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>الهاتف:</strong> +49 157 3543 5630
            </p>
            <p>
              <strong>العنوان:</strong>
              شارع حسنكوي, Tel Afar, Iraq
            </p>
          </div>
        </div>

        {/* نموذج الاتصال (الاسم، البريد، الرسالة) */}
        <form
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <input
            type="text"
            placeholder="الاسم"
            style={{
              padding: "1rem",
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              color: "var(--foreground)",
              borderRadius: "4px",
            }}
          />
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            style={{
              padding: "1rem",
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              color: "var(--foreground)",
              borderRadius: "4px",
            }}
          />
          <textarea
            placeholder="رسالتك"
            rows={5}
            style={{
              padding: "1rem",
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              color: "var(--foreground)",
              borderRadius: "4px",
            }}
          ></textarea>
          <button type="submit" className="btn btn-primary">
            إرسال الرسالة
          </button>
        </form>
      </div>
    </div>
  );
}
