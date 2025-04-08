import axios, { AxiosError } from "axios"

interface inputData {
    email: string,
    password: string
}

export const useLogin = async (data: inputData) => {
    try {
        const response = await axios.post(import.meta.env.VITE_REACT_APP_BACKEND_URL + "/api/user/login", data, {withCredentials: true});
        const result = response.data.token;
        return {success: true, message: result}
     } catch (error: unknown | Error | AxiosError) {
         if (error instanceof AxiosError) {
            return {successs: false, message: error.response?.data.error || error.response?.data};
         } else {
             return {success: false, message: error}
         }
     }
}