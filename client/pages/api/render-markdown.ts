import type { NextApiHandler } from "next";

import markdown from "@lib/render-markdown";

const renderMarkdown: NextApiHandler = async (req, res) => {
    const { content, title } = req.body
    const renderAsMarkdown = ['markdown', 'md', 'mdown', 'mkdn', 'mkd', 'mdwn', 'mdtxt', 'mdtext', 'text', '']
    const fileType = () => {
        const pathParts = title.split(".")
        const language = pathParts.length > 1 ? pathParts[pathParts.length - 1] : ""
        return language
    }
    const type = fileType()
    let contentToRender: string = '\n' + (content || '');

    if (!renderAsMarkdown.includes(type)) {
        contentToRender = `~~~${type}
${content}
~~~`
    }

    if (typeof contentToRender !== 'string') {
        res.status(400).send('content must be a string')
        return
    }
    res.status(200).write(markdown(contentToRender))
    res.end()
}

export default renderMarkdown
