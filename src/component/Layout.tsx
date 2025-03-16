import { Outlet } from "react-router";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export const Layout = () => {
    return (
        
           <div className="flex justify-center min-h-screen min-w-screen bg-[#15202B]">
            <Nav />
            <main className="w-[600px] ring-1 ring-slate-700">
            <Outlet />
            </main>
            <Footer />
            </div>
        
    );
};