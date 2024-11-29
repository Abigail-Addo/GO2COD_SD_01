'use client'


import React, { ReactNode } from 'react'
import Header from '@/components/navigation/Header';
import Sidebar from '@/components/navigation/Sidebar';
import BottomNavbar from '@/components/navigation/BottomNavbar';

interface DefaultLayoutProps {
    children: ReactNode;
    headerChildren: ReactNode;
}


const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children, headerChildren }) => {
    const [sidebarToggle] = React.useState(false);

    return (
        <>
            <main className="w-screen h-screen flex gap-0 overflow-hidden dark:bg-gray-800">
                <Sidebar sidebarToggle={sidebarToggle} />
                <div className={`w-full ${sidebarToggle ? 'px-16' : 'px-4 lg:px-10'} mx-auto py-5 transition-all duration-100 grow overflow-x-hidden overflow-y-auto`}>
                    {/* Header */}
                    <Header>{headerChildren}</Header>

                    {/* Page Content */}
                    {children}
                </div>
            </main>
            <BottomNavbar />
        </>
    )
}

export default DefaultLayout
