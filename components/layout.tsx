import Navbar from "./navbar";
import Sidebar from "./sidebar";

const Layout = ({ children }:any) => {
    return (
        <div>
            <Navbar/>
            <div className="flex mt-[60px]">
                <Sidebar/>
                <div className="flex-grow-[1] bg-[#EBEBEB]">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout;