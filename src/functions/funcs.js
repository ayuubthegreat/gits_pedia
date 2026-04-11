import axios from "axios"
import { BASE_INFO } from "../../BASE_INFO";
import { createAsyncThunk } from "@reduxjs/toolkit";





export const API_CALL = async({method, miniurl, data, headers}) => {
    try {
        let response;
        switch (method) {
            case "get":
                response = await axios.get(BASE_INFO.API_URL + miniurl, {
                    headers
                })
                break;
            case "post":
                response = await axios.post(BASE_INFO.API_URL + miniurl, data, {
                    headers
                })
                break;
            default:
                console.log("Please enter another method.")
                return;
        }
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const Thunk = (method, miniurl, requiresAuthentication) => createAsyncThunk(
    miniurl,
    async(payload, {rejectWithValue}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...(requiresAuthentication ? {
                "Authorization": `Bearer ${localStorage.getItem('token') || ''}`,
            } : {}),
        }
        try {
            return await API_CALL({method, miniurl, data: payload, headers});
        } catch (error) {
             if (error.response) {
                // Server responded with error
                return rejectWithValue(error.response.data);
            } else if (error.request) {
                // Request made but no response
                return rejectWithValue({ 
                    message: 'Cannot connect to server. Please check if the API is running.' 
                });
            } else {
                // Something else happened
                return rejectWithValue({ 
                    message: error.message || 'An unexpected error occurred' 
                });
            }
        }
    }
)
