import axios from "axios";

export const caxios = axios.create({
    baseURL : `http://10.5.5.3`
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
