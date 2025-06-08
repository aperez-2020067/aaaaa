//Generador de tokens
'use strict';

import  jwt  from "jsonwebtoken";

                            //  Obojeto con datos del usuario
export const generateJwt = async(payload)=>{
    try {
        return jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {
                expiresIn : '3h', //Recomendable de una a dos horas,
                algorithm : "HS256"
            }
        );
    } catch (error) {
        console.error(error);
        return error;
    }
}