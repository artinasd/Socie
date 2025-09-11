import Header from "./Header.jsx";
import SidebarLContainer from "./Sidebars/Left/SidebarLContainer.jsx";
import {Outlet} from "react-router-dom";

function RootLayout() {

    return (
        <>
            <Header />

            <div className='grid grid-cols-4 bg-[#fcfcfc] min-h-screen'>
                <SidebarLContainer />

                <Outlet />
            </div>
        </>
    )
}

export default RootLayout;