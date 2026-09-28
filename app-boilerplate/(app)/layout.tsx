import AppSidebar from "../_components/app-sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container grid grid-cols-1 gap-6 md:grid-cols-[16rem_1fr]">
      <AppSidebar />
      <section className="min-h-[60vh]">{children}</section>
    </div>
  )
}
