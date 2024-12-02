import Link from 'next/link';
import Image from 'next/image';
import React from 'react'
import { RiMenuFill, RiMenuUnfold2Line, RiUserAddFill, RiUserFill } from 'react-icons/ri';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';


type SidebarProps = {
    sidebarToggle: boolean;
};

const Sidebar: React.FC<SidebarProps> = () => {
    const [toggle, setToggle] = React.useState(true);
    const pathname = usePathname();


    return (
        <>
            <aside className={`relative duration-300 lg:block bg-white ${toggle ? 'w-96' : 'w-20'} shadow-2xl dark:shadow-gray-700 ${toggle ? 'overflow-y-scroll' : 'overflow-x-visible'}  hidden lg:block scroll-smooth transition-all duration-100 dark:bg-gray-800 dark:text-gray-200`}>
                <div className={`flex justify-between absolute inset-x-0 top-0 pt-8 ${toggle ? 'w-72' : 'w-44'}`}>
                    <div className="flex items-center">
                        <div className="ps-6">
                            <Image
                                src="/logo/logo.png"
                                alt="Logo"
                                width={30}
                                height={30}
                            />
                        </div>
                        {toggle && (
                            <h3 className="my-auto ms-2 text-xl">Connect<span className="text-blue-900">LY</span></h3>
                        )}
                    </div>
                    {/* Menu Toggle */}
                    <div className={`flex items-center  ${toggle ? 'pe-6 justify-end' : 'ps-2'} grow`}>
                        {toggle ? (
                            <div className="bg-white p-2 dark:bg-gray-800 dark:text-gray-200">
                                <RiMenuUnfold2Line className="text-2xl cursor-pointer" onClick={() => setToggle((prev) => !prev)} />
                            </div>
                        ) : (
                            <div className="bg-white p-2 rounded-r-full shadow-2xl dark:shadow-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                <RiMenuFill className="text-2xl cursor-pointer" onClick={() => setToggle((prev) => !prev)} />
                            </div>
                        )}
                    </div>
                </div>
                <div className="pt-10 absolute inset-x-0 top-16 overflow-y-scroll">
                    {/* add  */}
                    <div className="ps-6 py-4 hover:text-blue-400">
                        <Link href="/create-contact" className={clsx("flex items-center ", {
                            'text-blue-600 ': pathname === '/create-contact',
                        },)}>
                            <RiUserAddFill className="text-2xl" />
                            {toggle && (
                                <div className="ps-2 text-center text-xl">Add Contact</div>
                            )}
                        </Link>
                    </div>
                    {/* view all */}
                    <div className="ps-6 py-4 hover:text-blue-400">
                        <Link href="/" className={clsx("flex items-center", {
                            'text-blue-600': pathname === '/',
                        },)} >
                            <RiUserFill className="text-2xl" />
                            {toggle && (
                                <div className="ps-2 text-center text-xl">All Contacts</div>
                            )}
                        </Link>
                    </div>
                </div>

            </aside >
        </>
    )
}

export default Sidebar
