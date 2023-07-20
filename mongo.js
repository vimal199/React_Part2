const mongoose = require('mongoose')
if (process.argv.length < 3) {
    console.log('Give password as argument')
    process.exit(1)
}
const password = process.argv[2]
const url = `mongodb+srv://fullstack:fullstack@cluster0.fzmisa1.mongodb.net/noteApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)
const noteSchema = new mongoose.Schema(
    {
        content: String,
        important: Boolean,
    }
)
const Note = mongoose.model('Note', noteSchema)
const note = new Note(
    {
        content: 'HTML is Easy',
        important: true,
    }
)
note.save().then(
    result => {
        console.log('Note saved!')
        mongoose.connection.close()
    }
)
/*Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})*/