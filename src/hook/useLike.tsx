import axios, { AxiosError } from "axios";

export const useLike = async (data?: any) => {
    try {
       
        const response = await axios.post(
            import.meta.env.VITE_REACT_APP_BACKEND_URL + "/api/post/like",
            data,
            { withCredentials: true }
        );
        return { success: true, message: response.data};

    } catch (error: unknown | Error | AxiosError) {
        if (error instanceof AxiosError) {
            return {
                success: false,
                message: error.response?.data.error || error.response?.data,
            };
        } else {
            return { success: false, message: error };
        }
    }
};