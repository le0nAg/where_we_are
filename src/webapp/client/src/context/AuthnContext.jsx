import { createContext, useReducer, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload.user,
        accessToken: action.payload.accessToken,
      };

    case "LOGOUT":
      return {
        user: null,
        accessToken: null,
      };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    accessToken: null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = localStorage.getItem("accessToken");

    if (user && accessToken) {
      dispatch({ type: "LOGIN", payload: { user, accessToken } });
    }

    // Configure the Axios interceptor
    const api = axios.create({
      baseURL: "/api",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Attach the Authorization header
    api.interceptors.request.use(
      (config) => {
        if (state.accessToken) {
          config.headers.Authorization = `Bearer ${state.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle 401 errors and refresh tokens
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && error.response.status === 401) {
          try {
            const refreshResponse = await axios.post(
              "/api/authn/refresh",
              {},
              { withCredentials: true }
            );
            const newAccessToken = refreshResponse.data.accessToken;

            // Update token in localStorage and context
            localStorage.setItem("accessToken", newAccessToken);
            dispatch({
              type: "LOGIN",
              payload: { user: state.user, accessToken: newAccessToken },
            });

            // Retry the original request
            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
            return api.request(error.config);
          } catch (refreshError) {
            console.error("Token refresh failed. Logging out...");
            dispatch({ type: "LOGOUT" });
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    // Expose the API instance globally for the app
    state.api = api;
  }, [state.accessToken, state.user]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
