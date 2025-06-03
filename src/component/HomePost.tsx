import {  useEffect, useRef } from "react";
import { useProfilePost } from "../hook/useProfilePost";
import { useUser } from "../hook/useUser";
import { BeatLoader } from "react-spinners";
import { useState } from "react";
import { formatDistance} from "date-fns";
import useGetPosts from "../hook/useGetPosts";
import { useLike } from "../hook/useLike";
import { useLikeList } from "../hook/useLikeList";
import { useLocation, useParams } from "react-router";
import { useNavigate } from "react-router";
import { PostInput } from "./PostInput";
import { upComment } from "../hook/useComment";
import { useCommentList } from "../hook/useCommentList";
import { useProfileReply } from "../hook/useProfileReply";
import { ProfileHover } from "./ProfileHover";
import { TextareaAutosize, CircularProgress } from "@mui/material";
import axios from "axios"; 
import { toast, ToastContainer, Bounce } from "react-toastify";

interface Props {
  posts: any;
  getData: any;
  loading?: any;
  stream?: any;
  fill: boolean;
  profile?: string;
  comment?: any;
  delete?: React.Dispatch<any>;
  isReply?: boolean;
  double?: boolean;
  title?: string;
  profileReply?: boolean;
  noHover?: boolean;
  noLoading?: boolean;
  pathname?: string;
}

