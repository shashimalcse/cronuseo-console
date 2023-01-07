import React from 'react'
const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 h-[60px] w-screen bg-[#343432] z-50">
            <div className='flex flex-row justify-between items-center h-[60px]'>
                <img src='/logo.png' className="h-8 mx-[45px]"/>
                <img src='/account.jpg' className="h-10 mx-[20px] rounded-full"/>
            </div>
        </nav>
    )
}

export default Navbar;