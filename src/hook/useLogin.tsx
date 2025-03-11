import axios, { AxiosError } from "axios"

interface inputData {
    email: string,
    password: string
}

export const useLogin = async (data: inputData) => {
    try {
        const response = await axios.post("http://localhost:3000/api/user/login", data, {withCredentials: true});
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