import { Navigate } from "react-router";

export const ProtectedRoute = ({ user, children }: { user: {} | null, children: any}) => {
    if (!user) {
        return <Navigate to="/" replace/>;
    }

    return children
};