import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// Request Interceptor: Attach Access Token
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user")); // get user object
    if (user?.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 and retry
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Try to refresh the token
        const refreshResponse = await axiosInstance.get("/auth/refresh-token");

        // Save new token
        const updatedUser = {
          ...JSON.parse(localStorage.getItem("user")),
          accessToken: refreshResponse.data.accessToken,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // Redirect to login (manual way since we can't use useNavigate here)
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
