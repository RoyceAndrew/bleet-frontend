import { Register } from "../component/Register";
import { Login } from "../component/Login";
import { useEffect, useState } from "react";
import { ToastContainer, Bounce } from "react-toastify";

export const Flow = () => {
  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);
  const [direct, setDirect] = useState("");

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

  return (
    <>
      <section
        id="flow"
        className="flex justify-center w-full h-[100vh]  bg-[#15202B]"
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
            <p className="text-white font-semibold sm:mt-10">
              Already have an account?
            </p>
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
