import dbConnect from '@/lib/db';
import Customer from '@/models/customer.model';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const { name, email, password } = await request.json();

  await dbConnect();

  // checking if user already exists
  const existingCustomer = await Customer.findOne({ email });
  if (existingCustomer) {
    return new Response(JSON.stringify({ error: 'Customer already exists' }), { status: 400 });
  }

  // hash the password for security reasons
  
  const hashedPassword = await bcrypt.hash(password, 10);

  // create a new customer
  const customer = new Customer({
    name,
    email,
    password: hashedPassword,
  });

  try {
    const savedCustomer = await customer.save();
    
    return new Response(JSON.stringify({msg: "user created successfully!!"}), { status: 201 }); 
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}