import { useParams } from "react-router"
import { useEffect, useState } from "react";
import { useDetailPost } from "../hook/useDetailPost";
import { BeatLoader } from "react-spinners";
import { HomePost } from "../component/HomePost";
import { useUser } from "../hook/useUser";
import { TextareaAutosize, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router";
import { upComment, getComment } from "../hook/useComment";

export const Post = () => {
    const { postId } = useParams();
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState<any>(null);
    const user = useUser((state: any) => state.user);
    const [comment, setComment] = useState('');
    const [focus, setFocus] = useState(false);
    const [commentList, setCommentList] = useState<any>(null);
    const [loadingComment, setLoadingComment] = useState(false);
    const navigate = useNavigate(); 
    
    useEffect(() => {
      const fetchApi = async () => {
        setLoading(true);
        const result = await useDetailPost(postId);
        setPost(result.message);
        const resultComment = await getComment(postId);
        setCommentList(resultComment.message);
        setLoading(false);
      }
      fetchApi();
    }, [postId]);

    useEffect(() => {
      if (comment.length > 0) {
        setLoadingComment(false);
      } else {
        setLoadingComment(true);
      }
    }, [comment]);

    const handleSubmit = async (e: any) => {
      e.preventDefault();
      setLoadingComment(true);
      const result = await upComment(postId, comment);
      if (!result.success) {
        setLoadingComment(false);
        return;
      }
      const resultComment = await getComment(postId);
      setCommentList(resultComment.message);
      setComment('');
      setLoadingComment(false);
       
    }

    

    if (loading) {
      return (
        <div className="flex justify-center items-center h-full w-full">
          <BeatLoader color="white" />
        </div>
      );
    }
    if (post) {
    return (<>
      <div className="h-[50px] w-full sticky flex items-center bg-[#15202B99] top-0">
      <i onClick={() => navigate(-1)} className="bi text-white ml-5 mr-5 hover:bg-slate-700 cursor-pointer  px-2 py-1 rounded-full text-lg bi-arrow-left"></i>
        <h2 className="text-white text-md">Post</h2>
      </div>
      <HomePost posts={[post]} loading={loading} getData={() => {}} fill={false}/>
      <form onSubmit={(e) => handleSubmit(e)} className={`flex border-0 p-3 border-b transition-all duration-300 ease-out border-slate-700 ${focus ? 'flex-col items-end' : 'flex-row items-center'}`}>
       <div className="flex w-full">
       <img src={user.profilePicture} alt="" className="w-[50px] h-[50px] object-cover rounded-full" />
       <TextareaAutosize onClick={() => setFocus(true)} style={{width: '100%', color: 'white', border: 'none', outline: 'none', padding: '15px', resize: 'none'}} name="comment" value={comment} maxLength={280} onChange={(e) => setComment(e.target.value)} placeholder="Post your reply"/>
       </div>
       <div className="flex gap-2 items-center">
       <CircularProgress variant="determinate" size={25} value={Math.round(comment.length * 100 / 280 )} color={comment.length * 100 / 280 === 100 ? "error" : "primary"}/>
       <button type="submit" disabled={loadingComment} className={` text-sm rounded-full px-3 py-1 h-min ${loadingComment ? 'cursor-not-allowed bg-slate-500' : 'cursor-pointer bg-white'}`}>Reply</button>
       </div>
      </form>
      <HomePost posts={commentList} loading={loading} getData={getComment} fill={true}/>
    </>)
    }
}