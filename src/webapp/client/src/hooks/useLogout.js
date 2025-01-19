import { useAuthnContext } from "./useAuthnContext";
import { useNavigate } from "react-router-dom";

//TODO: redirect to home or login after logout
export const useLogout = () => {
    const { dispatch } = useAuthnContext();
    const  navigate  = useNavigate();

    const logout = () => {
        //localStorage.removeItem("user");
        window.location.reload();
        dispatch({
            type: "LOGOUT",
        });
        navigate("/login");
    };

    return { logout };
};