import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { BeatLoader } from "react-spinners";
import * as yup from "yup";
import YupPassword from "yup-password";
import { Input } from "../component/Input";
import { useChangePass } from "../hook/useChangePass";
import { toast } from "react-toastify";
import { Link } from "react-router";
import axios from "axios";
YupPassword(yup);

export const ChangePass = () => {
  const token = useParams().token;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const formik = useFormik({
    initialValues: {
      password: "",
      conPassword: "",
    },
    onSubmit: async (values) => {
      setError("");
      const { password, ...rest } = values;
      rest;
      console.log(password);
      setLoading(true);
      const result = await useChangePass(token, password);
      if (!result.success) {
        setError(result.message);
        setLoading(false);
        return;
      }
      toast.info(result.message);
      setSuccess(true);
      setLoading(false);
    },
    validationSchema: yup.object({
      password: yup
        .string()
        .required("Required")
        .min(6, "Too short")
        .password(),
      conPassword: yup
        .string()
        .required("Required")
        .oneOf([yup.ref("password"), ""], "Passwords must match"),
    }),
  });

  useEffect(() => {
    const checkReset = async () => {
      try {
        await axios.get("http://localhost:3000/api/user/check_reset/" + token, {
          withCredentials: true,
        });
        setPageLoading(false);
      } catch (error) {
        setDone(true);
        setPageLoading(false);
      }
    };
    checkReset();
  }, []);

  if (pageLoading) {
    return (
      <div className="flex flex-col w-full h-[100%]">
        <div className="h-[calc(100%-100px)] flex flex-col items-center justify-center">
          <BeatLoader color="white" />
        </div>
      </div>
    );
  }

  if (success || done) {
    return (
      <div className="flex flex-col w-full h-[100%]">
        <div className="h-[calc(100%-100px)] flex flex-col text-center items-center justify-center">
          {done ? (
            <i className="text-8xl text-slate-300 bi bi-exclamation-triangle-fill"></i>
          ) : (
            <i className="text-slate-300 text-8xl bi bi-check-lg"></i>
          )}
          <h1 className="text-slate-300 text-3xl  font-semibold mt-4">
            {done
              ? "Password reset link expired or already used"
              : "Password changed successfully"}
          </h1>
          
        </div>
        <Link to="/" className="font-bold text-center transition-all bg-white cursor-pointer ease-out duration-300 mb-8  text-black hover:bg-slate-200 py-3 px-6 rounded-full mt-5">
            Back to home
          </Link>
      </div>
    );
  } else {
    return (
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col w-full h-[100%]"
      >
        <h1 className="text-white text-3xl font-semibold mt-4">
          Change your password
        </h1>
        <div className="h-[calc(100%-100px)]">
          <Input
            title="Password"
            name="password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.password}
            error={(formik.touched.password && formik.errors.password) || error}
            inputType="password"
          />
          <Input
            title="Confirm Password"
            name="conPassword"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.conPassword}
            error={formik.touched.conPassword && formik.errors.conPassword}
            inputType="password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`${
            loading
              ? "bg-slate-200 cursor-not-allowed"
              : "bg-white cursor-pointer"
          }  font-bold transition-all ease-out duration-300 mb-8  text-black hover:bg-slate-200 py-3 rounded-full mt-5`}
        >
          {loading ? <BeatLoader color="black" size={8} /> : "Next"}{" "}
        </button>
      </form>
    );
  }
};
