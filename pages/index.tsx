import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className='flex'>
      <h1 className='font-sans text-xl font-bold mx-8 my-5'>Dashboard</h1>
    </div>
  )
}
