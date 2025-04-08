import { useParams } from "react-router"
import { useEffect, useRef, useState } from "react";
import { useDetailPost } from "../hook/useDetailPost";
import { BeatLoader } from "react-spinners";
import { HomePost } from "../component/HomePost";
import { useUser } from "../hook/useUser";
import { TextareaAutosize, CircularProgress } from "@mui/material";

export const Post = () => {
    const { postId } = useParams();
    const fetched = useRef(false);
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState<any>(null);
    const user = useUser((state: any) => state.user);
    const [comment, setComment] = useState('');
    const [focus, setFocus] = useState(false);
    
    useEffect(() => {
      const fetchApi = async () => {
        setLoading(true);
        const result = await useDetailPost(postId);
        setPost(result.message);
        console.log(result.message);
        fetched.current = true;
        setLoading(false);
      }
       console.log(user);
      if (!fetched.current) {
        fetchApi();
      }
    }, []);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-full w-full">
          <BeatLoader color="white" />
        </div>
      );
    }
    if (post) {
    return (<>
      <HomePost posts={[post]} loading={loading} getData={() => {}} fill={false}/>
      <form className={`flex border-0 p-3 border-b transition-all duration-300 ease-out border-slate-700 ${focus ? 'flex-col items-end' : 'flex-row items-center'}`}>
       <div className="flex w-full">
       <img src={user.profilePicture} alt="" className="w-[50px] h-[50px] object-cover rounded-full" />
       <TextareaAutosize onClick={() => setFocus(true)} style={{width: '100%', color: 'white', border: 'none', outline: 'none', padding: '15px', resize: 'none'}} name="comment" value={comment} maxLength={280} onChange={(e) => setComment(e.target.value)} placeholder="Post your reply"/>
       </div>
       <div className="flex gap-2 items-center">
       <CircularProgress variant="determinate" size={25} value={Math.round(comment.length * 100 / 280 )} color={comment.length * 100 / 280 === 100 ? "error" : "primary"}/>
       <button type="submit" className="bg-white text-sm rounded-full px-3 py-1 h-min">Reply</button>
       </div>
      </form>
    </>)
    }
}