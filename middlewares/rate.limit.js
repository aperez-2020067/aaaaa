//Limitar la cantidad de solicitudes en cierto tiempo
import rateLimit from "express-rate-limit";

export const limiter = rateLimit(
    {
        windowMs : 15 * 60 * 1000, //Rango de tiempo
        max : 100, //Cantidad de peticiones en el tiempo determinado
        message : {
            message : `You're blocked GG, wait 15 minutes`
        }
    }
);