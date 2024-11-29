import React, { ReactNode } from "react";
import Toggle from "../toggle/Toggle";

interface HeaderProps {
    children: ReactNode
}


const Header: React.FC<HeaderProps> = ({ children }) => {


    return (
        <>
            <header className="mx-auto hidden lg:flex items-center justify-between shadow-2xl rounded-lg h-16 px-5 sticky top-0 bg-white z-50 dark:bg-gray-800 dark:shadow-gray-700">
                {children}

                <div>
                    <Toggle />
                </div>
            </header>
        </>
    )
}

export default Header
