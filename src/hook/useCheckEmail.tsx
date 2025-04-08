import axios, { AxiosError } from "axios";

export const useCheckEmail = async (email: string) => {
    try {
        
        const response = await axios.post(
            import.meta.env.VITE_REACT_APP_BACKEND_URL + `/api/user/check_email`,
            {email: email}
        );
        return { success: true, message: response.data.message };
    } catch (error: unknown | Error | AxiosError) {
        if (error instanceof AxiosError) {
            return {
                success: false,
                message: error.response?.data.error || error
            };
        } else {
            return { success: false, message: error };
        }
    }
};