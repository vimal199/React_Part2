const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
loginRouter.post('/', async (request, response) => {
    let { userName, password } = request.body
    userName = request.body.username
    console.log('userName is ', userName)
    console.log('password is ', password);
    const user = await User.findOne({ userName })
    console.log('is user available ', user);
    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)
    if (!(user && passwordCorrect)) {
        return response.status(401).json(
            { error: 'invalid username or password' }
        )
    }
    const userForToken = {
        userName: user.userName,
        id: user._id,
    }
    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })
    response.status(200).send({ token, userName: user.userName, name: user.name })
}
)
module.exports = loginRouter