import axios from "axios";
import {BASE_URL} from "./apiPaths.js";
import {ACCESS_TOKEN} from "@/utils/constants.ts";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
});

// Request interceptor to add auth token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle responses globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response) {
            if(error.response.status === 401) {
                //redirect to login page
                window.location.href = "/login";
            } else if (error.response.status === 403) {
                //redirect to unauthorized page
                //console.log("Server error, please try again later.");
                window.location.href = "/403";
            } else if (error.response.status === 500) {
                //redirect to unauthorized page
                console.log("Server error, please try again later.");
            }
        } else if (error.code === "ECONNABORTED") {
            console.log("Request timeout, please try again.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;