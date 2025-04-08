import axios, { AxiosError } from "axios";

interface userData {
  username: string;
  password: string;
  email: string;
}

const useRegister = async (data: userData) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_REACT_APP_BACKEND_URL + "/api/user/register",
      data
    );
    return { success: true, message: response.data.message };
  } catch (error: AxiosError | unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data || "Request failed",
      };
    } else if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error" };
  }
};

export { useRegister };
