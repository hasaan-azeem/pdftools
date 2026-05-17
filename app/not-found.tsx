import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="text-8xl font-extrabold text-gray-200 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
          <p className="text-gray-500 mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors inline-block"
          >
            Back to all tools
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
