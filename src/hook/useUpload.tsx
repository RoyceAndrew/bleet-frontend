import axios, { AxiosError } from "axios";

type api = "upload" | "uploadBanner";

export const useUpload = async (data: any, api: api, user: any) => {
    
    try {
        const response = await fetch(data);
        const blob = await response.blob();
        const file = new File(
            [blob],
            user.username.trim().replace(/\s+/g, "_") +
              new Date().getTime() +
              ".jpg",
            { type: "image/jpeg" }
          );
          const formData = new FormData();
          formData.append("file", file);
        await axios.patch("http://localhost:3000/api/user/" + api, formData, {withCredentials: true})
        
        return {success: true}
     } catch (error: unknown | Error | AxiosError) {
         if (error instanceof AxiosError) {
            return {successs: false, message: error || error};
         } else {
             return {success: false, message: error}
         }
     }
}