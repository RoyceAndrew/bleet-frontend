
import { useNavigate } from "react-router";
import { useUser } from "../hook/useUser";
import { useState, useEffect } from "react";
import { useProfilePost } from "../hook/useProfilePost";
import axios from "axios";

interface Props {
  user: any;
  handleMouseHover: any;
  post: any;
  displayName?: boolean;
  username?: boolean;
  profile?: boolean;
  animation: boolean;
  className?: string
}

export const ProfileHover = ({
  user,
  handleMouseHover,
  post,
 
  animation,
 
  className
}: Props) => {
  const navigate = useNavigate();
  const setFollower = useProfilePost((state: any) => state.setFollower);
  const setFollowing = useProfilePost((state: any) => state.setFollowing);
  const setUnfollowing = useProfilePost((state: any) => state.setUnfollowing);
  const setUnfollow = useProfilePost((state: any) => state.setUnfollow);
  const mainuser = useUser((state: any) => state.user);
  const following = useProfilePost((state: any) => state.following);
  const follower = useProfilePost((state: any) => state.follower);
  const [followLoading, setFollowLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const [hoveredUserStats, setHoveredUserStats] = useState({
    followingCount: 0,
    followerCount: 0,
    isLoading: true
  });

  const handleFollow = async (e: any, following: string) => {
    try {
      
      setFollowLoading(true);
      e.stopPropagation();
      const result = await axios.post(import.meta.env.VITE_REACT_APP_BACKEND_URL + `/api/user/follow`, { following }, { withCredentials: true });
      const data = { following_id: following, user_id: mainuser.id };
      if (result.data.message === "Following successful") {
        setFollower(data);
        setFollowing(data);
        setCheck(true);
        setFollowLoading(false);
        setHoveredUserStats(prev => ({
          ...prev,
          followerCount: prev.followerCount + 1
        }));
      }
      if (result.data.message === "Unfollow successful") {
        setUnfollow(data);
        setUnfollowing(data);
        setCheck(false);
        setFollowLoading(false);
        setHoveredUserStats(prev => ({
          ...prev,
          followerCount: prev.followerCount - 1
        }));
      }
    } catch (err) {
      console.log(err);
      setFollowLoading(false);
    }
  }

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setHoveredUserStats(prev => ({ ...prev, isLoading: true }));
        setFollowLoading(true);
        const [followerResult, followingResult] = await Promise.all([
          axios.get(import.meta.env.VITE_REACT_APP_BACKEND_URL + `/api/post/${user.id}/followers`, { withCredentials: true }),
          axios.get(import.meta.env.VITE_REACT_APP_BACKEND_URL + `/api/post/${user.id}/following`, { withCredentials: true })
        ]);
        const check = await axios.get(import.meta.env.VITE_REACT_APP_BACKEND_URL + `/api/user/follow/${user.id}`, { withCredentials: true });
        if (check.data.result) {
          setCheck(true);
        } else {
          setCheck(false);
        }
        setHoveredUserStats({
          followerCount: followerResult.data?.length || 0,
          followingCount: followingResult.data?.length || 0,
          isLoading: false
        });
        setFollowLoading(false);
      } catch (err) {
        console.log('Error fetching user stats:', err);
        const userFollowerCount = follower.filter((f: any) => f.following_id === user.id)?.length || 0;
        const userFollowingCount = following.filter((f: any) => f.user_id === user.id)?.length || 0;
        
        setHoveredUserStats({
          followerCount: userFollowerCount,
          followingCount: userFollowingCount,
          isLoading: false
        });
        setFollowLoading(false);
      }
    };

    if (user?.id && animation) {
      fetchUserStats();
    }
  }, [user?.id, animation]); 

  return (
    <div
      onMouseOver={() => handleMouseHover(post.id)}
      onMouseLeave={() => handleMouseHover(null)}
      className={`absolute p-3 hidden md:block cursor-default break-words rounded-lg shadow-[0_0_10px] shadow-white transition-all w-[200px]  bg-[#15202B] duration-500 ease-out justify-center z-[120] ${
        animation ? "opacity-100 visible " : "opacity-0 invisible "
      } 
      ${className} `}
    >
      <div className="flex justify-between">
        <img
          onClick={(e) => {e.stopPropagation(); navigate(`/${user.username}`)}}
          src={user.profilePicture}
          className="w-[70px] h-[70px] cursor-pointer rounded-full object-cover"
        />
        {user.id !== mainuser.id && (
          <button 
            disabled={followLoading} 
            onClick={(e) => handleFollow(e, user.id)} 
            className={`text-sm hover:bg-slate-400 rounded-2xl text-black h-[30px] px-3 ${
              followLoading ? "bg-slate-400 cursor-not-allowed" : "cursor-pointer bg-white"
            }`}
          >
            {check ? "Following" : "Follow"}
          </button>
        )}
      </div>
      <h1 
        onClick={(e) => {e.stopPropagation(); navigate(`/${user.username}`)}} 
        className="text-white hover:underline cursor-pointer"
      >
        {user.username}
      </h1>
      <p 
        onClick={(e) => {e.stopPropagation(); navigate(`/${user.username}`)}} 
        className="text-slate-400 cursor-pointer"
      >
        {"@" + user.displayname}
      </p>
      <p className="text-white">{user.bio}</p>
      <div className="flex gap-2">
        <p 
          onClick={(e) => {e.stopPropagation(); navigate(`/${user.username}/f/following`)}} 
          className="text-sm cursor-pointer hover:underline decoration-2 decoration-white border-white text-slate-400"
        >
          <span className="text-white">
            {hoveredUserStats.isLoading ? '...' : hoveredUserStats.followingCount}
          </span> Following
        </p>
        <p 
          onClick={(e) => {e.stopPropagation(); navigate(`/${user.username}/f/followers`)}} 
          className="text-sm cursor-pointer hover:underline decoration-2 decoration-white border-white text-slate-400"
        >
          <span className="text-white">
            {hoveredUserStats.isLoading ? '...' : hoveredUserStats.followerCount}
          </span> Followers
        </p>
      </div>
    </div>
  );
};