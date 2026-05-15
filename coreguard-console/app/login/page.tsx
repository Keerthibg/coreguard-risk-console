"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const login = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()

    if (data.success) {
      localStorage.setItem("role", data.role)
      router.push("/dashboard")
    } else {
      alert("Invalid login")
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          width: 350,
          padding: 30,
          borderRadius: 12,
          background: "white",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>🔐 CoreGuard Login</h2>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 20,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={login}
          style={{
            width: "100%",
            padding: 10,
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <p style={{ fontSize: 12, marginTop: 10, color: "gray" }}>
          Demo: admin / 1234 or user / 1234
        </p>
      </div>
    </div>
  )
}