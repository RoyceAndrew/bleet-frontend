import useGetPosts  from "../hook/useGetPosts";
import { HomePost } from "../component/HomePost";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";


export const Home = () => {
   const getPosts = useGetPosts((state: any) => state.getPosts);
   const posts = useGetPosts((state: any) => state.posts);
   const [loading, setLoading] = useState(false);
   const getFollowPosts = useGetPosts((state: any) => state.getFollowPosts);
   const comments = useGetPosts((state: any) => state.comments);
   const { pathname } = useLocation();
   const navigate = useNavigate();

    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
        if (pathname === "/home") {
           await getPosts();
        }
        if (pathname === "/following") {
           await getFollowPosts();
        }
        setLoading(false);
        }
        fetchApi();
    }, [pathname]);

    return <section id="home">
        <div className="sticky border-l border-b backdrop-blur-md z-50 border-slate-700 top-0 w-full flex">
            <p onClick={() => navigate("/home")} className={`w-1/2 select-none text-sm md:text-md lg:text-lg z-[90] text-center py-3 cursor-pointer hover:bg-slate-700 ${pathname === "/home" ? "underline decoration-[4px] decoration-blue-500 text-white underline-offset-[13px] md:underline-offset-[14px] lg:underline-offset-[16px]" : "text-slate-400"}`}>All posts</p>
            <p onClick={() => navigate("/following")} className={`w-1/2 select-none z-[90] text-sm md:text-md lg:text-lg text-center py-3 cursor-pointer hover:bg-slate-700 ${pathname === "/following" ? "underline decoration-[4px] decoration-blue-500 text-white underline-offset-[13px] md:underline-offset-[14px] lg:underline-offset-[16px]" : "text-slate-400"}`}>Following</p>
        </div>
        <HomePost posts={posts} title="Home" loading={loading} pathname={pathname} getData={() => {}} fill={true} comment={comments}/>
    </section>
}