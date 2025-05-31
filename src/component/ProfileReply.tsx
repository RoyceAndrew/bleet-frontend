import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { HomePost } from "./HomePost";
import { useProfileReply } from "../hook/useProfileReply";

export const ProfileReply = () => {
  const { profile } = useParams();
  const replies = useProfileReply((state: any) => state.replies);
  const [loading, setLoading] = useState(false);
  const setData = useProfileReply((state: any) => state.setReplies);
  const [comment, setComment] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      const result = await axios.get(
        import.meta.env.VITE_REACT_APP_BACKEND_URL +
          "/api/post/reply/" +
          profile,
        { withCredentials: true }
      );
      console.log(result.data.comments);
      setComment(result.data.flatComments);
      setData(result.data.comments);
      setLoading(false);
    };

    fetchApi();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <BeatLoader color="white" />
      </div>
    );
  }

  if (replies.length === 0) {
    return (
      <div className="w-full flex justify-center text-white">No replies</div>
    );
  } else {
    {return replies.map((post: any) => 
         (
            <div key={post.id + Math.random()}>
          <HomePost
            key={post.id + Math.random()}
            profileReply={true}
            noLoading={true}
            isReply={true}
            posts={[post]}
            comment={comment}
            title="Replies"
            
            fill={false}
            getData={() => {}}
          />
          <HomePost
          key={post.id + Math.random()}
             noLoading={true}
            noHover={true}
            posts={[post.post]}
            title="Replies"
            loading={""}
            fill={false}
            getData={() => {}}
          />
          </div>
     ) );
      ;
    }
  }
};
