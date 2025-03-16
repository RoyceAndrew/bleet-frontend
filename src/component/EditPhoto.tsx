import Cropper from "react-easy-crop";
import { useState } from "react";
import Slider from "@mui/material/Slider";
import getCroppedImg from "../component/CroppedImg";

interface EditPhotoProps {
  image: never | null;
  aspect: number;
  back: React.Dispatch<React.SetStateAction<boolean>>;
  setImage: (image: any) => void;
  setPreview: (image: any) => void;
  preview: never | null;
  setCropImage: (image: any) => void;
  cropshape: "round" | "rect" | undefined;
}

export const EditPhoto = (props: EditPhotoProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setZoom(newValue as number);
  };

  const handleBack = () => {
    props.setImage(null);
    props.back(false);
  };

  const onCropComplete = (_croppedArea: any, croppedAreaPixels: any) => {
    props.setPreview(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      if (props.image && props.preview) {
        const croppedImage = await getCroppedImg(props.image, props.preview);
        props.setCropImage(croppedImage);
      }
      props.setImage(null);
      props.back(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    props.image && (
      <div
        className="fixed z-[100] w-screen h-screen bg-[#FFFFFF50] flex justify-center items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          <div className="bg-[#15202B] items-center rounded-t-lg py-1 px-2 flex justify-between">
            <div className="flex items-center">
              <i
                onClick={handleBack}
                className="text-white text-2xl hover:bg-slate-700 rounded-full w-[30px] flex items-center justify-center h-[30px] cursor-pointer bi bi-arrow-left-short"
              ></i>
              <p className="text-white ml-2">Edit Media</p>
            </div>
            <button
              onClick={showCroppedImage}
              className="w-[80px] py-0.5 bg-white rounded-2xl text-sm hover:bg-slate-200 cursor-pointer"
            >
              Apply
            </button>
          </div>
          <div className="relative w-[500px] h-[400px]">
            {props.image && (
              <Cropper
                image={props.image}
                crop={crop}
                zoom={zoom}
                aspect={props.aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape={props.cropshape}
              />
            )}
          </div>
          <div className="flex bg-[#15202B] rounded-b-lg py-1 px-15">
            <i className="bi mr-4 text-white bi-zoom-out"></i>
            <Slider
              onChange={handleChange}
              defaultValue={1}
              min={1}
              max={5}
              step={0.1}
              size="small"
            />
            <i className="bi ml-4 text-white bi-zoom-in"></i>
          </div>
        </div>
      </div>
    )
  );
};
