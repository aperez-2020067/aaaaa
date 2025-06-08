'use strict'

import jwt from 'jsonwebtoken'

// Middleware para validar el JWT
export const validateJwt = async (req, res, next) => {
    try {
        // Obtener la llave de acceso al token desde las variables de entorno
        let secretKey = process.env.SECRET_KEY
        // Obtener el token de los headers
        let { authorization } = req.headers

        // Verificar si el token no viene
        if (!authorization) {
            return res.status(401).send({ message: 'Unauthorized, token missing' })
        }

        // Desencriptar el token
        let user = jwt.verify(authorization, secretKey)

        // Inyectar la información del usuario en la solicitud para su uso posterior
        req.user = user
        
        // Todo salió bien, pasar a la siguiente función
        next()

    } catch (err) {
        console.error(err)
        return res.status(401).send({ message: 'Invalid token or expired' })
    }
}


// Middleware para verificar si el usuario es ADMIN
export const isAdmin = (req, res, next) => {
    // Verificar si el rol del usuario es ADMIN
    if (req.user.role !== 'ADMIN') {
        return res.status(403).send({ message: 'Forbidden, only admins allowed' })
    }
    // Si el usuario es ADMIN, pasa a la siguiente función
    next()
}

// Middleware para verificar si el usuario es CLIENTE
export const isClient = (req, res, next) => {
    // Verificar si el rol del usuario es CLIENTE
    if (req.user.role !== 'CLIENT') {
        return res.status(403).send({ message: 'Forbidden, only clients allowed' })
    }
    // Si el usuario es CLIENTE, pasa a la siguiente función
    next()
}

// Middleware para verificar si el usuario es CLIENTE
export const isWorker = (req, res, next) => {
    // Verificar si el rol del usuario es CLIENTE
    if (req.user.role !== 'WORKER') {
        return res.status(403).send({ message: 'Forbidden, only clients allowed' })
    }
    // Si el usuario es CLIENTE, pasa a la siguiente función
    next()
}