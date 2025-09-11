import SidebarL1 from "./SidebarL1.jsx";
import SidebarL2 from "./SidebarL2.jsx";

function SidebarLContainer() {

    return (
        <div className='col-span-1 mr-auto sticky top-[122px] h-screen'>
            <SidebarL1 />
            <SidebarL2 />
        </div>
    )
}

export default SidebarLContainer;