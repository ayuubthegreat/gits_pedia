import { X } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux"



export const Loading_Window = () => {
    const {loading} = useSelector((state) => state.auth);
    const {loading: articlesLoading} = useSelector((state) => state.articles);
    const loadingState = loading || articlesLoading;
    if (!loadingState) return null;
    return (
        <div className="loading_screen">
            <div className="loading_window">
                <p>Loading...</p>
            </div>
        </div>
    )
}
export const Mini_Custom_Form = ({originalArray, setOriginalArray, setCloseWindow, defaultValues, formType = "section"}) => {
    console.log(originalArray, defaultValues);
    const [newEntry, setNewEntry] = React.useState(
        formType === "reference" 
            ? { title: defaultValues?.title || "", url: defaultValues?.url || "" } 
            : { heading: defaultValues?.heading || "", content: defaultValues?.content || "" }
    );
    
    const onSubmit = (data) => {
        const indexToEdit = originalArray.findIndex(entry => 
            formType === "reference" 
                ? entry.title === defaultValues.title && entry.url === defaultValues.url
                : entry.heading === defaultValues.heading && entry.content === defaultValues.content
        );
        if (indexToEdit >= 0) {
            const updatedArray = [...originalArray];
            updatedArray[indexToEdit] = data;
            setOriginalArray(updatedArray);
        } else {
            setOriginalArray([...originalArray, data]);
        }
        setCloseWindow(false);
    }
    
    return (
        <>
        <div className="loading_screen">
            <div className="loading_window">
                <a onClick={() => setCloseWindow(false)}><X /></a>
                <div>
                    {formType === "reference" ? (
                        <>
                            <label>Title</label>
                            <input 
                                placeholder="Reference title" 
                                onChange={(e) => setNewEntry({...newEntry, title: e.target.value})} 
                                value={newEntry.title} 
                            />
                            <label>URL</label>
                            <input 
                                type="url" 
                                placeholder="Reference URL (optional)" 
                                onChange={(e) => setNewEntry({...newEntry, url: e.target.value})} 
                                value={newEntry.url} 
                            />
                        </>
                    ) : (
                        <>
                            <label>Heading</label>
                            <input 
                                placeholder="Section heading" 
                                onChange={(e) => setNewEntry({...newEntry, heading: e.target.value})} 
                                value={newEntry.heading} 
                            />
                            <label>Content</label>
                            <textarea 
                                placeholder="Section content (make sure it is in HTML)" 
                                onChange={(e) => setNewEntry({...newEntry, content: e.target.value})} 
                                value={newEntry.content} 
                            />
                        </>
                    )}
                    <button onClick={() => {onSubmit(newEntry)}} type="button">Add {formType === "reference" ? "Reference" : "Entry"}</button>
                </div>
            </div>
        </div>
        </>
    )
}


