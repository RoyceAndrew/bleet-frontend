import { useEffect } from "react";
import { useProfilePost } from "../hook/useProfilePost";
import { useUser } from "../hook/useUser";
import { BeatLoader } from "react-spinners";

export const ProfilePost = () => {
    const getData = useProfilePost((state: any) => state.getProfilePosts)
    const loading = useProfilePost((state: any) => state.isLoading)
    const posts = useProfilePost((state: any) => state.posts)
    const user = useUser((state: any) => state.user)

    useEffect(() => {
      getData()
    }, [user])
    
    if (loading) {
        return <div className="w-full h-full flex justify-center items-center">
     <BeatLoader color="white"/>
        </div>
    }

    return (
        <>
        {posts.map((post: any) => 
        <div className="flex p-3 border-b border-slate-700" key={post.id}>
         <img className="h-[50px] rounded-full" src={post.user.profilePicture} />
         <div className="ml-[10px] text-white flex flex-col">
         <div className="flex">
            <p>{post.user.displayname}</p>
            <p className="text-slate-500 ml-2">@{post.user.username}</p>
            
         </div>
         <p>{post.text}</p>
         <div className="mt-2">
            <div className="flex items-center">
                <i className="bi text-slate-400 mr-1 bi-heart"></i><p className="text-slate-400">{post.like}</p>
                </div>
         
         </div>
         </div>
        </div>
        )}
        </>
    )
};