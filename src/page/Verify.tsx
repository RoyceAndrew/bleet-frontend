import { Link, useParams } from "react-router";
import { ResetLayout } from "../component/ResetLayout";
import { useEffect, useRef, useState } from "react";
import { useVerify } from "../hook/useVerify";
import { BeatLoader } from "react-spinners";

export const Verify = () => {
  const token = useParams().token;
  const [check, setCheck] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const call = useRef(false);

  useEffect(() => {
    if (!call.current) {
      call.current = true;
    const verify = async () => {
      const result = await useVerify(token as string);
      setCheck(result.success);
      setIsLoading(false);
    };
    verify();
  }
  }, []);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-[#15202B]">
        <BeatLoader color="white" />
      </div>
    );
  }
  return (
    <ResetLayout>
      <section className="flex justify-center items-center flex-col h-full w-full bg-[#15202B]">
        <i className={`text-white text-9xl bi ${check ? "bi-check" : "bi-x"}`}></i>
        <h1 className="text-white text-5xl text-center">{check ? "Email verified" : "Invalid token"}</h1>
        
      </section>
      <Link
          to="/"
          className={` bg-white w-full flex justify-center font-bold transition-all ease-out duration-300 mb-8  text-black hover:bg-slate-200 py-3 rounded-full mt-5`}
        >
          Back to Home
        </Link>
    </ResetLayout>
  );
};
