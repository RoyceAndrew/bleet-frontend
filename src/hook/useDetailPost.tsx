import axios, { AxiosError } from "axios";

export const useDetailPost = async (postId: any) => {
    try {
        const response = await axios.get(import.meta.env.VITE_REACT_APP_BACKEND_URL + `/api/post/detail/${postId}`, { withCredentials: true });
        const result = response.data;
        return {success: true, message: result}
     } catch (error: unknown | Error | AxiosError) {
         if (error instanceof AxiosError) {
            return {successs: false, message: error.response?.data.error || error.response?.data};
         } else {
             return {success: false, message: error}
         }
     }
}
