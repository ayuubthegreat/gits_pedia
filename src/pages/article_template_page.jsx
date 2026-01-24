// This page will be replicated depending on the article being viewed
import DOMPurify from 'dompurify';
import { useEffect } from 'react';
import '../style/article_template_page.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteArticle, setCurrentArticle } from '../store/slices/articles';
import { ArrowBigDown } from 'lucide-react';


export const Article_Template_Page = ({article}) => {
    const n = useNavigate();
    const d = useDispatch();
    const {user, token} = useSelector((state) => state.auth);
    useEffect(() => {
        console.log("Article_Template_Page - Viewing article:", article);
        const recentArticles = JSON.parse(localStorage.getItem("recentArticles")) || [];
        const filteredArticles = recentArticles.filter(a => a.id === article.id);
        if (filteredArticles.length === 0) {
            const modifiedArticle = {...article};
            modifiedArticle.viewedAt = new Date().getTime();
            recentArticles.push(modifiedArticle);
            if (recentArticles.length > 5) {
                recentArticles.shift();
            }
            localStorage.setItem("recentArticles", JSON.stringify(recentArticles));
        } else {
            console.log("Article already in recent articles:", article.id);
            filteredArticles[0].viewedAt = new Date().getTime();
            localStorage.setItem("recentArticles", JSON.stringify(recentArticles));
        }
    }, [article]);
    const {
        title,
        search_blurb,
        intro_paragraph,
        sections,
        infobox,
        references
    } = article;
    return (<div className="article_template_page">
        <div style={{display: `${user && user.role !== "user" ? "block" : "none"}`, gap: "10px"}} className='article_top_btns'>
         <button className='edit_button' onClick={() => {
            n(`/edit_article/:${article.id}`);
            d(setCurrentArticle(article));
        }}>Edit Article</button> 
        <button onClick={() => {
            n("/");
        }}>Delete Button</button>  
        </div>
        
        <h1 className="article_title">{title}</h1>
        <div className='article_intro'>
         <div className="article_intro_paragraph article_paragraph">
            <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(intro_paragraph)}}></p>
        </div> 
        <div className='infobox'>
        <div className='infobox_title'>
            <h3>{infobox.title}</h3>
        </div>
        <div className='infobox_image'>
            {infobox.image ? (<img src={infobox.image} alt={infobox.title}  />) : (<p>No Image Provided</p>)}
        </div>
        <div className='infobox_data'>
            {infobox.fields.map((field, index) => {
                return(
                    <>
                    <div key={index} className='infobox_data_entry'>
                        <p className='infobox_data_entry_header'>{field.heading}</p>
                        <p className='infobox_data_entry_content'>{field.content}</p>
                    </div>
                    </>
                )
            })}
        </div>
        </div>  
        </div>
        
        <div className="article_main_content">
            <div className="article_sections">
                {sections.map((section, index) => {
                    return (
                        <div key={index} className="article_section article_paragraph">
                            <h2 className="section_header">
                                <button className='dropdown_btn' onClick={() => {
                                    const id = document.getElementById(`section_content_${index}`);
                                    id.classList.toggle("hidden");
                                    id.style.display = id.classList.contains("hidden") ? "none" : "inline";
                                }}><ArrowBigDown></ArrowBigDown></button>
                                {section.heading}</h2>
                            <div id={`section_content_${index}`} style={{display: "inline"}} className="section_content" dangerouslySetInnerHTML={{__html: section.content}}></div>
                        </div>
                    )
                })}
            </div>
            <div className="article_infobox">
            </div>
        </div>
        
        </div>);
}