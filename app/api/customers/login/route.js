import dbConnect from '@/lib/db';
import Customer from '@/models/customer.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'ssg_secret'; 

export async function POST(request) {
  const { email, password } = await request.json();

  await dbConnect();

  // check if the user has previously registered
  const customer = await Customer.findOne({ email });
  
  if (!customer) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }

  
  const isMatch = await bcrypt.compare(password, customer.password);
  
  if (!isMatch) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }

  // generate a JWT token
  const token = jwt.sign({ id: customer._id }, JWT_SECRET);

  return new Response(JSON.stringify({ token }), { status: 200 });
}