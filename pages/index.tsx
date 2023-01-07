import { Inter } from '@next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className='flex flex-col'>
      <div className='flex flex-grow justify-between items-start w-[100hv] h-[50px] mx-8 my-4'>
        <h1 className='font-sans text-xl font-bold'>Dashboard</h1>
      </div>
      <div className='flex flex-row ml-5'>
        <Link href={'/playground'}>
        <div className='flex w-[300px] h-[300px] border border-gray-100 rounded-lg bg-white shadow-md p-2 justify-center items-center font-bold text-lg'>
          Playground
        </div>
        </Link>
      </div>
    </div>
  )
}
