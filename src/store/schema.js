import z from "zod";

export const login_schema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" })
})
export const register_schema = z.object({
    name: z.string().min(3, { message: "Username must be at least 3 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" })
})
export const article_creation_schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    search_blurb: z.string().min(1, { message: "Search blurb is required" }).max(50, { message: "Search blurb must be at most 50 characters" }),
    intro_paragraph: z.string().min(1, { message: "Intro paragraph is required" }), // Lead section (no heading)
    sections: z.array(z.object({
        heading: z.string().min(1, { message: "Section heading cannot be empty" }).optional(),
        content: z.string().min(1, { message: "Section content is required" })
    })).optional(), // Main content sections
    infobox: z.object({
        title: z.string().min(1, { message: "Infobox title is required" }).optional(),
        image: z.string().url({ message: "Image must be a valid URL" }).optional(),
        fields: z.array(z.object({
            heading: z.string().min(1, { message: "Infobox data heading cannot be empty" }).optional(),
            content: z.string().optional()
        }))
    }).optional(),
    references: z.array(z.object({
        title: z.string().min(1, { message: "Reference title cannot be empty" }),
        url: z.string().url({ message: "Reference URL must be valid" }).optional()
    })).optional()
})
