
export default function Login() {
  return (
    <div className='flex justify-center items-center w-screen h-screen'>
      <div className="w-full h-full  blur-2xl"></div>
      <div className='absolute flex flex-col justify-center items-center gap-10 w-full'>
        <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-gray-400 to-black">
          cronuseo
        </div>
        <div className="flex flex-row justify-center items-center gap-10">
          <button className='w-[130px] bg-yellow-500 rounded-md px-6 py-2 text-white text-lg'>
            Sign In
          </button>
          <button className='w-[130px] bg-black rounded-md px-6 py-2 text-white text-lg'>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}
