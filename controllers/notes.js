const notesRouter = require('express').Router()
const Note = require('../models/note')
const logger = require('../utils/logger')
notesRouter.get(
    '/:id', async (request, response) => {

        const note = await Note.findById(request.params.id)

        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }

    }
)
notesRouter.get(
    '/', async (request, response) => {

        const notes = await Note.find({})
        response.json(notes)

    }
)
notesRouter.delete('/:id', async (request, response) => {

    await Note.findByIdAndRemove(request.params.id)
    //logger.info('result', result)
    response.status(204).end()

}
)
notesRouter.post('/', async (request, response) => {

    const body = request.body
    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    const savedNode = await note.save()
    logger.info('saved node is ', savedNode);
    response.status(201).json(savedNode)

}
)
notesRouter.put('/:id', (request, response, next) => {
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
module.exports = notesRouter