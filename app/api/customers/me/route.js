import dbConnect from "@/lib/db";
import Customer from "@/models/customer.model";
import jwt from "jsonwebtoken";
import { headers } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || "ssg_secret";

export async function GET(req) {
  const authorization = (await headers()).get("authorization");
  const token = authorization?.split(" ")[1];

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();


    const user = await Customer.findById(decoded.id).select("-password"); // Exclude password from response

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
    });
  }
}
