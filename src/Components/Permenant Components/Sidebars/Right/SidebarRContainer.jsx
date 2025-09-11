import SidebarR2 from "./SidebarR2.jsx";
import SidebarR1 from "./SidebarR1.jsx";

function SidebarRContainer() {

    return (
        <div className='col-span-1 ml-auto sticky top-[122px] h-screen'>
            <SidebarR1 />
            <SidebarR2 />
        </div>
    )
}

export default SidebarRContainer;