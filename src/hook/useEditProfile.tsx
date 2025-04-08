import axios, { AxiosError } from "axios";


export const useEditProfile = async (data: any) => {
    

    try {
        const response = await axios.patch(import.meta.env.VITE_REACT_APP_BACKEND_URL + "/api/user/edit_profile", data, {withCredentials: true})
        const result = response.data;
        return {success: true, message: result}
     } catch (error: unknown | Error | AxiosError) {
         if (error instanceof AxiosError) {
            return {successs: false, message: error || error};
         } else {
             return {success: false, message: error}
         }
     }
}