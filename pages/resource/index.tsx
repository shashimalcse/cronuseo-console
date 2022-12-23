import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const inter = Inter({ subsets: ['latin'] })

export default function Resource() {
  return (
    <div className='flex'>
        <div className='flex flex-grow justify-between items-start w-[100hv] h-[50px] mx-8 my-4'>
            <h1 className='font-sans text-xl font-bold'>Resources</h1>
            <button className='bg-black rounded-md px-4 py-2 text-white font-semibold'>
                <div className='flex flex-row justify-between items-center gap-2'>
                <FontAwesomeIcon icon={faPlus} />
                Create a Resource
                </div>
            </button>
        </div>
    </div>
  )
}
