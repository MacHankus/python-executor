import React from 'react'

interface IndexHTMLProps {
    injection: string // should pass rendered string here 
}
// class only for react server side rendering 
export default function ({ injection }: IndexHTMLProps) {
    return <html lang="en">
        <head>
            <meta charSet="UTF-8" />
            <meta name="description" content="App for sql tasks organize" />
            <meta name="keywords" content="SQL, Python, Application, Management" />
            <meta name="author" content="Maciej Hankus" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>SQL Organizer</title>
        </head>
        <body>
            <div id="app" dangerouslySetInnerHTML={{ __html: injection }} className="">

            </div>
            <script type="text/javascript" src="/public/js/app.main.js"></script>
        </body>
    </html>
}