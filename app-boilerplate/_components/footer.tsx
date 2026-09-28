export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container flex h-16 items-center justify-between text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} GoPilot</p>
        <div className="flex gap-4">
          <a className="hover:text-slate-900" href="/privacy-policy">
            Privacy
          </a>
          <a className="hover:text-slate-900" href="/terms-of-service">
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}
