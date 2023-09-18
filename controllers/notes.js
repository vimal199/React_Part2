const notesRouter = require('express').Router()
const Note = require('../models/note')
const logger = require('../utils/logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
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

        const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
        response.json(notes)

    }
)
notesRouter.delete('/:id', async (request, response) => {

    await Note.findByIdAndRemove(request.params.id)
    //logger.info('result', result)
    response.status(204).end()

}
)
const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    console.log('token is ', authorization);
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}
notesRouter.post('/', async (request, response) => {

    const body = request.body
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const note = new Note({
        content: body.content,
        important: body.important === undefined ? false : body.important,
        user: user._id
    })

    const savedNode = await note.save()
    logger.info('saved node is ', savedNode)
    user.notes = user.notes.concat(savedNode._id)
    await user.save()

    response.json(savedNode)
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