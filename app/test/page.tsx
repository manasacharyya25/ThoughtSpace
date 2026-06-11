"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function TestPage() {
  useEffect(() => {
    const test = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getSession()

      console.log("SESSION:", data)
      console.log("ERROR:", error)
    }

    test()
  }, [])

  return (
    <div className="p-10 text-white">
      Supabase Connected
    </div>
  )
}