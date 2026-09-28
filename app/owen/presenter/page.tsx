import type { Metadata } from "next"
import { OwenPresenter } from "@/components/owen/owen-presenter"

export const metadata: Metadata = { title: "Presenter · for Owen" }

export default function OwenPresenterPage() {
  return <OwenPresenter />
}
