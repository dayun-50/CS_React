import axios from "axios";

export const caxios = axios.create({
    baseURL : `http://192.168.50.128`
});

caxios.interceptors.request.use(
    (config)=>{
        const token = sessionStorage.getItem("token");
        if(token){
            config.headers["Authorization"] = `Bearer ${token}`
        }
        return config;
    }
);
