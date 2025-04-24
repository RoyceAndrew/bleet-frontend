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

function App() {
  const user = useUser((state: any) => state.user);
  const isLoading = useUser((state: any) => state.isLoading);
  const checkUser = useUser((state: any) => state.checkUser);

  useEffect(() => {
    checkUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-[#15202B]">
        <BeatLoader color="white" />
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
            <Route path="/explore" element={<Flow />} />
            <Route path="/:profile" element={<Profile key={3} />} />
            <Route path="/:profile/:page" element={<Profile key={3} />} />
            <Route path="/post/:postId" element={<Post/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
