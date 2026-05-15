"use client"

import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    window.location.href = "/login"
  }, [])

  return (
    <main style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Loading CoreGuard...</h1>
    </main>
  )
}

