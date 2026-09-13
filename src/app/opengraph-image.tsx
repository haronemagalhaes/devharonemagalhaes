import { ImageResponse } from "next/og";
import { SITE_DESCRIPTOR, SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} — ${SITE_DESCRIPTOR}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Open Graph 1200×630 — monocromático, com o lockup.
 * PENDÊNCIA: substituir por arte final se o Harone preferir (basta colocar
 * `public/opengraph-image.png` e remover este arquivo).
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#F6F5F2",
          color: "#141414",
          fontFamily: "Inter, Helvetica, Arial, sans-serif",
          position: "relative",
        }}
      >
        {/* arcos concêntricos */}
        <div
          style={{
            position: "absolute",
            right: -220,
            top: -160,
            width: 900,
            height: 900,
            display: "flex",
          }}
        >
          {[900, 760, 620, 480, 340, 200].map((d) => (
            <div
              key={d}
              style={{
                position: "absolute",
                left: (900 - d) / 2,
                top: (900 - d) / 2,
                width: d,
                height: d,
                borderRadius: 9999,
                border: "1px solid #E3E1DC",
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, letterSpacing: -1 }}>
            {SITE_NAME}
          </div>
          <div style={{ width: 1, height: 28, background: "#E3E1DC" }} />
          <div
            style={{
              display: "flex",
              fontSize: 16,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#6B6B6B",
            }}
          >
            {SITE_DESCRIPTOR}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 820 }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>
            Tiro sua empresa do improviso digital
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#6B6B6B" }}>
            Sites · Sistemas · Automação · Tráfego pago — Aracaju, atendo todo o Brasil
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
