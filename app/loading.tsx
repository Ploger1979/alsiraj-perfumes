"use client";

export default function Loading() {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            width: "100%",
            color: "var(--color-gold)"
        }}>
            <div className="spinner"></div>
            <style jsx>{`
                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 3px solid rgba(212, 175, 55, 0.3);
                    border-radius: 50%;
                    border-top-color: var(--color-gold);
                    animation: spin 1s ease-in-out infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
