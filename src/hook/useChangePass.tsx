import axios, {AxiosError} from "axios";

export const useChangePass = async (token: string | undefined, data: string) => {
    try {
        const response = await axios.post(import.meta.env.VITE_REACT_APP_BACKEND_URL + "/api/user/change_password/" + token, {password: data}, {withCredentials: true})
        const result = response.data.token;
        return {success: true, message: result}
     } catch (error: unknown | Error | AxiosError) {
         if (error instanceof AxiosError) {
            console.log(error)
            return {successs: false, message: error.response?.data.error || error.response?.data};
         } else {
             return {success: false, message: error}
         }
     }
}