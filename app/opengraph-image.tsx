import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #102A43 0%, #173B5B 55%, #0B1F33 100%)",
          color: "#fff",
          padding: 64,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "absolute", top: -120, right: -80, width: 420, height: 420, borderRadius: 420, background: "rgba(0,166,81,0.22)", filter: "blur(6px)" }} />
        <div style={{ position: "absolute", left: -120, bottom: -140, width: 420, height: 420, borderRadius: 420, background: "rgba(255,255,255,0.08)", filter: "blur(10px)" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 18,
                background: "#00A651",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 900,
                color: "#102A43"
              }}
            >
              RD
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 0.5 }}>The Renewable Directory</div>
              <div style={{ fontSize: 14, opacity: 0.75, letterSpacing: 2, textTransform: "uppercase" }}>Installer search</div>
            </div>
          </div>

          <div style={{ maxWidth: 860, display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                alignSelf: "flex-start",
                padding: "10px 16px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.14)",
                fontSize: 16,
                fontWeight: 700
              }}
            >
              MCS installer directory
            </div>
            <div style={{ fontSize: 72, lineHeight: 0.95, fontWeight: 900, letterSpacing: -2 }}>
              Find trusted solar and heat pump installers across the UK
            </div>
            <div style={{ fontSize: 26, lineHeight: 1.35, color: "rgba(255,255,255,0.82)", maxWidth: 760 }}>
              Browse verified installers, compare coverage, and send qualified enquiries from one clean directory.
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
