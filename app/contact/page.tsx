"use client";

import { useState } from "react";

// صفحة "تواصل معنا" - محسنة بنظام إرسال احترافي
export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا.");
        (e.target as HTMLFormElement).reset();
      } else {
        const err = await res.json();
        throw new Error(err.error || "فشل الإرسال");
      }
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "حدث خطأ ما، يرجى المحاولة لاحقاً.");
    }
  };

  return (
    <div className="container" style={{ padding: "8rem 1.5rem 4rem" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "3rem", textAlign: "center", color: 'var(--color-gold, #c9a84c)' }}>
        تواصل معنا
      </h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "4rem",
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        {/* معلومات الاتصال */}
        <div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.02) 100%)',
            padding: '1.5rem',
            borderRadius: '15px',
            borderRight: '4px solid #c9a84c',
            marginBottom: '2rem'
          }}>
            <h2 style={{ margin: 0, color: '#c9a84c', fontSize: '1.5rem', fontWeight: '900', letterSpacing: '0.5px' }}>
              شركة السراج للعطور
            </h2>
            <p style={{ margin: '5px 0 0', color: '#fff', fontSize: '0.95rem', fontWeight: 'bold', opacity: 0.9 }}>
              الموزع الرسمي لوكلاء العراق
            </p>
          </div>

          <p style={{ marginBottom: "2rem", color: "var(--color-text-muted)", fontSize: '1rem', lineHeight: '1.8' }}>
            نحن نقدر تواصلك معنا. إذا كان لديك أي استفسار حول منتجاتنا أو ترغب في الحصول على استشارة عطرية، فلا تتردد في مراسلتنا.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📧</span>
              <p style={{ margin: 0, fontSize: '1rem' }}><strong>البريد:</strong> info@alsiraj-perfumes.com</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📞</span>
              <p style={{ margin: 0, fontSize: '1rem' }}><strong>الهاتف:</strong> +964 774 919 1691</p>
            </div>
          </div>
        </div>

        {/* نموذج الاتصال */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
            background: 'rgba(255,255,255,0.02)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <input
            name="name"
            type="text"
            placeholder="الاسم الكامل"
            required
            style={{
              padding: "1rem",
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              color: "var(--foreground)",
              borderRadius: "8px",
              outline: 'none'
            }}
          />
          <input
            name="email"
            type="email"
            placeholder="البريد الإلكتروني"
            required
            style={{
              padding: "1rem",
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              color: "var(--foreground)",
              borderRadius: "8px",
              outline: 'none'
            }}
          />
          <textarea
            name="message"
            placeholder="بماذا يمكننا مساعدتك؟"
            required
            rows={5}
            style={{
              padding: "1rem",
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              color: "var(--foreground)",
              borderRadius: "8px",
              resize: 'none',
              outline: 'none'
            }}
          ></textarea>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={status === "loading"}
            style={{ padding: '1rem', fontWeight: 'bold' }}
          >
            {status === "loading" ? "جاري الإرسال..." : "إرسال الرسالة"}
          </button>

          {message && (
            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              textAlign: 'center',
              background: status === "success" ? 'rgba(0,255,0,0.05)' : 'rgba(255,0,0,0.05)',
              color: status === "success" ? '#4caf50' : '#f44336',
              border: `1px solid ${status === "success" ? '#4caf5033' : '#f4433633'}`,
              fontSize: '0.9rem'
            }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
