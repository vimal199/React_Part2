const express = require('express')
const app = express()
require('dotenv').config()
const Note = require('./models/note')
app.use(express.static('build'))
app.use(express.json())
/*const url = `mongodb+srv://fullstack:fullstack@cluster0.fzmisa1.mongodb.net/noteApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)
const noteSchema = new mongoose.Schema(
    {
        content: String,
        important: Boolean,
    }
)
const Note = mongoose.model('Note', noteSchema)
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})*/
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)
const cors = require('cors')
//const { off } = require('./models/note')
app.use(cors())
/*let notes = [
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
    console.log('id is', maxId);
    return maxId + 1
}*/
app.get(
    '/api/notes/:id', (request, response, next) => {
        /*const id = Number(request.params.id)
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
        }*/
        Note.findById(request.params.id)
            .then(
                note => {
                    if (note) {
                        response.json(note)
                    } else {
                        response.status(404).end()
                    }
                }
            )
            .catch(error => next(error))
    }
)
app.get(
    '/api/notes', (request, response) => {
        //response.json(notes)
        Note.find({}).then(notes => {
            response.json(notes)
        })
    }
)
app.delete('/api/notes/:id', (request, response, next) => {
    /*const id = Number(request.params.id)
    notes = notes.filter(note => note.id != id)
    response.status(204).end()*/
    Note.findByIdAndRemove(request.params.id)
        .then(result => {
            console.log('result', result)
            return response.status(204).end()
        }
        )
        .catch(error => next(error))
}
)
app.post('/api/notes', (request, response, next) => {

    const body = request.body
    /*if (!body.content) {
        return response.status(400).json(
            {
                error: 'content missing'
            }
        )
    }*/
    const note = new Note({
        content: body.content,
        important: body.important || false,
    })
    /*console.log("before add", notes);
    notes.push(note)
    console.log("After add", notes);*/
    //console.log(note)
    //console.log(request.headers);
    note.save().then(savedNode => {
        console.log(savedNode);
        return response.json(note)
    }
    ).catch(error => next(error))
}

)
/*const app = http.createServer(
    (request, response) => {
        response.writeHead(200, { 'Content-type': 'application/json' })
        response.end(JSON.stringify(notes))
    }
)*/
app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body
    const note = {
        content: body.content,
        important: body.important,
    }
    Note.findByIdAndUpdate(request.params.id, note, { new: true, runValidators: true, context: 'query' })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
}
)
const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {
        return response.status(404).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT || 3002
app.listen(PORT,
    () => {
        console.log(`Server running on port ${PORT}`)
    }
)
