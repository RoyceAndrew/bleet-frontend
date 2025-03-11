import { Link, Outlet } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";

export const ResetLayout = () => {
  return (
    <section
      id="forgotpass"
      className="flex justify-center w-screen h-[100vh]  bg-[#15202B]"
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
      <div className="fixed w-screen h-screen top-0 left-0 bg-[#FFFFFF20] flex justify-center items-center">
        <div className="bg-[#15202B] pt-2 sm:pt-4 px-4  sm:px-16 sm:h-[80%] rounded-lg sm:w-[90%] sm:max-w-[800px]  flex items-center flex-col w-full h-full">
          <Link
            className="sm:static  absolute sm:mb-[-40px] sm:ml-[-110%] top-3 left-3"
            to="/"
          >
            <i className=" flex items-center justify-center text-white text-3xl hover:bg-slate-700 rounded-full w-[35px] h-[35px] cursor-pointer bi bi-x"></i>
          </Link>
          <img className="h-[50px]" src="/pct/bleetlogo.png" />
          <Outlet />
        </div>
      </div>
    </section>
  );
};
