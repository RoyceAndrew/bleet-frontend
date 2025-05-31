import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import { BeatLoader } from "react-spinners";
import { ProfileHover } from "../component/ProfileHover";
import useGetPosts from "../hook/useGetPosts";
import axios from "axios";

type Data = {
  following: {
    id: string;
    displayname: string;
    profilePicture: string;
    username: string;
    bio: string;
  };
  user: {
    id: string;
    displayname: string;
    profilePicture: string;
    username: string;
    bio: string;
  };
};

export const Follow = () => {
  const { profile, follow } = useParams();
  const navigate = useNavigate();
  const hoverRef = useRef<NodeJS.Timeout | null>(null);
  const [hoverProfile, setHoverProfile] = useState<string | null>(null);
  const [hoverDisplayName, setHoverDisplayName] = useState<string | null>(null);
  const [hoverUsername, setHoverUsername] = useState<string | null>(null);
  const getPosts = useGetPosts((state: any) => state.getPosts);
  const [data, setData] = useState([]);
  const [profileData, setProfileData] = useState<{
    username: string;
    displayname: string;
  } | null>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      if (follow === "following") {
        document.title = "People followed by @" + profile + " / Bleet";
      } else if (follow === "followers") {
        document.title = "People following @" + profile + " / Bleet";
      }
      try {
        const result = await axios.get(
          import.meta.env.VITE_REACT_APP_BACKEND_URL +
            `/api/post/follow/${profile}/${follow}`,
          { withCredentials: true }
        );
        setData(result.data.result);
        getPosts();
        setProfileData(result.data.checkId);
        console.log(result.data.result);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchApi();
  }, [follow]);

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <BeatLoader color="white" />
      </div>
    );
  }

  const handleMouseHover = (
    id: string | null,
    type: "profile" | "displayName" | "username"
  ) => {
    if (hoverRef.current) {
      clearTimeout(hoverRef.current);
    }
    console.log(id);
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
      hoverRef.current = setTimeout(() => {
        setHoverProfile(null);
        setHoverDisplayName(null);
        setHoverUsername(null);
      }, 300);
    }
  };

  return (
    <>
      <nav className="flex flex-col w-full border-l backdrop-blur-md z-[100] border-b border-slate-700 sticky top-0">
        <div className="flex w-full px-2 py-2 gap-4">
          <i
            className="bi bi-arrow-left-short flex justify-center items-center md:h-[40px] md:w-[40px] h-[35px] w-[35px] rounded-full hover:bg-slate-700 text-white text-2xl md:text-3xl cursor-pointer"
            onClick={() => navigate("/" + profileData?.username)}
          ></i>
          <div>
            <h1 className="text-white text-sm md:text-lg">{profileData?.displayname}</h1>
            <h2 className="text-slate-400 text-sm md:text-lg">@{profileData?.username}</h2>
          </div>
        </div>
        <div className="w-full">
          <button
            onClick={() => {
              navigate("/" + profileData?.username + "/f/following");
            }}
            className={`w-1/2 cursor-pointer text-sm md:text-md lg:text-lg hover:bg-slate-700 py-[5px] ${
              follow === "following"
                ? "underline underline-offset-8 decoration-blue-500 text-white decoration-[4px]"
                : "text-slate-400 no-underline"
            }`}
          >
            Following
          </button>
          <button
            onClick={() => {
              navigate("/" + profileData?.username + "/f/followers");
            }}
            className={`w-1/2 cursor-pointer text-sm md:text-md lg:text-lg hover:bg-slate-700 py-[5px] ${
              follow === "followers"
                ? "underline underline-offset-8 decoration-blue-500 text-white decoration-[4px]"
                : "text-slate-400 no-underline"
            }`}
          >
            Followers
          </button>
        </div>
      </nav>
      <div>
        {data.map((d: Data) => {
          const user = d.following || d.user;

          return (
            <div
             onClick={() => navigate(`/${user.username}`)}
              key={user.id}
              className="flex gap-3 w-full px-2 py-2 hover:bg-slate-700 cursor-pointer"
            >
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/${user.username}`);
                }}
                onMouseOver={() => handleMouseHover(user.id, "profile")}
                onMouseLeave={() => handleMouseHover(null, "profile")}
                className="md:w-[40px] md:h-[40px] w-[35px] h-[35px] rounded-full object-cover"
                src={user.profilePicture}
              />
              <ProfileHover
                className="mt-[45px] ml-[-75px]"
                animation={hoverProfile === user.id}
                displayName={true}
                user={user}
                handleMouseHover={handleMouseHover}
                post={d}
              />
              <div>
                <h1 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/${user.username}`);
                }}
                onMouseOver={() => handleMouseHover(user.id, "displayName")}
                onMouseLeave={() => handleMouseHover(null, "displayName")}
                className="text-white text-sm md:text-md lg:text-lg hover:underline">
                  {user.displayname}
                </h1>
                <ProfileHover
                className="mt-[0px] ml-[-80px]"
                animation={hoverDisplayName === user.id}
                displayName={true}
                user={user}
                handleMouseHover={handleMouseHover}
                post={d}
              />
                <h2 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/${user.username}`);
                }}
                onMouseOver={() => handleMouseHover(user.id, "username")}
                onMouseLeave={() => handleMouseHover(null, "username")}
                className="text-slate-400 text-sm md:text-md lg:text-lg">@{user.username}</h2>
                <ProfileHover
                className="ml-[-80px]"
                animation={hoverUsername === user.id}
                displayName={true}
                user={user}
                handleMouseHover={handleMouseHover}
                post={d}
              />
                <p className="text-white">{user.bio}</p>
              </div>
            </div>
          );
        })}
      </div>
      
    </>
  );
};
