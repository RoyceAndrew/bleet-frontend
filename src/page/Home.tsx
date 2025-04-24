import useGetPosts  from "../hook/useGetPosts";
import { HomePost } from "../component/HomePost";

export const Home = () => {
   const getPosts = useGetPosts((state: any) => state.getPosts);
   const posts = useGetPosts((state: any) => state.posts);
   const loading = useGetPosts((state: any) => state.isLoading);
//    const stream = useGetPosts((state: any) => state.streamPost);
   const comments = useGetPosts((state: any) => state.comments);

    return <section id="home">
        <HomePost posts={posts} loading={loading} getData={getPosts} fill={true} comment={comments}/>
    </section>
}