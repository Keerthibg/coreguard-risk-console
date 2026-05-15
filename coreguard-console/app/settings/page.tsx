"use client"

export default function Settings() {
  return (
    <main style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>⚙️ Settings</h1>
      <p>CoreGuard system settings</p>

      <div style={{ marginTop: "20px" }}>
        <p>🔐 Security: Enabled</p>
        <p>🌐 Mode: Development</p>
      </div>
    </main>
  )
}