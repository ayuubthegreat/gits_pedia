import { PlusCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import { setSearchQuery } from "../store/slices/articles";
import { logout } from "../store/slices/auth";


export const Custom_Link = ({ to, children, onClickFunc }) => {
    const dispatch = useDispatch();
    const disableSearchQuery = () => {
        dispatch(setSearchQuery(""));
    }
    return (
        <Link to={to} onClick={() => { onClickFunc(); disableSearchQuery(); }}>
            {children}
        </Link>
    )
}
export const Navbar_Links = ({ disableSearchQuery }) => {
    const d = useDispatch();
    const n = useNavigate();
    const {user, token} = useSelector((state) => state.auth);
    console.log("Navbar Links - User:", user, "Token:", token);
    if (user && token) {
        return (
            <>
            <Custom_Link to="#" className="user_mini_profile" onClickFunc={() => { disableSearchQuery(); }}>Welcome, {user.name}!</Custom_Link>
            {user.role === "supa_admin" && (<>
            <Custom_Link to="/create_article" onClickFunc={() => { disableSearchQuery(); }}><PlusCircle></PlusCircle> Create Article</Custom_Link>
            </>)}
            <Custom_Link to="/articles" onClickFunc={() => { disableSearchQuery(); }}>Articles</Custom_Link>
            <Custom_Link to="/about" onClickFunc={() => { disableSearchQuery(); }}>About</Custom_Link>
            <Custom_Link to="/dashboard" onClickFunc={() => { disableSearchQuery(); }}>Dashboard</Custom_Link>
            <Custom_Link to="#" onClickFunc={() => { d(logout()); n("/login");  }}>Logout</Custom_Link>
            </>
        )
    }
    return (
        <>
        <Custom_Link to="/articles" onClickFunc={() => { disableSearchQuery(); }}>Articles</Custom_Link>
        <Custom_Link to="/about" onClickFunc={() => { disableSearchQuery(); }}>About</Custom_Link>
        <Custom_Link to="/login" onClickFunc={() => { disableSearchQuery(); }}>Login</Custom_Link>
        </>
    )
}