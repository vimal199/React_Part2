const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url)
    .then(
        result => {
            console.log('Connected to ', url);
        }
    )
    .catch(
        (error) => {
            console.log('error connecting to Mongo Db ', error.message);
        }
    )
const noteSchema = new mongoose.Schema(
    {
        content: String,
        important: Boolean,
    }
)
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
}
)
module.exports = mongoose.model('Note', noteSchema)