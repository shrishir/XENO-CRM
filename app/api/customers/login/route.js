import dbConnect from '@/lib/db';
import Customer from '@/models/customer.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// set this in .env file
//techincally this should be  a long random string which cannot be remembered just by looking at it
const JWT_SECRET = process.env.JWT_SECRET || 'ssg_secret'; 

export async function POST(request) {
  const { email, password } = await request.json();

  await dbConnect();

  // check if the user has previously registered
  const customer = await Customer.findOne({ email });
  
  if (!customer) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }

  // now er're checking if the provided password is matching the hashed password
  // this is done by hashing the password provided the same way we did while signing up the user
  // and then match the freshly hashed password with the one stored in the db
  const isMatch = await bcrypt.compare(password, customer.password);
  
  if (!isMatch) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }

  // generate a JWT token
  const token = jwt.sign({ id: customer._id }, JWT_SECRET);

  return new Response(JSON.stringify({ token }), { status: 200 });
}