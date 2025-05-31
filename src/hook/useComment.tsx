import axios, { AxiosError } from "axios";

const upComment = async (postId: string | undefined, comment: string) => {
    try {
        const response = await axios.post(import.meta.env.VITE_REACT_APP_BACKEND_URL + `/api/post/comment`, {postId, comment}, { withCredentials: true });
        console.log(response)
        return { success: true, message: response.data.message };
    } catch (error: unknown | Error | AxiosError) {
        if (error instanceof AxiosError) {
            return { success: false, message: error.response?.data.error || error.response?.data };
        } else {
            return { success: false, message: error };
        }
    }
}

const getComment = async (postid: string | undefined) => {
    try {
        const response = await axios.get(import.meta.env.VITE_REACT_APP_BACKEND_URL + `/api/post/comment/${postid}`, { withCredentials: true });
        return { success: true, message: response.data.post, comments: response.data.comments };
    } catch (error: unknown | Error | AxiosError) {
        if (error instanceof AxiosError) {
            return { success: false, message: error.response?.data.error || error.response?.data };
        } else {
            return { success: false, message: error };
        }
    }
}

export { upComment, getComment }