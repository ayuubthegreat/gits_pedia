import { useDispatch, useSelector } from "react-redux";
import { CustomForm } from "../components/form";
import { createArticle } from "../store/slices/articles";
import { useNavigate } from "react-router-dom";
import { HTML_ARTICLE_CREATION_FORM } from "../components/article_creation_form";


export default function Article_Creation_Page({isEdit = false, articleData = null}) {
    const d = useDispatch();
    const n = useNavigate();
    const {articles} = useSelector((state) => state.articles);
    const onSubmit = async (data) => {
        console.log("Article Data Submitted:", data);
        try {
            await d(createArticle(data)).unwrap();
            console.log("Article created successfully");
            n("/");
        } catch (error) {
            console.error("Article creation failed:", error);
        }
    }
    return (
        <>
        <div>
            <p>There are {articles.length} articles already in storage.</p>
            <p>{isEdit ? "Edit Mode" : "Create Mode"}</p>
            <HTML_ARTICLE_CREATION_FORM isEditMode={isEdit} articleData={articleData} />
        </div>
        </>
    )
}