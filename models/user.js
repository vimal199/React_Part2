const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            require: true,
            unique: true
        },
        name: String,
        passwordHash: String,
        notes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Note'
            }
        ]
    }
)
userSchema.plugin(uniqueValidator)
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // donot send password to response
        delete returnedObject.passwordHash
    }
}
)
const User = mongoose.model('User', userSchema)
module.exports = User