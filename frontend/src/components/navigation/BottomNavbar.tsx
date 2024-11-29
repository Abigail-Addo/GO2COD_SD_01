import Link from 'next/link';
import * as React from 'react';
import { RiUserAddFill } from 'react-icons/ri';
import Image from 'next/image';
import { MdLightMode, MdDarkMode } from "react-icons/md";

const BottomNavbar = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    // Check the saved preference in localStorage on initial load
    React.useEffect(() => {
        const savedMode = localStorage.getItem('theme');
        if (savedMode === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    // Toggle the theme
    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    return (
        <>
            <div className="lg:hidden sticky bottom-0 bg-white dark:bg-gray-800 w-full grid grid-cols-3 gap-4 px-4 md:px-8 z-40 shadow-inner dark:shadow-gray-700">
                {/* Add Contact */}
                <Link href="/create-contact"
                    className='w-full md:w-2/4 mx-auto flex flex-col items-center justify-center'>
                    <div className="flex justify-center">
                        <RiUserAddFill className="text-2xl dark:text-gray-200" />
                    </div>
                    <div className="text-xs md:text-sm flex justify-center items-center dark:text-gray-200">Add Contact</div>
                </Link>
                {/* Home */}
                <Link href="/"
                    className="w-full md:w-2/4 mx-auto flex flex-col items-center justify-center relative -translate-y-4">
                    <div className="flex justify-center items-center w-16 h-16 rounded-full bg-white dark:bg-gray-700 shadow-top dark:shadow-gray-700">
                        <Image
                            src="/logo/logo.png"
                            alt="Logo"
                            width={45}
                            height={45}
                        />
                    </div>
                    <div className="text-xs md:text-sm flex justify-center items-center mt-1 dark:text-gray-200">Home</div>
                </Link>
                {/* Light/Dark Mode Toggle */}
                <div
                    onClick={toggleDarkMode}
                    className='cursor-pointer w-full md:w-2/4 mx-auto flex flex-col items-center justify-center'>
                    <div className="flex justify-center">
                        {isDarkMode ? (
                            <MdLightMode className="text-2xl dark:text-gray-200" />
                        ) : (
                            <MdDarkMode className="text-2xl dark:text-gray-200" />
                        )}
                    </div>
                    <div className="text-xs md:text-sm flex justify-center items-center dark:text-gray-200">
                        {isDarkMode ? 'Light mode' : 'Dark mode'}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BottomNavbar;
