import { useState } from "react";
import { Input } from "./Input";
import { useFormik } from "formik";
import * as yup from "yup";
import { BeatLoader } from "react-spinners";
import { useLogin } from "../hook/useLogin";
import { toast } from "react-toastify";
import { useUser } from "../hook/useUser";
import { Link } from "react-router";

interface loginType {
  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setDirect: React.Dispatch<React.SetStateAction<string>>
}

export const Login = (props: loginType) => {
  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const checkUser = useUser((state: any) => state.checkUser);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      setLoading(true);
      setEmailErr("");
      setPassErr("");
      const check = await useLogin(values);
       if (!check.success) {
        if (check.message === "Email does not exist") {
          setEmailErr(check.message);
        } else if (check.message === "Incorrect password") {
          setPassErr(check.message);
        } else if (check.message === "Please verify your email") {
            toast.error(check.message)
         }
      }
      await checkUser();
      setLoading(false);
    },
    validationSchema: yup.object({
      email: yup.string().required("Required").email("Invalid email"),
      password: yup.string().required("Required"),
    }),
  });

  function handleClick() {
    props.setLogin(false);
    formik.resetForm();
  }

  return (
    <>
      <div
        className={` ${
          props.login ? "fixed" : "hidden"
        } fixed w-screen h-screen top-0 left-0 bg-[#FFFFFF20] flex justify-center items-center`}
      >
        <div
          className={` bg-[#15202B] pt-2 sm:pt-4 px-4 sm:px-10  rounded-lg sm:w-[450px]  flex items-center flex-col w-full h-full sm:h-auto`}
        >
          <i
            onClick={handleClick}
            className="sm:static  absolute sm:mb-[-40px] sm:ml-[-400px] top-3 left-3 flex items-center justify-center text-white text-3xl hover:bg-slate-700 rounded-full w-[35px] h-[35px] cursor-pointer bi bi-x"
          ></i>
          <img className="h-[50px]" src="/pct/bleetlogo.png" />

          <form
            onSubmit={formik.handleSubmit}
            className="flex  justify-center h-full flex-col sm:items-start sm:w-full"
          >
            <div className="w-[300px] sm:w-full">
              <h2 className="text-white text-3xl font-bold">
                Sign in to Bleet
              </h2>
              <Input
                inputType="email"
                name="email"
                title="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && formik.errors.email || emailErr}
              />
              <Input
                inputType="password"
                name="password"
                maxLength={50}
                title="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password || passErr}
              />
              <button
                disabled={loading}
                className={`${loading ? "bg-slate-400 cursor-not-allowed " : "bg-slate-50 cursor-pointer"} text-black  hover:bg-slate-400 transition-all duration-300 ease-out  w-full rounded-3xl h-[40px]  text-md font-bold mt-8`}
                type="submit"
              >
                {loading ? <BeatLoader size={8}/> : "Sign in"}
              </button>
            </div>
            <Link to="/password_reset" className="text-white bg-transparent flex items-center justify-center ring-1 ring-slate-500 cursor-pointer   hover:bg-slate-800 transition-all duration-300 ease-out  w-full rounded-3xl h-[40px]  text-md font-bold mt-8">Forgot password?</Link>
            <p className="text-slate-500 mt-10 sm:mt-6 mb-8">Don't have an account? <span onClick={() => props.setDirect("register")} className="text-blue-400 hover:underline cursor-pointer">Sign up</span></p>
          </form>
          
        </div>
      </div>
    </>
  );
};
