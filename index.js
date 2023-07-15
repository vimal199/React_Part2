const express = require('express')
const app = express()
app.use(express.json())
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)
const cors = require('cors')
app.use(cors())
let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]
const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxId + 1
}
app.get(
    '/api/notes/:id', (request, response) => {
        const id = Number(request.params.id)
        const note = notes.find(
            (note) => {
                console.log(note.id, typeof note.id, id, typeof id, note.id === id)
                return note.id === id
            }
        )
        if (note) {
            response.json(note)
        } else {
            response.statusMessage = "Current Node doesnot exist";
            response.status(404).end()
        }
    }
)
app.get(
    '/api/notes', (request, response) => {
        response.json(notes)
    }
)
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id != id)
    response.status(204).end()
}
)
app.post('/api/notes', (request, response) => {

    const body = request.body
    if (!body.content) {
        return response.status(400).json(
            {
                error: 'content missing'
            }
        )
    }
    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId(),

    }
    notes.concat(note)
    console.log(note)
    console.log(request.headers);
    response.json(note)
}

)
/*const app = http.createServer(
    (request, response) => {
        response.writeHead(200, { 'Content-type': 'application/json' })
        response.end(JSON.stringify(notes))
    }
)*/
const PORT = process.env.PORT || 3002
app.listen(PORT,
    () => {
        console.log(`Server running on port ${PORT}`)
    }
)
