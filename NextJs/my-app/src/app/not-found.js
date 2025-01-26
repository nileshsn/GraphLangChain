import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-6">Page Not Found</h2>
      <p className="text-gray-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
      <Link 
        href="/"
        className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
      >
        Return Home
      </Link>
    </div>
  )
} 