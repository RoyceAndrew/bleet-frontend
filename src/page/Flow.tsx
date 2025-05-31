import { Register } from "../component/Register";
import { Login } from "../component/Login";
import { useEffect, useState } from "react";
import { ToastContainer, Bounce } from "react-toastify";
import { supabase } from "../service/supabaseClient";
import axios from "axios";
import { BeatLoader } from "react-spinners";

export const Flow = () => {
  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);
  const [direct, setDirect] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const handleBackendLogin = async (user: any) => {
  setLoading(true);
  try {
    await axios.post(
      import.meta.env.VITE_REACT_APP_BACKEND_URL + "/api/user/loginGoogle",
      { user },
      { withCredentials: true }
    );
    localStorage.removeItem("sb-evardcsgulwzvbjwcokb-auth-token");
    window.location.reload(); 
  } catch (err) {
    console.error("Failed login", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      handleBackendLogin(session.user);
    }
  };

  checkSession();

  const { data: listener } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        handleBackendLogin(session.user);
      }
    }
  );

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);

  useEffect(() => {
    if (direct === "login") {
      setRegister(false);
      setLogin(true);
    }
    if (direct === "register") {
      setLogin(false);
      setRegister(true);
    }
    setDirect("");
  }, [direct]);

  if (loading && localStorage.getItem("sb-evardcsgulwzvbjwcokb-auth-token")) {
    return <div className="flex justify-center bg-[#15202B] items-center w-[100vw] h-[h-[100dvh]]"><BeatLoader color="white" /></div>;
  }

  return (
    <>
      <section
        id="flow"
        className="flex justify-center w-full h-[h-[100dvh]]  bg-[#15202B]"
      >
        <ToastContainer
          position="top-center"
          autoClose={false}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
        <div className="flex flex-col sm:gap-16 sm:flex-row sm:justify-center sm:items-center items-start sm:w-auto w-[300px] ">
          <img
            className="h-[70px] sm:h-auto"
            src="/pct/bleetlogo.png"
            alt="bleet-logo"
          />
          <div className="flex flex-col items-start">
            <h1 className="text-white text-5xl font-bold sm:mb-10">
              Happening Now
            </h1>
            <p className="text-white text-3xl font-bold sm:mb-6">
              Join the conversation.
            </p>
            <button
              onClick={() => setRegister(true)}
              className="text-white bg-blue-600 hover:bg-blue-700 w-[250px] rounded-3xl h-[35px] cursor-pointer  text-md font-bold"
            >
              Create account
            </button>

            <Register
              setDirect={setDirect}
              register={register}
              setRegister={setRegister}
            />
            <p className="text-white font-semibold sm:mt-6 sm:mb-3">
              Already have an account?
            </p>
            <button className="flex w-[250px] text-black bg-white  items-center h-[35px] rounded-3xl cursor-pointer mb-4 hover:bg-slate-300 justify-center gap-2" onClick={handleLogin}><img width="26" height="26" src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo"/>Sign in with Google</button>
            <button
              onClick={() => setLogin(true)}
              className={` text-blue-400 ring-1 hover:bg-[#86ebff05] ring-slate-500 w-[250px] rounded-3xl h-[35px] cursor-pointer  text-md font-bold `}
            >
              Sign in
            </button>
            <Login setDirect={setDirect} login={login} setLogin={setLogin} />
          </div>
        </div>
      </section>
    </>
  );
};
