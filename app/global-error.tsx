"use client";

export default function GlobalError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-Hant">
      <body>
        <main style={{ minHeight: "100vh", background: "#F7F4EF", color: "#2B2623", padding: "96px 24px" }}>
          <section style={{ margin: "0 auto", maxWidth: 640, textAlign: "center" }}>
            <p style={{ color: "#C8B08A", fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase" }}>
              ROLA Boutique
            </p>
            <h1 style={{ marginTop: 20, fontFamily: "Georgia, serif", fontSize: 40, fontWeight: 400 }}>
              網站暫時無法顯示
            </h1>
            <p style={{ marginTop: 20, lineHeight: 1.8, color: "rgba(43,38,35,0.7)" }}>
              請重新整理頁面，或稍後再試。
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                marginTop: 32,
                border: "1px solid #2B2623",
                background: "transparent",
                color: "#2B2623",
                minHeight: 48,
                padding: "12px 24px",
                letterSpacing: "0.14em"
              }}
            >
              重新整理
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
