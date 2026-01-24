import axios from "axios";
import { BASE_URL_API } from "../GENERAL_INFO";

// API Call function (will simplify API calls later implemented in store slices)
export const APICall = async (method, url, data, token = null, headers = {}) => {
    try {
        const config = {
            method,
            url: `${BASE_URL_API}${url}`,
            headers: {
                ...headers,
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        }
        if ((method.toLowerCase() === 'get' || method.toLowerCase() === 'delete') && data) {
            config.params = data;
        } else {
            config.data = data;
        }
        const response = await axios(config);
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: error.response ? error.response.data : error.message };
    }    
}

export const getData = (params, url) => {
    return APICall("get", url, {data: params});
}

export const postData = (data, url) => {
    return APICall("post", url, data);
}
