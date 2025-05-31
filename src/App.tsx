import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { Flow } from "./page/Flow";
import { Layout } from "./component/Layout";
import { useUser } from "./hook/useUser";
import { useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { ProtectedRoute } from "./component/ProtectedRoute";
import { Home } from "./page/Home";
import { ForgotPass } from "./page/ForgotPass";
import { ResetLayout } from "./component/ResetLayout";
import { ChangePass } from "./page/ChangePass";
import { Profile } from "./page/Profile";
import { Verify } from "./page/Verify";
import { Post } from "./page/Post";
import { Explore } from "./page/Explore";
import { Follow } from "./page/Follow";
import { useState } from "react";

function App() {
  const user = useUser((state: any) => state.user);
  const isLoading = useUser((state: any) => state.isLoading);
  const checkUser = useUser((state: any) => state.checkUser);
  const [explore, setExplore] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setExplore(true);
      } else {
        setExplore(false);
      }
    }
    
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
    window.removeEventListener("resize", handleResize);
  };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center flex-col items-center gap-4 100dvh w-screen bg-[#15202B]">
        <img src="/pct/bleetlogo.png" className="w-[100px] mr-[-20px]" alt="Bleet"/>
        <BeatLoader color="white" size={20} />
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/verify/:token" element={<Verify />} />
          <Route path="/" element={!user ? <Flow /> : <Navigate to="/home" replace />} />
          <Route path="/password_reset" element={!user ? <ResetLayout ><></></ResetLayout> : <Navigate to="/home" replace />} >
          <Route index element={<ForgotPass />} />
          <Route path=":token" element={<ChangePass />} />
          </Route>
          <Route
            element={
              <ProtectedRoute user={user}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Home  key={1}/>} />
            <Route path="/following" element={<Home  key={1}/>} />
            <Route path="/explore" element={explore ? <Explore /> : <Navigate to="/home" replace />}  />
            <Route path="/:profile" element={<Profile key={3} />} />
            <Route path="/:profile/:page" element={<Profile key={3} />} />
            <Route path="/:profile/f/:follow"  element={<Follow key={4} />} />
            <Route path="/post/:postId" element={<Post/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
