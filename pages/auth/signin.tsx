import { useRouter } from "next/router"
import { useState } from "react"
import { routes } from "../../src/routes"
import { signIn } from "next-auth/react"
import { redirect } from "next/dist/server/api-utils"

export default function Login() {
  const router = useRouter()
  const [user, setUser] = useState({ username: "", password: "" })

  async function handleLogin() {
    const res = await signIn('credentials', {username: user.username, password:user.password, redirect:false})
    if (res?.status === 200) {
      router.push('/')
    }
  }

  return (
    <div className='flex justify-center items-center w-screen h-screen'>
      <div className="w-full h-full  blur-2xl"></div>
      <div className='absolute flex flex-col justify-center items-center gap-10 w-full'>
        <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-gray-400 to-black">
          cronuseo
        </div>
        <div className="flex flex-col justify-center items-center gap-5">
          <div>
            <input value={user.username} onChange={(e) => { setUser({ username: e.target.value, password: user.password }) }} type="text" id="username" className="block w-[300px] p-2 border border-yellow-500 rounded" placeholder='Username' />
          </div>
          <div>
            <input value={user.password} onChange={(e) => { setUser({ password: e.target.value, username: user.username }) }} type="password" id="password" className="block w-[300px] p-2 border border-yellow-500 rounded" placeholder='Password' />
          </div>
          <button className='w-[130px] bg-black rounded-md px-5 py-2 text-white text-sm' onClick={() => { handleLogin() }}>
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
