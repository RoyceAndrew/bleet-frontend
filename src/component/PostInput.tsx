import { TextareaAutosize, CircularProgress } from "@mui/material";
import { useUser } from "../hook/useUser";
import { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { useProfilePost } from "../hook/useProfilePost";
import useGetPosts from "../hook/useGetPosts";
import { useParams, useLocation } from "react-router";
import { ReplyPost } from "./ReplyPost";
import { useCommentList } from "../hook/useCommentList";

interface Props {
    apiCall: any;
    open: any;
    setOpen: React.Dispatch<React.SetStateAction<boolean | string | null>>;
    comment?: boolean;
}
 
export const PostInput = (props: Props) => {
  const user = useUser((state: any) => state.user); 
  const updateCommentList = useCommentList((state: any) => state.updateCommentList);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const getData = useProfilePost((state: any) => state.getProfilePosts);
  const getAllPosts = useGetPosts((state: any) => state.getPosts);
  const username = useParams().profile
  const location = useLocation().pathname;
  const commentList = useCommentList((state: any) => state.commentList);

  useEffect(() => {
    props.setOpen(props.open);
    if (props.open) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "auto";
    } 
    
  }, [props.open]);
 
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      text: text
    }
    if (typeof props.open === "object") {
      updateCommentList([{user_id: user.id, reply_to: props.open.id}, ...commentList]);
      const result = await props.apiCall(props.open.id, text);
      if (!result.success) {
        console.log(result.message);
        setLoading(false);
        return
      }
    } else {
      const result =  await props.apiCall(data);
      if (!result.success) {
        console.log(result.message);
        setLoading(false);
        return
      }
    }
    if (username === user.username) {
        await getData(username);
    }
    if (location === "/home") {
        await getAllPosts();
    }
    props.setOpen(false);
    setText('');
    setLoading(false);
  };

  return (
    <>
      
      <div
        onClick={() => props.setOpen(false)}
        className={`${props.open ? "block" : "hidden"} flex items-start justify-center z-[9999] fixed top-0 left-0 w-screen 100dvh bg-[#FFFFFF50]`}
      >
        
        <form
          onSubmit={submit}
          onClick={(e) => e.stopPropagation()}
          className="md:w-[500px] md:h-fit h-full w-full z-[100] bg-[#15202B] md:rounded-xl md:mt-[3%] flex flex-col"
        >
          <i
            onClick={() => props.setOpen(false)}
            className="text-white  mt-2 ml-2 flex items-center justify-center text-3xl hover:bg-slate-700 rounded-full w-[35px] h-[35px] cursor-pointer bi bi-x"
          />
          {typeof props.open === "object" && (
        <ReplyPost data={props.open}/>
          )}
          <div className="flex">
            <img
              src={user.profilePicture}
              alt="profile"
              className="w-[40px] h-[40px] rounded-full object-cover mt-2 ml-2"
            />
            <TextareaAutosize
              onChange={(e) => setText(e.target.value)}
              value={text}
              name="text"
              maxLength={280}
              minRows={4}
              placeholder={typeof props.open === "object" ? "Post your reply" : "What's happening?"}
              style={{
                width: "100%",
                color: "white",
                border: "none",
                outline: "none",
                paddingLeft: "8px",
                paddingTop: "15px",
                paddingRight: "15px",
                paddingBottom: "15px",
                resize: "none",
              }}
            />
          </div>
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
                disabled={loading}
                type="submit"
                className="py-0.5 ml-3 px-3.5  rounded-2xl flex items-center justify-center bg-white text-black transition-colors duration-300 ease-out text-md hover:bg-slate-400 rounded-full[35px] cursor-pointer"
              >
                {loading ? <BeatLoader color="black" size={8} /> : typeof props.open === "object" ? "Reply" : "Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
