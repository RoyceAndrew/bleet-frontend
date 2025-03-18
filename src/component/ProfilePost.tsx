import { useEffect } from "react";
import { useProfilePost } from "../hook/useProfilePost";
import { useUser } from "../hook/useUser";
import { BeatLoader } from "react-spinners";
import { useState } from "react";
import { formatDistance } from "date-fns";

export const ProfilePost = () => {
  const getData = useProfilePost((state: any) => state.getProfilePosts);
  const loading = useProfilePost((state: any) => state.isLoading);
  const posts = useProfilePost((state: any) => state.posts);
  const user = useUser((state: any) => state.user);
  const deletePost = useProfilePost((state: any) => state.deleteProfilePost);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    getData();
  }, [user]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <BeatLoader color="white" />
      </div>
    );
  }

  function handleDelete(id: string) {
    deletePost({ postId: id });
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

  return (
    <>
      {posts.map((post: any) => (
        <div
          className="flex p-3 text-wrap whitespace-normal break-words border-b border-slate-700"
          key={post.id}
        >
          <img
            className="h-[50px] rounded-full"
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
                onClick={() => setOpen(post.id)}
                className="text-slate-500 hover:bg-blue-200 cursor-pointer p-0.5 px-1.5 rounded-full bi bi-three-dots"
              ></i>
              <div
                onClick={(e) => e.stopPropagation()}
                className={`${
                  open === post.id ? "block" : "hidden"
                } z-[100] absolute ml-[310px] mt-[90px] rounded-xl bg-[#15202B] w-[200px] shadow-[0px_0px_6px_4px_#314158]  h-[100px]`}
              >
                <div
                  onClick={() => handleDelete(post.id)}
                  className="flex items-center p-2 hover:bg-slate-700 cursor-pointer"
                >
                  <i className="bi text-red-500 bi-trash mr-2"></i>
                  <p className="text-red-500">Delete</p>
                </div>
              </div>
              <div
                onClick={() => setOpen(null)}
                className={`fixed z-50 w-screen h-screen top-0 left-0 ${
                  open ? "block" : "hidden"
                }`}
              ></div>
            </div>
            <p className="break-all mt-[-5px] whitespace-normal max-w-[500px]">
              {post.text}
            </p>
            <div className="mt-2">
              <div className="flex items-center">
                <i className="bi text-slate-400 mr-1 bi-heart"></i>
                <p className="text-slate-400">{post.like}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="h-[50vh]"></div>
    </>
  );
};
