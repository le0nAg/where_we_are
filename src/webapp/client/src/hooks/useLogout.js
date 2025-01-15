import { useAuthnContext } from "./useAuthnContext";

//TODO: redirect to home or login after logout
export const useLogout = () => {
    const { dispatch } = useAuthnContext();

    const logout = () => {
        localStorage.removeItem("user");
        window.location.reload();
        dispatch({
            type: "LOGOUT",
        });
    };

    return { logout };
};