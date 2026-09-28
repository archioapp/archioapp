import AdminNav from "../_components/admin-nav"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[15rem_1fr]">
        <AdminNav />
        <section className="min-h-[60vh]">{children}</section>
      </div>
    </div>
  )
}
