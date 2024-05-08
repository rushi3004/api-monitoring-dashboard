
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Token = require('../models/Token')
dotenv.config();

const authenticateToken = async (request, response, next) => {
    // const authHeader =  req.body.accessToken
    const authHeader = request.headers['authorization'];
    console.log(authHeader);
    const token = await authHeader && authHeader.split(' ')[1];
    console.log(token);
    if (token == null) {
        return response.status(401).json({ msg: 'token is missing' });
    }

    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (error, user) => {
        if (error) {
            return response.status(403).json({ msg: 'invalid token' })
        }

        request.user = user;
        next();
    })
}

const createNewToken = async (request, response) => {
    const refreshToken = request.body.token.split(' ')[1];

    if (!refreshToken) {
        return response.status(401).json({ msg: 'Refresh token is missing' })
    }

    const token = await Token.findOne({ token: refreshToken });

    if (!token) {
        return response.status(404).json({ msg: 'Refresh token is not valid'});
    }

    jwt.verify(token.token, process.env.REFREASH_SECRET_KEY, (error, user) => {
        if (error) {
            response.status(500).json({ msg: 'invalid refresh token'});
        }
        const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_KEY, { expiresIn: '1d'});

        return response.status(200).json({ accessToken: accessToken })
    })
}


module.exports = {authenticateToken,createNewToken};
