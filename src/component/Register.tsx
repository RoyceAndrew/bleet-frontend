import { Input } from "./Input";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRegister } from "../hook/useRegister";
import YupPassword from "yup-password";
import { toast } from "react-toastify";
YupPassword(yup);

interface registerType {
  register: boolean;
  setDirect: React.Dispatch<React.SetStateAction<string>>;
  setRegister: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Register = (props: registerType) => {
  const [loading, setLoading] = useState(false);
  const [Emailerror, setEmailErr] = useState("");
  const [Usererror, setUserErr] = useState("");
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      conPassword: "",
    },
    onSubmit: async (values) => {
      const { conPassword, ...rest } = values;
      setEmailErr("");
      setUserErr("");
      setLoading(true);
      const result = await useRegister(rest);
      if (!result.success) {
        if (
          result.message.error.includes("Email already exists") ||
          result.message.error === "Email already exists"
        ) {
          setEmailErr("Email already exists");
        }
        if (
          result.message.error.includes("Username already exists") ||
          result.message.error.includes("Username already exists") ===
            "Username already exists"
        ) {
          setUserErr("Username already exists");
        }
        setLoading(false);
        return;
      }
      props.setDirect("login");
      toast.info(result.message);
      setLoading(false);
    },
    validationSchema: yup.object({
      email: yup.string().email().required("What's your email?"),
      username: yup.string().min(3).required("What's your username?"),
      password: yup
        .string()
        .min(8)
        .required("What's your password?")
        .password(),
      conPassword: yup
        .string()
        .oneOf([yup.ref("password"), ""], "Passwords must match")
        .required(),
    }),
  });

  function handleClose() {
    props.setRegister(false);
    formik.resetForm();
  }

  return (
    <>
      <div
        id="register"
        className={`${
          props.register ? "flex" : "hidden"
        } fixed  justify-center items-center top-0 w-[100vw] h-[100vh] left-0 bg-[#FFFFFF20]`}
      >
        
        <div className="bg-[#15202B] pt-2 sm:pt-4 px-4 sm:px-10  rounded-lg sm:w-[500px]  flex items-center flex-col w-full h-full sm:h-auto">
        <i
          onClick={handleClose}
          className="sm:static  absolute sm:mb-[-40px] sm:ml-[-450px] top-3 left-3 flex items-center justify-center text-white text-3xl hover:bg-slate-700 rounded-full w-[35px] h-[35px] cursor-pointer bi bi-x"
        ></i>
          <img className="h-[50px]" src="/pct/bleetlogo.png" />
          <div className="w-full flex  flex-col">
            <h1 className="text-white mb-1 text-xl sm:text-3xl font-semibold mt-4">
              Create your account
            </h1>
            <form onSubmit={formik.handleSubmit}>
              <div className="min-h-[calc(100vh-180px)] sm:min-h-auto sm:mb-10">
                <Input
                  title="Username"
                  name="username"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  inputType="text"
                  onBlur={formik.handleBlur}
                  error={
                    (formik.touched.username && formik.errors.username) ||
                    Usererror
                  }
                  maxLength={50}
                />
                <Input
                  title="Email"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  error={
                    (formik.touched.email && formik.errors.email) || Emailerror
                  }
                  inputType="email"
                />
                <Input
                  title="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  inputType="password"
                  error={formik.touched.password && formik.errors.password}
                  maxLength={50}
                />
                <Input
                  title="Confirm Password"
                  name="conPassword"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.conPassword}
                  inputType="password"
                  error={
                    formik.touched.conPassword && formik.errors.conPassword
                  }
                  maxLength={50}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading
                    ? "bg-blue-700 cursor-not-allowed"
                    : "bg-blue-600 cursor-pointer"
                }  text-white relative w-full bottom-0 transition-all duration-300 ease-out  hover:bg-blue-700  rounded-3xl h-[40px] sm:mb-6   text-md font-bold`}
              >
                {loading ? <BeatLoader color="white" size={8} /> : "Register"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
