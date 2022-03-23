import type { NextApiHandler } from "next";

import markdown from "@lib/render-markdown";

const renderMarkdown: NextApiHandler = async (req, res) => {
    const { id } = req.query
    const file = await fetch(`${process.env.API_URL}/files/raw/${id}`, {
        headers: {
            'Accept': 'text/plain',
            'x-secret-key': process.env.SECRET_KEY || '',
            'Authorization': `Bearer ${req.cookies['drift-token']}`,
        }
    })


    const json = await file.json()
    const { content, title } = json
    const renderAsMarkdown = ['m', 'markdown', 'md', 'mdown', 'mkdn', 'mkd', 'mdwn', 'mdtxt', 'mdtext', 'text', '']
    const fileType = () => {
        const pathParts = title.split(".")
        const language = pathParts.length > 1 ? pathParts[pathParts.length - 1] : ""
        return language
    }
    const type = fileType()
    let contentToRender: string = content;

    if (!renderAsMarkdown.includes(type)) {
        contentToRender = `~~~${type}
${content}
~~~`
    }

    if (typeof contentToRender !== 'string') {
        res.status(400).send('content must be a string')
        return
    }

    res.setHeader('Content-Type', 'text/plain')
    res.setHeader('Cache-Control', 'public, max-age=4800')
    res.status(200).write(markdown(contentToRender))
    res.end()
}

export default renderMarkdown
