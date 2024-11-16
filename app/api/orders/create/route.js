import dbConnect from '@/lib/db';
import { authenticate } from '@/lib/auth';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);

const createOrderHandler = async (req) => {
  const { product, quantity } = await req.json();
  
  await dbConnect();

  // Create an order object
  const order = {
    product,
    quantity,
    customerId: req.userId, // Use authenticated user's ID
  };

  try {
    // publish the order to Redis instead of saving it to the database
    await redisClient.publish('orderChannel', JSON.stringify(order));
    console.log('Order published successfully');
    return new Response(JSON.stringify({ message: 'Order published successfully' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const POST = authenticate(createOrderHandler);