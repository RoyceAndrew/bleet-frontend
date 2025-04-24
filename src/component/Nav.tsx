import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { NavRoute } from "./NavRoute";
import { useUser } from "../hook/useUser";
import { TextareaAutosize, CircularProgress } from "@mui/material";
import { usePost } from "../hook/usePost";
import { BeatLoader } from "react-spinners";
import { useProfilePost } from "../hook/useProfilePost";
import useGetPosts from "../hook/useGetPosts";
import { PostInput } from "./PostInput";

export const Nav = () => {
  const location = useLocation().pathname;
  const [isOpen, setIsOpen] = useState(false);
  const {profile} = useParams() 
  const logOut = useUser((state: any) => state.logout);
  const user = useUser((state: any) => state.user);
  const [checkProfile, setCheckProfile] = useState(false);
  const [fill, setFill] = useState(location);
  const [dot, setDot] = useState('');
  const [userdot, setUserDot] = useState('');
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const getData = useProfilePost((state: any) => state.getProfilePosts)
  const logOutProfilePost = useProfilePost((state: any) => state.logout);
  const logOutGetPosts = useGetPosts((state: any) => state.logout);
  const getAllPosts = useGetPosts((state: any) => state.getPosts);

  useEffect(() => {
    setFill(location);
    if (profile === user.username) {
      setCheckProfile(true);
    } else {
      setCheckProfile(false);
    }
  }, [location]);

  useEffect(() => {
    if (user.displayname.length > 10) {
      setDot('...')
    } else {
      setDot('')
    }
    if (user.username.length > 10) {
      setUserDot('...')
    } else {
      setUserDot('')
    }
    
  }, [user]);

  const logout = () => {
    logOut();
    logOutProfilePost();
    logOutGetPosts();
  };  

  const submit = async (e: any) => {
     e.preventDefault();  
     setLoading(true);
    const data = {
       text: text
     }
     const result = await usePost(data);
     if (!result.success) {
      console.log(result.message);
       setLoading(false);
       return
     }
     getData()
     getAllPosts()
     setOpen(false);
     setText('');
     setLoading(false);
  }

  return (
    <header className="flex md:w-[250px] h-screen sticky z-50 top-0 bottom-0 md:mr-4 ml-2 mr-1 flex-col items-end md:items-start justify-between">
      <nav className="w-full flex flex-col items-end md:items-start">
        <img src="/pct/bleetlogo.png" alt="bleet-logo" className="h-[40px] mr-1 md:mr-0" />
        <NavRoute
          to="/home"
          fill={fill}
          icon="bi-house-door"
          iconActive="bi-house-door-fill"
          text="Home"
        />
        <NavRoute
          to={"/" + user.username} 
          fill={fill}
          profile={checkProfile}
          icon="bi-person"
          iconActive="bi-person-fill"
          text="Profile"
        />
        <button onClick={() => setOpen(true)} className="bg-white my-3 w-[50px] mr-1.5 md:mr-0 h-[45px] rounded-full cursor-pointer hover:bg-slate-200 md:py-2 md:w-full md:rounded-3xl">
          <p className="hidden md:block">Post</p><i className="md:hidden text-2xl bi bi-feather"></i>
        </button>
        <PostInput apiCall={usePost} open={open} setOpen={setOpen}/>
      </nav>
      <div
        onClick={() => setIsOpen(true)}
        className="p-1.5  w-[55px]  md:mr-0 h-[60px] rounded-full cursor-pointer hover:bg-slate-700 mb-4 flex justify-between md:w-full items-center"
      >
        <div className="flex">
          <img
            src={user.profilePicture}
            alt="profile"
            className="w-[40px] h-[40px] rounded-full object-cover"
          />
          <div className="ml-2">
            <p className="text-white font-bold hidden md:block">{user.displayname.slice(0, 10) + dot}</p>
            <p className=" text-slate-400 00 text-sm hidden md:block">@{user.username.slice(0, 10) + userdot}</p>
          </div>
        </div>

        <i className="bi bi-three-dots hidden md:block text-white text-xl mr-0.5"></i>
      </div>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } rounded-md absolute shadow-[0px_0px_6px_4px_#314158] ring-1 ring-slate-700 hover:bg-slate-700  drop-shadow-xs z-30 w-[240px] md:w-[270px] mr-[-190px] md:ml-[-10px] bg-[#15202B] bottom-[80px]`}
      >
        <p onClick={logout} className="text-white cursor-pointer p-2">
          {"Log out " + "@" + user.username}
        </p>
      </div>
      <div
        onClick={() => setIsOpen(false)}
        className={`${
          isOpen ? "block" : "hidden"
        } fixed z-10 cursor-default top-0 left-0 w-screen h-screen bg-transparent`}
      ></div>
    </header>
  );
};
