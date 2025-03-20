import useGetPosts  from "../hook/useGetPosts";
import { ProfilePost } from "../component/ProfilePost";

export const Home = () => {
   const getPosts = useGetPosts((state: any) => state.getPosts);
   const posts = useGetPosts((state: any) => state.posts);
   const loading = useGetPosts((state: any) => state.isLoading);
   const stream = useGetPosts((state: any) => state.streamPost);

    return <section id="home">
        <ProfilePost posts={posts} loading={loading} getData={getPosts} stream={stream}/>
    </section>
}