export const HomePost = (props: Props) => {
  const navigate = useNavigate();
  const [commentHover, setCommentHover] = useState<string | null>(null);
  const deleteReply = useProfileReply((state: any) => state.deleteReplies);
  const user = useUser((state: any) => state.user);
  const page = useLocation();
  const params = useParams().postId;
  const [hover, setHover] = useState<string | null>();
  const [text, setText] = useState("");
  const fatched = useRef(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [hoverProfile, setHoverProfile] = useState<string | null>(null);
  const [hoverDisplayName, setHoverDisplayName] = useState<string | null>(null);
  const [hoverUsername, setHoverUsername] = useState<string | null>(null);
  const deletePost = useProfilePost((state: any) => state.deleteProfilePost);
  const hoverRef = useRef<NodeJS.Timeout | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const deletePosts = useGetPosts((state: any) => state.deletePost);
  const likeList = useLikeList((state: any) => state.likeList);
  const setLikeList = useLikeList((state: any) => state.setLikeList);
  const [loading, setLoading] = useState(false);
  const [loadingLike, setLoadingLike] = useState<string[] | undefined>([]);
  const updateCommentList = useCommentList((state: any) => state.updateCommentList);
  const commentList = useCommentList((state: any) => state.commentList);  
  const setLikeOptimistic = useLikeList(
    (state: any) => state.setLikeOptimistic
  );
  const setDeleteLike = useLikeList((state: any) => state.setDeleteLike);
  const [openComment, setOpenComment] = useState<boolean | string | null>(
    false
  );

  useEffect(() => {
    const checkLike = async () => {
      if (!props.noLoading) {
        setLoading(true);
      }
      document.title = props.title ? props.title + " / Bleet" : "Bleet";
      if (!props.profile) {
        await props.getData();
      }
      const result = await useLike();
      setLikeList(result.message.data);
      fatched.current = true;
      setLoading(false);
    };

    if (!fatched.current) {
      checkLike();
    }
  }, [user, page, fatched]);

  useEffect(() => {
    fatched.current = false;
  }, [props.pathname]);

  useEffect(() => {
    if (report) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [report]);

  useEffect(() => {
    if (props.double) return 
    if (props.comment) {
      updateCommentList(props.comment);
    }
  }, [props.comment]);

  if (props.loading || loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <BeatLoader color="white" />
      </div>
    );
  }

  function handleDelete(id: string) {
    deletePost({ postId: id });
    if (props.delete) {
      props.delete((prev: any) => prev.filter((post: any) => post.id !== id));
    }
    deleteReply( id );
    deletePosts({ postId: id });
    setOpen(null);
  }

  

  function date(date: any) {
    const newDate = new Date(date);
    const check = formatDistance(newDate, new Date(), { includeSeconds: true });
    if (["day", "days", "month", "months"].some((str) => check.includes(str))) {
      return (
        newDate.toString().split(" ")[1] +
        " " +
        newDate.toString().split(" ")[2]
      );
    } else if (["year", "years"].some((str) => check.includes(str))) {
      return (
        newDate.toString().split(" ")[1] +
        " " +
        newDate.toString().split(" ")[2] +
        " " +
        newDate.toString().split(" ")[3]
      );
    } else if (
      check.split(" ")[2] === "hour" ||
      check.split(" ")[2] === "hours"
    ) {
      return check.split(" ")[1] + "h";
    } else if (check === "half a minute" || check === "less than a minute") {
      return check;
    } else if (
      check.split(" ")[1] === "minute" ||
      check.split(" ")[1] === "minutes"
    ) {
      return check.split(" ")[0] + "m";
    } else {
      return check;
    }
  }

  const handleLike = async (e: any, data: any) => {
    e.stopPropagation();
    setLoadingLike((prev) => [...prev!, data.id]);
    const userData = {
      post_id: data.id,
      user_id: user.id,
    };
    if (likeList.find((like: any) => like.post_id === data.id)) {
      setDeleteLike(userData);
    } else {
      setLikeOptimistic(userData);
    }
    const result = await useLike({ postId: data.id });
    setLikeList(result.message.data);

    fatched.current = true;
    setLoadingLike((prev) => prev!.filter((id: any) => id !== data.id));
  };

  const openDetail = (postId: string) => {
    if (params === postId) return;
    navigate(`/post/${postId}`);
  };

  const openCheck = (event: any, postId: any) => {
    event.stopPropagation();
    if (open) return setOpen(null);
    setOpen(postId);
  };

  const handleComment = (event: any, postId: string) => {
    event.stopPropagation();

    setOpenComment(postId);
  };

  const handleMouseHover = (id: string | null, type: "profile" | "displayName" | "username") => {
    if (hoverRef.current) {
      clearTimeout(hoverRef.current);
    }
   if (typeof id === "string" && type === "profile") {
    setHoverProfile(id);
    setHoverDisplayName(null);
    setHoverUsername(null);
   }
   if (typeof id === "string" && type === "displayName") {
    setHoverDisplayName(id);
    setHoverUsername(null);
    setHoverProfile(null);
   }
   if (typeof id === "string" && type === "username") {
    setHoverUsername(id);
    setHoverDisplayName(null);
    setHoverProfile(null);
   }
   if (typeof id !== "string") {
    hoverRef.current =  setTimeout(() => {
      setHoverProfile(null);
      setHoverDisplayName(null);
      setHoverUsername(null);
    }, 300);
   }
}

const submitReport = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
   if (text.length < 5) return alert("Please enter more than 5 characters");
   setReportLoading(true);
   await axios.post(import.meta.env.VITE_REACT_APP_BACKEND_URL + `/api/post/report`, {text, postId: report}, {withCredentials: true}); 
   setReport(null);
   setText("");
   setReportLoading(false);
   toast.success("Report submitted successfully");
  } catch (error) {
    console.log(error)
  }
}

  return (
    <>
    <ToastContainer
        position="top-right"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    {report && <div onClick={(e) =>{e.stopPropagation(); setReport(null); setText("")}} className="fixed flex top-0 left-0 w-screen h-[100dvh] z-[9999] justify-center bg-[#FFFFFF50]">
                <form
          onSubmit={(e) => submitReport(e)}
          onClick={(e) => e.stopPropagation()}
          className="md:w-[500px] md:h-fit h-full w-full z-[100] bg-[#15202B] md:rounded-xl md:mt-[3%] flex flex-col"
        > 
          <div className="flex items-center justify-between p-2">
            <p className="text-white text-md md:text-lg">Gathering info</p>
            <i
              onClick={() => setReport(null)}
              className="text-slate-500 hover:bg-blue-200 cursor-pointer p-0.5 px-1.5 rounded-full bi bi-x-lg"
            ></i>
          </div>
        <TextareaAutosize
        onChange={(e) => setText(e.target.value)}
              value={text}
              name="text"
              maxLength={280}
              minRows={4}
              placeholder={"What's wrong with this post?"}
              style={{
                width: "100%",
                color: "white",
                border: "none",
                outline: "none",
                paddingLeft: "8px",
               
                paddingRight: "15px",
                paddingBottom: "15px",
                resize: "none",
              }}
        />
        <div className="flex justify-between border-t border-slate-700 py-2 mx-4">
                    <div>
                    </div>
                    <div className="flex">
                      <CircularProgress
                        variant="determinate"
                        size={25}
                        value={Math.round(text.length * 100 / 280)}
                        color={
                          text.length * 100 / 280 === 100 ? "error" : "primary"
                        }
                      />
                      <button
                        disabled={reportLoading || text.length < 5}
                        type="submit"
                        className={`py-0.5 ml-3 px-3.5  rounded-2xl flex items-center justify-center  text-black transition-colors duration-300 ease-out text-md hover:bg-slate-400 rounded-full[35px] ${reportLoading || text.length < 5 ? "cursor-not-allowed bg-slate-400" : "cursor-pointer bg-white"}`}
                      >
                        {reportLoading ? <BeatLoader color="black" size={8} /> : "Report"}
                      </button>
                    </div>
                  </div>
        </form>
              </div>}
      {props.posts.map((post: any) => (
        <div
          onClick={() => openDetail(post.id)}
          className={`flex pl-3 pt-3  pr-3 text-wrap whitespace-normal break-words ${open ? " " : "hover:bg-slate-800" } ${props.isReply && post.id !== params ? "pb-[0px] cursor-pointer" : "border-b border-slate-700 pb-3"} ${!props.isReply && !props.noHover && !open  && "hover:bg-slate-800 cursor-pointer"} ${props.noHover && "cursor-pointer"}  `}
          key={props.profileReply ? post.id + post.post.id : post.id}
        >
          <img
            onClick={(e) => {e.stopPropagation(); navigate(`/${post.user.username}`)}}
            onMouseOver={() => handleMouseHover(post.id, "profile")}
            onMouseLeave={() => handleMouseHover(null, "profile")}
            className="h-[40px] w-[40px] md:h-[50px] md:w-[50px] object-cover cursor-pointer z-20 rounded-full"
            src={post.user.profilePicture}
          />
          <ProfileHover className="mt-[60px] ml-[-80px]" animation={hoverProfile === post.id} user={post.user} profile={true} handleMouseHover={handleMouseHover} post={post}/>
          <div className={`${ props.isReply && post.id !== params ? "ml-[-26px] mb-[-12px] pl-[30px] border-l-2 border-slate-400" : "ml-[10px]"}  text-wrap whitespace-normal break-words w-full text-white flex flex-col`}>
            <div className="flex justify-between w-full  items-center">
              <div className="flex w-full max-w-[180px] sm:max-w-full min-w-0 flex-1 overflow-hidden flex-nowrap">
                <p onClick={(e) => {e.stopPropagation(); navigate(`/${post.user.username}`)}} onMouseOver={() => handleMouseHover(post.id, "displayName")} onMouseLeave={() => handleMouseHover(null, "displayName")} className="hover:underline cursor-pointer truncate text-sm md:text-md lg:text-lg decoration-2">{post.user.displayname}</p>
                <ProfileHover className="mt-[28px] ml-[-60px]" animation={hoverDisplayName === post.id} displayName={true} user={post.user} handleMouseHover={handleMouseHover} post={post}/>
                <div className="flex-shrink  min-w-0">
                <p onClick={(e) => {e.stopPropagation(); navigate(`/${post.user.username}`)}} onMouseOver={() => handleMouseHover(post.id, "username")} onMouseLeave={() => handleMouseHover(null, "username")} className="text-slate-500 cursor-pointer   truncate text-sm md:text-md lg:text-lg ml-2">@{post.user.username}</p>
                <ProfileHover className="ml-[-45px] mt-[3px]" animation={hoverUsername === post.id} username={true} user={post.user} handleMouseHover={handleMouseHover} post={post}/>
                </div>
                <i className="bi bi-dot flex-shrink-0 text-slate-500"></i>
                <p className="text-slate-500 text-sm md:text-md lg:text-lg  flex-shrink-0">{date(post.created_at)}</p>
              </div>
              <i
                onClick={(e) => openCheck(e, post.id)}
                className="text-slate-500 hover:bg-blue-200 cursor-pointer p-0.5 px-1.5 rounded-full bi bi-three-dots"
              ></i>
              <div
                onClick={(e) => e.stopPropagation()}
                className={`${
                  open === post.id ? "block" : "hidden"
                } z-[100] absolute max-lg:right-[10px]   lg:ml-[310px] mt-[20px] rounded-xl bg-[#15202B] w-[200px] shadow-[0px_0px_6px_4px_#314158]  h-fit`}
              >
                {user.id === post.user_id ? (
                  <div
                    onClick={() => handleDelete(post.id)}
                    className="flex items-center p-2 hover:bg-slate-700 cursor-pointer"
                  >
                    <i className="bi text-red-500 bi-trash mr-2"></i>
                    <p className="text-red-500">Delete</p>
                  </div>
                ) : (
                  <div
                    onClick={() => {setReport(post.id); setOpen(null)}}
                    className="flex items-center p-2 hover:bg-slate-700 cursor-pointer"
                  >
                    <i className="bi text-red-500 bi-flag mr-2"></i>
                    <p className="text-red-500">Report</p>
                  </div>
                )}
              </div>
              
              <div
                onClick={(e) => openCheck(e, post.id)}
                className={`fixed z-[99] w-screen h-[100dvh] top-0 left-0 ${
                  open ? "block" : "hidden"
                }`}
              ></div>
            </div>
            <p className="break-all mt-[-5px] text-sm md:text-md lg:text-lg whitespace-normal max-w-[500px]">
              {post.text}
            </p>
            <div className="mt-1 flex">
              <button
                onClick={(e) => handleLike(e, post)}
                onMouseOver={() => setHover(post.id)}
                onMouseLeave={() => setHover(null)}
                disabled={
                  loadingLike?.find((id: any) => id === post.id) ? true : false
                }
                className="flex w-min ml-[-5px] hover:text-red-500 duration-300 hover:bg-[#fb2c3640] py-1 px-2 rounded-2xl cursor-pointer items-center"
              >
                <i
                  className={`bi text-sm md:text-md lg:text-lg  transition-colors duration-300 mr-1 ${
                    likeList.find((data: any) => data.post_id === post.id) ||
                    hover === post.id
                      ? " text-red-500 "
                      : " text-slate-400"
                  } ${
                    likeList.find((data: any) => data.post_id === post.id)
                      ? " bi-heart-fill"
                      : " bi-heart"
                  } `}
                ></i>
                <p
                  className={`text-sm md:text-md lg:text-lg duration-300 ${
                    likeList.find((data: any) => data.post_id === post.id) ||
                    hover === post.id
                      ? " text-red-500"
                      : " text-slate-400"
                  }`}
                >
                  {!likeList.find((data: any) => data.post_id === post.id) &&
                  post.Like.find((data: any) => data.user_id === user.id)
                    ? post.Like.length - 1
                    : likeList.find((data: any) => data.post_id === post.id) &&
                      !post.Like.find((data: any) => data.user_id === user.id)
                    ? post.Like.length + 1
                    : post.Like.length}
                </p>
              </button>
              <button
                onMouseOver={() => setCommentHover(post.id)}
                onMouseLeave={() => setCommentHover(null)}
                onClick={(e) => handleComment(e, post)}
                className="flex text-slate-400 w-min ml-4 hover:text-green-500 duration-300 hover:bg-green-950 py-1 px-2 rounded-2xl cursor-pointer items-center"
              >
                <i className={`mr-1 text-sm md:text-md lg:text-lg  bi ${commentList.find((data: any) => data.user_id === user.id && data.reply_to === post.id) ? "bi-chat-fill" : "bi-chat"} ${commentList.find((data: any) => data.user_id === user.id && data.reply_to === post.id) || commentHover === post.id ? "text-green-500 " : "text-slate-400 "}`}></i>
                <p className={`text-sm md:text-md lg:text-lg ${commentList.find((data: any) => data.user_id === user.id && data.reply_to === post.id) || commentHover === post.id ? "text-green-500" : "text-slate-400"}`}>
                  {Array.isArray(commentList)
                    ? commentList.filter(
                        (data: any) => data.reply_to === post.id
                      ).length
                    : 0}
                </p>
              </button>
              </div>
            </div>
          </div>
          
      ))}
      <PostInput
        comment={true}
        apiCall={upComment}
        open={openComment}
        setOpen={setOpenComment}
      />
      
      {props.fill && <div className="h-[50vh]"></div>}
    </>
  );
};
