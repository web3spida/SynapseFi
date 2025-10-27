import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export const NotFound: FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-gray-400 mb-6">The page you are looking for does not exist.</p>
        <Link to="/" className="inline-block bg-gradient-to-r from-purple-600 to-purple-400 text-white px-6 py-3 rounded-xl font-medium">Go Home</Link>
      </motion.div>
    </div>
  )
}