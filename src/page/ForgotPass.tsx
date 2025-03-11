import { Input } from "../component/Input";
import { useFormik } from "formik";
import { useCheckEmail } from "../hook/useCheckEmail";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import * as yup from "yup";
import YupPassword from "yup-password";
import { toast } from "react-toastify";
YupPassword(yup);

export const ForgotPass = () => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      setLoading(true);

      const check = await useCheckEmail(values.email);

      if (!check.success) {
        toast.error(check.message);
        setLoading(false);
        return;
      }
      toast.info(check.message);

      setLoading(false);
    },
    validationSchema: yup.object({
      email: yup.string().required("Required").email("Invalid email"),
    }),
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col w-full h-[100%]"
    >
      <h1 className="text-white text-3xl font-semibold mt-4">
        Find your Bleet Account
      </h1>
      <p className="text-slate-400 my-2">
        Enter the email address associated with your Bleet account.
      </p>
      <div className="h-[calc(100%-100px)]">
        <Input
          title="Email"
          name="email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.email}
          error={formik.touched.email && formik.errors.email}
          inputType="email"
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
};
