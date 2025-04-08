import axios, { AxiosError } from "axios";

export const usePost = async (data: any) => {
  try {
    const response = await axios.post(import.meta.env.VITE_REACT_APP_BACKEND_URL + "/api/post/create", data, {
      withCredentials: true,
    });
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
