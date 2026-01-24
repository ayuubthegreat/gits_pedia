import { z } from "zod";
import { article_creation_schema, login_schema, register_schema } from "../store/schema";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/slices/auth";
import { useNavigate } from "react-router-dom";


export const schema_types = [
    // Login Schema
    login_schema,
    // Register Schema
    register_schema,
    article_creation_schema
]
export const default_value_types = [
    // Login 
    {
        email: "",
        password: ""
    },
    // Register
    {
        name: "",
        email: "",
        password: ""
    },
    // Article Creation
    {
        title: "",
        search_blurb: "",
        intro_paragraph: "",
        sections: [],
        infobox: {
            title: "",
            image: "",
            fields: {
                key: "",
                value: ""
            }
        },
        references: []
    },
    {
        header: "",
        content: ""
    }
]
export const Form_Window_Types = [
    "sections",
    "infobox",
    "references"
]


