import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { NavRoute } from "./NavRoute";
import { useUser } from "../hook/useUser";
import { TextareaAutosize, CircularProgress } from "@mui/material";
import { usePost } from "../hook/usePost";
import { BeatLoader } from "react-spinners";
import { useProfilePost } from "../hook/useProfilePost";

export const Nav = () => {
  const location = useLocation().pathname;
  const [isOpen, setIsOpen] = useState(false);
  const logOut = useUser((state: any) => state.logout);
  const user = useUser((state: any) => state.user);
  const [fill, setFill] = useState(location);
  const [dot, setDot] = useState('');
  const [userdot, setUserDot] = useState('');
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const getData = useProfilePost((state: any) => state.getProfilePosts)

  useEffect(() => {
    setFill(location);
  }, [location]);

  useEffect(() => {
    if (user.displayname.length > 9) {
      setDot('...')
    } else {
      setDot('')
    }
    if (user.username.length > 9) {
      setUserDot('...')
    } else {
      setUserDot('')
    }
    
  }, [user]);

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
          to="/explore"
          fill={fill}
          icon="bi-search"
          iconActive="bi-search-heart"
          text="Explore"
        />
        <NavRoute
          to="/profile"
          fill={fill}
          icon="bi-person"
          iconActive="bi-person-fill"
          text="Profile"
        />
        <button onClick={() => setOpen(true)} className="bg-white my-3 w-[50px] mr-1.5 md:mr-0 h-[45px] rounded-full cursor-pointer hover:bg-slate-200 md:py-2 md:w-full md:rounded-3xl">
          <p className="hidden md:block">Post</p><i className="md:hidden text-2xl bi bi-feather"></i>
        </button>
        <div onClick={() => setOpen(false)} className={`${open ? "block" : "hidden"} flex items-start justify-center z-50 fixed top-0 left-0 w-screen h-screen bg-[#FFFFFF50]`}>
          <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-[500px] bg-[#15202B] rounded-xl mt-[3%] flex flex-col">
          <i onClick={() => setOpen(false)} className="text-white  mt-2 ml-2 flex items-center justify-center text-3xl hover:bg-slate-700 rounded-full w-[35px] h-[35px] cursor-pointer bi bi-x"></i>
          <div className="flex">
          <img src={user.profilePicture} alt="profile" className="w-[40px] h-[40px] rounded-full object-cover mt-2 ml-2" />
          <TextareaAutosize onChange={(e) => setText(e.target.value)} value={text} name="text" maxLength={280} minRows={4} placeholder="What's happening?" style={{width: '100%', color: 'white', border: 'none', outline: 'none', padding: '15px', resize: 'none'}}/>
          </div>
          <div className="flex justify-between border-t border-slate-700 py-2 mx-4">
            <div>

            </div>
            <div className="flex">
            <CircularProgress variant="determinate" size={25} value={Math.round(text.length * 100 / 280 )} color={text.length * 100 / 280 === 100 ? "error" : "primary"}/>
            <button disabled={loading} type="submit" className="py-0.5 ml-3 px-3.5  rounded-2xl flex items-center justify-center bg-white text-black transition-colors duration-300 ease-out text-md hover:bg-slate-400 rounded-full[35px] cursor-pointer">{loading ? <BeatLoader color="black" size={8} /> : "Post"}</button>
            </div>
          </div>

          </form>
        </div>
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
        <p onClick={() => logOut()} className="text-white cursor-pointer p-2">
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
