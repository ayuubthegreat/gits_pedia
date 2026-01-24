import { useEffect, useState } from "react";
import { Mini_Custom_Form } from "./window_templates";
import { zodResolver } from "@hookform/resolvers/zod";
import { default_value_types, schema_types } from "./form_functions";
import { useForm } from "react-hook-form";
import { PlusCircle, Trash } from "lucide-react";
import "../style/article_creation_form.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createArticle, editArticle, fetchArticles } from "../store/slices/articles";

export const EDIT_MODE_DEFAULT_VALUES = ({articleData}) => ({
    title: articleData?.title || "Sample Article Title",
    search_blurb: articleData?.search_blurb || "This is a sample search blurb for the article.",
    intro_paragraph: articleData?.intro_paragraph || "<p>This is the introductory paragraph of the sample article. It provides an overview of the article's content.</p>",
    sections: articleData?.sections || [],
    infobox: {
        title: articleData?.infobox?.title || "Sample Infobox Title",
        image: articleData?.infobox?.image || "https://via.placeholder.com/150",
        data: articleData?.infobox?.data || []
    },
    references: articleData?.references || []
});
export const HTML_ARTICLE_CREATION_FORM = ({isEditMode = false}) => {
    const {currentArticle} = useSelector((state) => state.articles);
    const d = useDispatch();
    const n = useNavigate();
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        resolver: zodResolver(schema_types[2]), 
        defaultValues: {
            ...(isEditMode ? EDIT_MODE_DEFAULT_VALUES({articleData: currentArticle}) : default_value_types[2])
        }
    });
    const [index_form, setIndexForm] = useState(0); // For use with third form type (Article Creation)
    const [index_editing_section, setIndexEditingSection] = useState(-1); // For editing specific section
    const [showWindow, setShowWindow] = useState(false);
    const [temp_sections, setTempSections] = useState([]);
    const [temp_infobox_data, setTempInfoboxData] = useState([]);
    const [temp_references, setTempReferences] = useState([]);
    const temp_arrays = [
        temp_sections,
        temp_infobox_data,
        temp_references
    ]
    const set_temp_arrays = [
        setTempSections,
        setTempInfoboxData,
        setTempReferences
    ]
    
    const onSubmit = async (data) => {
        console.log("=== FORM SUBMITTED ===");
        try {
            console.log("Article Data Submitted:", data);
            if (isEditMode) {
                console.log("Editing Article with ID:", currentArticle.id);
                const result = await d(editArticle({id: currentArticle.id, data})).unwrap();
                console.log("Article edited successfully:", result);
                n(`/article/${currentArticle.id}`);
            } else {
                console.log("Creating New Article");
                const result = await d(createArticle(data)).unwrap();
                console.log("Article created successfully:", result);
                await d(fetchArticles()).unwrap();
                // Navigate to the newly created article if ID is returned
                if (result?.id) {
                    n(`/article/${result.id}`);
                } else {
                    n("/");
                }
            }
        } catch (error) {
            console.error("Article submission failed:", error);
            alert(`Failed to ${isEditMode ? 'update' : 'create'} article: ${error.message || error}`);
        }
    }
    
    const onError = (errors) => {
        console.log("=== VALIDATION ERRORS ===", errors, ". The original data was: ", getValues());
        alert("Please fix the validation errors before submitting");
    }
    useEffect(() => {
        if (isEditMode && currentArticle) {
            setTempSections([...currentArticle.sections] || []);
            setTempInfoboxData([...currentArticle.infobox?.fields] || []);
            setTempReferences([...currentArticle.references] || []);
        }
    }, [isEditMode, currentArticle]);
    useEffect(() => {
        setValue("sections", temp_sections);
        setValue("infobox.fields", temp_infobox_data);
        setValue("references", temp_references);
    }, [temp_sections, temp_infobox_data, temp_references, setValue]);
    return (
        <>
        <form onSubmit={handleSubmit(onSubmit, onError)} className="article_creation_form">
        {showWindow && <Mini_Custom_Form 
            originalArray={temp_arrays[index_form]}
            setOriginalArray={set_temp_arrays[index_form]}
            setCloseWindow={setShowWindow}
            defaultValues={index_editing_section < 0 ? EDIT_MODE_DEFAULT_VALUES({articleData: currentArticle}).sections : temp_arrays[index_form][index_editing_section]}
            formType={index_form === 2 ? "reference" : "section"}
        />}
        <div className="form_section">
            <label>Title</label>
            <input type="text" placeholder="Title" {...register("title")} />
            {errors.title && <p>{errors.title.message}</p>}
            <label>Search Blurb</label>
            <input type="text" placeholder="Search Blurb" {...register("search_blurb")} />
            {errors.search_blurb && <p>{errors.search_blurb.message}</p>}
            <label>Intro Paragraph</label>
            <textarea className="intro_textbox" placeholder="Intro Paragraph" {...register("intro_paragraph")} />
            {errors.intro_paragraph && <p>{errors.intro_paragraph.message}</p>}
        </div>
        <div className="form_section">
            <label>Sections (Make sure the content is HTML-compatible)</label>
            <div className="form_window">
                {temp_sections.length > 0 ? (<>
                {temp_sections.map((section, idx) => (
                    <div key={idx} className="section_item">
                        <button type="button" onClick={() => {
                            const new_temp_sections = temp_sections.filter((val, index) => index !== idx);
                            setTempSections(new_temp_sections);
                            setValue("sections", new_temp_sections);
                            console.log("Sections are: ", getValues("sections"));
                        }}>Delete Entry</button>
                        <button type="button" onClick={() => {
                            setShowWindow(true);
                            setIndexForm(0);
                            setIndexEditingSection(idx);
                        }}>Edit Entry</button>
                        <h3>{section.heading || "No Heading"}</h3>
                        <p>{section.content}</p>
                        </div>
                ))}
                </>) : (<p>No sections added yet.</p>)}
                <button type="button" onClick={() => {setShowWindow(true); setIndexForm(0); setIndexEditingSection(-1);}}><PlusCircle></PlusCircle> Add Section</button>

            </div>
            {errors.sections && <p>{errors.sections.message}</p>}
        </div>
        <div className="form_section">
            <label>Infobox</label>
            <input type="text" placeholder="Infobox Title" {...register("infobox.title")} />
            {errors.infobox?.title && <p>{errors.infobox.title.message}</p>}
            <input type="text" placeholder="Infobox Image URL" {...register("infobox.image")} />
            {errors.infobox?.image && <p>{errors.infobox.image.message}</p>}
            <label>Infobox Data Entries</label>
            <div className="form_window">
                {temp_infobox_data.length > 0 ? (<>
                {temp_infobox_data.map((data, idx) => {
                    return (
                        <>
                        <button type="button" onClick={() => {
                            const new_temp_infobox_data = temp_infobox_data.filter((val, index) => index !== idx);
                            setTempInfoboxData(new_temp_infobox_data);
                            setValue("infobox.fields", new_temp_infobox_data);
                        }}><Trash></Trash> Delete Entry</button>
                        <button type="button" onClick={() => {
                            setShowWindow(true);
                            setIndexForm(1);
                            setIndexEditingSection(idx);
                        }}>Edit Entry</button>
                        <div key={idx} className="section_item">  
                            <h3>{data.heading || "No Heading"}</h3>
                            <p>{data.content}</p>  
                        </div>
                        </>
                    )
                })}
                </>) : (<p>No infobox data added yet.</p>)}
                <button type="button" onClick={() => {setShowWindow(true); setIndexForm(1);}}><PlusCircle></PlusCircle> Add Infobox Data</button>
            </div>
        </div>
        <div className="form_section">
            <label>References</label>
            <div className="form_window">
                {temp_references.length > 0 ? (<>
                {temp_references.map((ref, idx) => (
                    <div key={idx} className="section_item">
                        <button type="button" onClick={() => {
                            const new_temp_references = temp_references.filter((val, index) => index !== idx);
                            setTempReferences(new_temp_references);
                            setValue("references", new_temp_references);
                        }}>Delete Entry</button>
                        <button type="button" onClick={() => {
                            setShowWindow(true);
                            setIndexForm(2);
                            setIndexEditingSection(idx);
                        }}>Edit Entry</button>
                        <h3>{ref.title}</h3>
                        <p>{ref.url || "No URL"}</p>
                    </div>
                ))}
                </>) : (<p>No references added yet.</p>)}
                <button type="button" onClick={() => {setShowWindow(true); setIndexForm(2);}}><PlusCircle></PlusCircle> Add Reference</button>
            </div>
        </div>
        <button className="submit_button" type="submit">{isEditMode ? "Update Article" : "Create Article"}</button>
        </form>
        
        </>
    )
}