import Head from "next/head"
import { useRouter } from "next/router"
import { SyntheticEvent, useEffect, useState } from "react"
import Layout from "../components/layout"
import { fetchData } from "../services/request"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push("/trips")
  }, [])

  return (
    <Layout>
      <div className=""></div>
    </Layout>
  )
}
