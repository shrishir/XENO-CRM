import jwt from "jsonwebtoken";
import { headers } from 'next/headers'
const JWT_SECRET = process.env.JWT_SECRET || "ssg_secret";

//middleware funtion to authenticate the user
export const authenticate = (handler) => async (req, res) => {

    //sent as "Bearer <token>" in the headers
    // hence we split it and get the token
    const authorization = (await headers()).get('authorization')
    const token = authorization?.split(' ')[1];

    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id; // go throught tutorials on jwt middleware to understand this better
        return handler(req, res);
    } catch (error) {
        return new Response(JSON.stringify({ error }), {
        status: 401,
        });
  }
};
