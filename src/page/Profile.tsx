import { useUser } from "../hook/useUser";
import { useEffect, useState } from "react";
import { Input } from "../component/Input";
import { useFormik } from "formik";
import * as yup from "yup";
import { useEditProfile } from "../hook/useEditProfile";
import { BeatLoader } from "react-spinners";
import Cropper from "react-easy-crop";

export const Profile = () => {
  const user = useUser((state: any) => state.user);
  const editUser = useUser((state: any) => state.editUser);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [website, setWebsite] = useState("");
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const formik = useFormik({
    initialValues: {
      displayname: user.displayname || "",
      bio: user.bio || "",
      website: user.website || "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      const result = await useEditProfile(values);
      if (result.success) {
        editUser(values);
        setOpen(!open);
      }
      setLoading(false);
    },
    validationSchema: yup.object({
      website: yup.string(),
      displayname: yup.string().min(3, "Must be at least 3 characters"),
      bio: yup.string(),
    }),
  });
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  useEffect(() => {
    setDate(
      month[parseInt(user.createAt.split("-")[1]) - 1] +
        " " +
        user.createAt.split("-")[0]
    );
  }, []);

  useEffect(() => {
    if (user.website) {
      if (
        user.website.includes("https://") ||
        user.website.includes("http://")
      ) {
        setWebsite(user.website.split("//")[1]);
      }
    }
  }, [user]);

  function handleClose() {
    setOpen(!open);
    formik.resetForm();
  }

  function handleFileChange(e: any) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      setImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <section id="profile" className="w-full">
      <img
        src={user.banner}
        alt="banner"
        className="w-full z-0 relative h-[190px] object-cover"
      />
      <img
        src={user.profilePicture}
        alt="profile"
        className="rounded-full relative w-[130px] ml-[15px] z-20 ring-4 ring-[#15202B] mt-[-65px] h-[130px] object-cover"
      />
      <button
        onClick={() => setOpen(!open)}
        className="text-white relative top-[-50px] cursor-pointer hover:bg-slate-800 right-[-72%] ring-1 ring-slate-700 px-5 py-1 rounded-2xl z-30"
      >
        Edit profile
      </button>
      <div className="p-[15px] mt-[-30px] border-b border-slate-700">
        <h1 className="text-2xl text-white font-semibold">
          {user.displayname}
        </h1>
        <h2 className="text-slate-400 text-sm">{"@" + user.username}</h2>
        {user.bio && (
          <p className="text-sm break-words text-white">{user.bio}</p>
        )}
        <div className="flex gap-3">
          {user.website && (
            <p className="text-slate-400 text-sm">
              <i className="bi  bi-link-45deg"></i>{" "}
              <a
                target="_blank"
                className="hover:underline text-blue-500"
                href={
                  user.website.includes("https://") ||
                  user.website.includes("http://")
                    ? user.website
                    : "https://" + user.website
                }
              >
                {website}
              </a>
            </p>
          )}

          <p className="text-slate-400 text-sm">
            <i className="bi bi-calendar4-week"></i> Joined {date}
          </p>
        </div>
      </div>
      <div
        onClick={() => setOpen(!open)}
        className={`fixed z-50 top-0 left-0 flex justify-center items-center w-screen h-screen bg-[#FFFFFF20] ${
          open ? "block" : "hidden"
        }`}
      >
        <form
          onSubmit={formik.handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#15202B]  pt-2 sm:pt-0 sm:max-h-[600px] sm:overflow-y-auto overflow-x-hidden  sm:h-[90%] rounded-lg sm:w-[500px]  flex  flex-col w-full h-full"
        >
          <div className="w-full items-center flex justify-between  h-[50px] mx-2 ">
            <div className="flex  items-center">
              <i
                onClick={handleClose}
                className="bi bi-x text-white items-center justify-center flex text-2xl hover:bg-slate-700 rounded-full w-[35px] h-[35px] cursor-pointer"
              ></i>
              <p className="text-lg text-white font-semibold ml-2">
                Edit Profile
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? "pointer-events-none opacity-50" : ""
              } bg-white px-4 py-1 mr-6 cursor-pointer hover:bg-slate-200 duration-300 transition-all rounded-2xl text-[#15202B]`}
            >
              {loading ? <BeatLoader size={8} /> : "Save"}
            </button>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="banner"
            className="hidden"
          />
          <label htmlFor="banner">
            <i className="text-white cursor-pointer bi bi-folder-plus"></i>
          </label>
          {image && (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              onCropChange={setCrop}
              onZoomChange={setZoom}
            />
          )}
          <img
            src={user.banner}
            alt="banner"
            className="w-full z-0 relative h-[190px] object-cover"
          />
          <img
            src={user.profilePicture}
            alt="profile"
            className="rounded-full relative w-[130px] ml-[15px] z-20 ring-4 ring-[#15202B] mt-[-65px] h-[130px] object-cover"
          />
          <div className="w-full px-5 pt-2 flex  mb-4  flex-col">
            <Input
              title="Display name"
              inputType="text"
              maxLength={50}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.displayname}
              error={
                formik.touched.displayname &&
                (formik.errors.displayname as string | false | undefined)
              }
              name="displayname"
            />
            <Input
              title="Bio"
              inputType="text"
              maxLength={160}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.bio}
              error={
                formik.touched.bio &&
                (formik.errors.bio as string | false | undefined)
              }
              name="bio"
            />
            <Input
              title="Website"
              inputType="text"
              maxLength={100}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.website}
              error={
                formik.touched.website &&
                (formik.errors.website as string | false | undefined)
              }
              name="website"
            />
          </div>
        </form>
      </div>
    </section>
  );
};
