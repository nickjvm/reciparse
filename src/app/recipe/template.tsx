import Header from "@/components/Header"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
}
export default function Template({ children }: Props) {
  return (
    <>
      <Header/>
      {children}
    </>
  )
}