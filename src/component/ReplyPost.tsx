

export const ReplyPost = (props: {data: any}) => {
    return (
        <div>
        <div className="flex">
         <img className="w-[40px] h-[40px] rounded-full object-cover ml-2" src={props.data.user.profilePicture} />
         <p className="ml-2 text-white">{props.data.user.displayname}</p>
         <p className="ml-2 text-slate-400">{"@" + props.data.user.username}</p>
        </div>
        <div className="text-white ml-[27px] break-words pr-[15px] pl-[27px] pb-3 mt-[-15px] border-l-2 border-slate-700">
        <p >{props.data.text}</p>
        <p className="text-slate-400 mt-2 ">Replying to <span className="text-blue-500">{"@" + props.data.user.username}</span></p>
        </div>
        </div>
    );
};  