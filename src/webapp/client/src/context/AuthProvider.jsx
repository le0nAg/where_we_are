import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
        return;
      }
      try {
        const { data } = await axios.post(
          "http://localhost:5000",
          {},
          { withCredentials: true }
        );
        const { status, user } = data;
        if (status) {
          setUser(user);
          toast(`Welcome back, ${user}!`, {
            position: "top-right",
          });
        } else {
          removeCookie("token");
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
        removeCookie("token");
        navigate("/login");
      }
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const loginAction = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/login", data, {
        withCredentials: true,
      });
      const { token, user } = response.data;
      if (token) {
        setCookie("token", token, { path: "/" });
        setUser(user);
        navigate("/home");
        toast(`Hello, ${user}!`, {
          position: "top-right",
        });
        return;
      }
      throw new Error(response.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Please try again.", {
        position: "top-right",
      });
    }
  };

  const logOut = () => {
    removeCookie("token", { path: "/" });
    setUser(null);
    navigate("/login");
    toast.info("Logged out successfully.", {
      position: "top-right",
    });
  };

  return (
    <AuthContext.Provider value={{ user, loginAction, logOut }}>
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
