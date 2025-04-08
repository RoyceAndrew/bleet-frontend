import axios, { AxiosError } from "axios";

export const useVerify = async (token: string) => {
    try {
        const response = await axios.get(
            import.meta.env.VITE_REACT_APP_BACKEND_URL + "/api/user/verify/" + token
        );
        return { success: true, message: response.data.message };
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