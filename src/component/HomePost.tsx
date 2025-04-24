import { useEffect, useRef } from "react";
import { useProfilePost } from "../hook/useProfilePost";
import { useUser } from "../hook/useUser";
import { BeatLoader } from "react-spinners";
import { useState } from "react";
import { formatDistance } from "date-fns";
import useGetPosts from "../hook/useGetPosts";
import { useLike } from "../hook/useLike";
import { useLikeList } from "../hook/useLikeList";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import { PostInput } from "./PostInput";
import { upComment } from "../hook/useComment";
import { useCommentList } from "../hook/useCommentList";

interface Props {
  posts: any;
  getData: any;
  loading: any;
  stream?: any;
  fill: boolean;
  profile?: string;
  comment: any;
}

export const HomePost = (props: Props) => {
  const navigate = useNavigate();
  const user = useUser((state: any) => state.user);
  const page = useLocation();
  const [hover, setHover] = useState<string | null>();
  const fatched = useRef(false);
  const closeStream = useGetPosts((state: any) => state.closeEvent);
  const deletePost = useProfilePost((state: any) => state.deleteProfilePost);
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
      setLoading(true);
      if (props.profile) {
        await props.getData(props.profile);
      } else if (!props.profile) {
        await props.getData();
      }
      const result = await useLike();
      setLikeList(result.message.data);
      // if (props.stream) {
      //   await props.stream();
      // }
      fatched.current = true;
      setLoading(false);
    };

    if (!fatched.current) {
      checkLike();
    }

    // return () => closeStream();
  }, [user, page, fatched]);

  useEffect(() => {
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

  return (
    <>
      {props.posts.map((post: any) => (
        <div
          onClick={() => openDetail(post.id)}
          className={`flex p-3 text-wrap whitespace-normal break-words border-b border-slate-700 hover:bg-slate-800 cursor-pointer`}
          key={post.id}
        >
          <img
            className="h-[50px] w-[50px] object-cover rounded-full"
            src={post.user.profilePicture}
          />
          <div className="ml-[10px] text-wrap whitespace-normal break-words w-full text-white flex flex-col">
            <div className="flex justify-between w-full items-center">
              <div className="flex">
                <p>{post.user.displayname}</p>
                <p className="text-slate-500 ml-2">@{post.user.username}</p>
                <i className="bi bi-dot text-slate-500"></i>
                <p className="text-slate-500">{date(post.created_at)}</p>
              </div>
              <i
                onClick={(e) => openCheck(e, post.id)}
                className="text-slate-500 hover:bg-blue-200 cursor-pointer p-0.5 px-1.5 rounded-full bi bi-three-dots"
              ></i>
              <div
                onClick={(e) => e.stopPropagation()}
                className={`${
                  open === post.id ? "block" : "hidden"
                } z-[100] absolute ml-[310px] mt-[90px] rounded-xl bg-[#15202B] w-[200px] shadow-[0px_0px_6px_4px_#314158]  h-[100px]`}
              >
                {user.id === post.user_id && (
                  <div
                    onClick={() => handleDelete(post.id)}
                    className="flex items-center p-2 hover:bg-slate-700 cursor-pointer"
                  >
                    <i className="bi text-red-500 bi-trash mr-2"></i>
                    <p className="text-red-500">Delete</p>
                  </div>
                )}
              </div>
              <div
                onClick={(e) => openCheck(e, post.id)}
                className={`fixed z-[99] w-screen h-screen top-0 left-0 ${
                  open ? "block" : "hidden"
                }`}
              ></div>
            </div>
            <p className="break-all mt-[-5px] whitespace-normal max-w-[500px]">
              {post.text}
            </p>
            <div className="mt-2 flex">
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
                  className={`bi  transition-colors duration-300 mr-1 ${
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
                  className={`duration-300 ${
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
                onClick={(e) => handleComment(e, post)}
                className="flex text-slate-400 w-min ml-4 hover:text-green-400 duration-300 hover:bg-green-950 py-1 px-2 rounded-2xl cursor-pointer items-center"
              >
                <i className={`mr-1 bi ${commentList.find((data: any) => data.user_id === user.id && data.reply_to === post.id) ? "text-green-400 bi-chat-fill" : "text-slate-400 bi-chat"}`}></i>
                <p className={`${commentList.find((data: any) => data.user_id === user.id && data.reply_to === post.id) ? "text-green-400" : "text-slate-400"}`}>
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
