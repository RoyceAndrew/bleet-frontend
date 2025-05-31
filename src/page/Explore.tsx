import { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router";
import debounce from "lodash.debounce";
import axios from "axios";


export const Explore = () => {
     const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        const eventSource = new EventSource(
            import.meta.env.VITE_REACT_APP_BACKEND_URL + "/api/post/stream",
            { withCredentials: true }
        );

        eventSource.onmessage = (event) => {
            try {
                if (loading) {
                    setLoading(false);
                }
                const data = JSON.parse(event.data);
                setData(data);
            } catch (error: unknown | Error ) {
                
                    console.log(error);
                
            }
        };

        return () =>
            eventSource.close();
    }, []);

    const fetchSearch = debounce(async (text: string) => {
        if (text.trim() === "") {
            return setResults([]);
        }
        const res = await axios.get(import.meta.env.VITE_REACT_APP_BACKEND_URL + "/api/user/find/" + text, { withCredentials: true });
        setResults(res.data.result);
    }, 300);

    const handleClick = (username: string) => {
        navigate(`/${username}`);
        setSearch("");
        setResults([]);
    };

    useEffect(() => {
        fetchSearch(search);
        return fetchSearch.cancel;
    }, [search]);

    return (
        <footer className="flex flex-col w-full  px-2 pt-4 bg-[#15202B] text-white">
            <div className="relative w-full max-w-[585px]">
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users" className="w-full  focus:outline-none ring-1 ring-slate-700 rounded-lg p-2 mb-2" />
            <div className={`${results.length > 0 ? "block" : "hidden"} absolute top-full left-0 ring-1 w-full bg-[#15202B] z-20 shadow-[0_0_10px] shadow-white ring-slate-700 rounded-lg`}>
            {results.map((user: any) => (
                <div key={user.id} onClick={() => handleClick(user.username)} className="p-2 z-10 flex items-center gap-2 cursor-pointer  hover:bg-slate-700">
                    <img src={user.profilePicture} className="w-[40px] h-[40px] rounded-full object-cover" />
                    <div>
                    <h4 className="text-lg break-words font-semibold">{user.displayname}</h4>
                    <p className="text-sm break-words text-slate-400">{"@" + user.username}</p>
                    </div>
                </div>
            ))}
            </div>
            </div>
            <div className="ring-1 ring-slate-700 mt-2 rounded-lg">
                <h2 className="text-2xl m-2 font-bold">Recent Posts</h2>
                {loading ? <div className="flex justify-center w-full"><BeatLoader color="white" /></div> : data.map((post: any) => (
                    <div key={post.id} onClick={() => navigate(`/post/${post.id}`)} className="p-2 cursor-pointer hover:bg-slate-700">
                        <h4 className="text-lg break-words font-semibold">{post.text.slice(0, 30)}</h4>
                        <p className="text-sm break-words text-slate-400">{"@" + post.user.username}</p>
                    </div>
                ))}
            </div>
            <p className="mt-2 text-sm text-slate-400">Made with ❤️ by Royce Andrew Wijaya</p>
        </footer>
    );
};