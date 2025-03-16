import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { NavRoute } from "./NavRoute";
import { useUser } from "../hook/useUser";

export const Nav = () => {
  const location = useLocation().pathname;
  const [isOpen, setIsOpen] = useState(false);
  const logOut = useUser((state: any) => state.logout);
  const user = useUser((state: any) => state.user);
  const [fill, setFill] = useState(location);
  const [dot, setDot] = useState('');
  const [userdot, setUserDot] = useState('');

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

  return (
    <header className="flex md:w-[250px] md:mr-4 ml-2 mr-1 flex-col items-end md:items-start justify-between">
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
        <button className="bg-white my-3 w-[50px] mr-1.5 md:mr-0 h-[45px] rounded-full cursor-pointer hover:bg-slate-200 md:py-2 md:w-full md:rounded-3xl">
          <p className="hidden md:block">Post</p><i className="md:hidden text-2xl bi bi-feather"></i>
        </button>
      </nav>
      <div
        onClick={() => setIsOpen(true)}
        className="p-1.5  w-[55px]  md:mr-0 h-[60px] rounded-3xl cursor-pointer hover:bg-slate-700 mb-4 flex justify-between md:w-full items-center"
      >
        <div className="flex">
          <img
            src={user.profilePicture}
            alt="profile"
            className="w-[40px] h-[40px] rounded-full object-cover"
          />
          <div className="ml-2">
            <p className="text-white font-bold hidden md:block">{user.displayname.slice(0, 10) + dot}</p>
            <p className=" text-slate-400 text-sm hidden md:block">@{user.username.slice(0, 10) + userdot}</p>
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
        } absolute z-10 cursor-default top-0 left-0 w-screen h-screen bg-transparent`}
      ></div>
    </header>
  );
};
