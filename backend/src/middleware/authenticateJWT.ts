import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = '7sQ8B#fH&3y^A!jKpLq9R8$g5vT@eF&nJzYx1wC2^uZ@oS#eA'; 

export const authenticateJWT = (req: any, res: any, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
        return res.sendStatus(403); // Forbidden if no token is provided
    }

    jwt.verify(token, SECRET_KEY, (err:any, user:any) => {
        if (err) {
            return res.sendStatus(403); // Forbidden if token is invalid
        }
        req.user = user; // Save the user info to the request
        next(); // Proceed to the next middleware or route handler
    });
};
