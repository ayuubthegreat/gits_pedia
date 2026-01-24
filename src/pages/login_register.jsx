import { useDispatch } from "react-redux"
import { CustomForm } from "../components/form"
import "../style/login_register.css"
import { Link, useNavigate } from "react-router-dom"
import { loginUser } from "../store/slices/auth"
import { WEBSITE_ID, WEBSITE_NAME } from "../GENERAL_INFO"



export const Login_Register = ({loginBool = true}) => {
    const d = useDispatch();
    const n = useNavigate();
    const index = (loginBool === true) ? 0 : 1;
    const send_information = async (data) => {
        data.websiteID = WEBSITE_ID;
        console.log("Login data submitted:", data);
    try {
        await d(loginUser(data)).unwrap();
        n("/");
    } catch (error) {
        console.error("Login failed:", error);
    }
}
    return (
        <div className="login_page">
            <div className="form_container"> 
                <div>
                <h1 className="header">{loginBool === true ? "Sign in back" : "Register"} to {WEBSITE_NAME}</h1>
                {loginBool === false && <p className="sub_header">Join the community and contribute to the growth of {WEBSITE_NAME}!</p>}
                </div>
              <CustomForm schemaIndex={index} defaultValueIndex={index} index={index} onSubmit={send_information} /> 
              {loginBool === true ? (<>
              <p>Don't have an account? Register now. <Link to="/register">Register</Link></p>
              </>) : (<>
              <p>Already have an account? Sign in now. <Link to="/login">Sign In</Link></p>
              </>)}
            </div>
        </div>
    )
}