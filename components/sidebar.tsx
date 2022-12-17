import Link from 'next/link'
import { RiDashboardLine, RiAdminFill } from 'react-icons/ri';
import { FiUsers } from 'react-icons/fi';
import { GrResources } from 'react-icons/gr';
import { IoIosPeople } from 'react-icons/io';
import { useRouter } from 'next/router'
const Sidebar = () => {
    return (
        <div className="flex flex-shrink-0 flex-col justify-between w-[220px] h-[calc(100vh-60px)] bg-[#ffffff]">
            <div className="flex flex-col items-center m-[30px]">
                <SidebarItem title="Dashbord" icon={<RiDashboardLine />} path="/" />
                <SidebarItem title="Resources" icon={<GrResources />} path="/resource" />
                <SidebarItem title="Users" icon={<FiUsers />} path="/user" />
                <SidebarItem title="Roles" icon={<IoIosPeople />} path="/role" />
            </div>
            <hr className="my-8 h-px bg-gray-200 border-0"></hr>
            <div className="flex flex-col gap-1 items-center m-[30px]">
                <SidebarItem title="Team Management" icon={<RiAdminFill />} path="/team" />

            </div>

        </div>
    )
}

export default Sidebar;


const SidebarItem = ({ title, icon, path }: any) => {
    const router = useRouter()
    const currentRoute = router.pathname
    console.log(currentRoute === path)
    return (
        <Link href={path} >
            <div className={currentRoute === path ? 
                'font-sans text-gray-600 flex flex-row justify-start items-center gap-4 m-1 p-2 w-[200px] h-[40px] rounded-lg hover:bg-[#EBEBEB] bg-[#EBEBEB]' 
                :'font-sans text-gray-600 flex flex-row justify-start items-center gap-4 m-1 p-2 w-[200px] h-[40px] rounded-lg hover:bg-[#EBEBEB]'}>
                {icon}
                {title}
            </div>
        </Link>
    )
}