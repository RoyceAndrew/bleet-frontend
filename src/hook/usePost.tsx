import axios, { AxiosError } from "axios";

export const usePost = async (data: any) => {
  try {
    const response = await axios.post("http://localhost:3000/api/post/create", data, {
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
