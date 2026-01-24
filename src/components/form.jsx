import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "postcss";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { login_schema, register_schema } from "../store/schema";
import { schema_types, default_value_types, Form_Window_Types} from "./form_functions";
import { PlusCircle, Trash } from "lucide-react";
import { Mini_Custom_Form } from "./window_templates";


export const CustomForm = ({ schemaIndex = 0, index = 0, onSubmit, defaultValueIndex = 0}) => {
    const {
        register, handleSubmit,
        formState: { errors },
        setValue,
        getValues
    } = useForm({
        resolver: zodResolver(schema_types[schemaIndex]), 
        defaultValues: default_value_types[defaultValueIndex]
    });
    const [index_form, setIndexForm] = useState(0); // For use with third form type (Article Creation)
    const [showWindow, setShowWindow] = useState(false); // For use with third form type (Article Creation)
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
    useEffect(() => {
        console.log("Temp Sections Updated:", temp_sections);
        setValue("sections", temp_sections);
        setValue("infobox.fields", temp_infobox_data);
        setValue("references", temp_references);
    }, [temp_sections, temp_infobox_data, temp_references, setValue]);
    const group_input_types = [
    // Login Form
    (<>
    <input type="email" placeholder="email" {...register("email")} />
    {errors.email && <p>{errors.email.message}</p>}
    <input type="password" placeholder="password" {...register("password")} />
    {errors.password && <p>{errors.password.message}</p>}
    </>),
    // Register Form
    (<>
    <input type="text" placeholder="username" {...register("name")} />
    {errors.name && <p>{errors.name.message}</p>}
    <input type="email" placeholder="email" {...register("email")} />
    {errors.email && <p>{errors.email.message}</p>}
    <input type="password" placeholder="password" {...register("password")} />
    {errors.password && <p>{errors.password.message}</p>}
    </>),
]
    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {group_input_types[index]}
            <button className="submit_button" type="submit">Submit</button>
        </form>
        </>
    )
}

