import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { BASE_URL_API, STUDIO_NAME, WEBSITE_NAME } from "../GENERAL_INFO.js";
import "../style/home.css";
import { Link, useNavigate } from "react-router-dom";
import { Navbar_Links } from "./navbar_links.jsx";
import { Search, Trash2Icon } from "lucide-react";
import { setSearchQuery, setCurrentArticle } from "../store/slices/articles.js";

export function NavigationBar() {
    const {articles, searchQuery, currentArticle} = useSelector((state) => state.articles);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const dispatch = useDispatch();
    const disableSearchQuery = () => {
        dispatch(setSearchQuery(""));
    }
    const set_current_article = ({article}) => {
        dispatch(setSearchQuery(""));
        dispatch(setCurrentArticle(article));
        console.log("Current Article set to:", article);
    }
    const set_filtered_articles = () => {
        if (searchQuery.trim() === "") {
            return [];
        }
        return articles.filter(article => 
            article.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    useEffect(() => {
        setFilteredArticles(set_filtered_articles());
    }, [searchQuery, articles]);
    console.log("NavigationBar - Articles:", articles, "Search Query:", searchQuery);   
    const navigate = useNavigate();
    return (
        <nav className="navigation_bar">
            <div onClick={() => navigate("/")} className="nav_logo_container">
              <h1  className="nav_logo">{WEBSITE_NAME}</h1>   
            </div>
            <div className="search">
                <div className="search_input_wrapper">
                    <Search className="search_icon" size={20} />
                    <input type="text" placeholder={`Search articles...`} onChange={(e) => {dispatch(setSearchQuery(e.target.value))}} /> 
                </div>
                {searchQuery.trim() !== "" && (
                    <div className="search_results">
                        {filteredArticles.length > 0 ? (
                            filteredArticles.map(article => (
                                <div onClick={() => {navigate(`/article/${article.id}`);  set_current_article({article});}} className="search_result" key={article.id}>
                                    <p>{article.title}</p>
                                    <p className="search_blurb">{article.search_blurb}</p>
                                    </div>
                            ))
                        ) : (
                            <div className="search_result">
                                <p style={{color: "red"}}>No results found for "{searchQuery.length < 8 ? searchQuery : searchQuery.substring(0, 8) + '...'}"</p>
                            </div>
                        )}
                    </div>
                )}
               
            </div>
            <div className="nav_links">
                <Navbar_Links disableSearchQuery={disableSearchQuery} />
            </div>
            <div className="dropdown">
                <button onClick={() => {
                    const content = document.querySelector(".dropdown_content");
                    content.classList.toggle("hidden");
                }} className="dropdown_button">☰</button>
                <div className="dropdown_content hidden">
                    <Navbar_Links disableSearchQuery={disableSearchQuery} />
                </div>
            </div>
            </nav>
    )
}
export default function Home() {
    const [recent_articles, setRecentArticles] = useState(localStorage.getItem("recentArticles") ? JSON.parse(localStorage.getItem("recentArticles")) : []);
 return (
    <>
    <div className="page home_page">
        <div className="child_container header_section">
            <h1 className="header">Welcome to {WEBSITE_NAME}</h1>
            <p className="description">Your go-to platform for anything related to projects developed by {STUDIO_NAME}</p>
        </div>
        <div className="space_between_section">
            <div className="child_container">
                <h2 className="sub_header">Article History</h2>
                <div className="article_history">
                    <a onClick={() => {
                        localStorage.removeItem("recentArticles");
                        setRecentArticles([]);
                    }}><Trash2Icon></Trash2Icon> Delete History</a>
                    {recent_articles.length > 0 ? (
                        <>
                            {recent_articles.sort((a, b) => b.viewedAt - a.viewedAt).map((article, index) => (
                                <Link key={index} to={`/article/${article.id}`}>{index + 1}: {article.title} (Viewed at: {new Date(article.viewedAt).toLocaleString()})</Link>
                            ))}
                        </>
                    ) : (
                        <p>No recent articles viewed.</p>
                    )}
                </div>
            </div>
            <div className="child_container">
                <h2 className="sub_header">Enroll in the Inner-Circle</h2>
                <p className="description sub_description">You can suggest ideas for lore development and contribute to the creative process! Enroll into the Inner-Circle to get started.</p>
                <Link to="/register" className="enroll_button">Enroll Now</Link>
            </div>
        </div>
    </div>
    </>
 )
}
