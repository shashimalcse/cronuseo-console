import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Resource() {
  return (
    <div className='flex'>
      <h1 className='font-sans text-xl font-bold mx-8 my-5'>Resources</h1>
    </div>
  )
}
