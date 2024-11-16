import { createClient } from 'redis';
import dbConnect from '@/lib/db';
import Order from '@/models/order.model';
import Customer from '@/models/customer.model';

const redisClient = createClient({ url: process.env.REDIS_URL });

const processOrder = async (orderData) => {
  await dbConnect();

  const order = new Order(orderData);
  
  try {
    const savedOrder = await order.save();
    
    // updating the customer's orders array
    await Customer.findByIdAndUpdate(
      orderData.customerId,
      { $push: { orders: savedOrder._id } },
      { new: true }
    );

    console.log(`Order saved successfully: ${savedOrder._id}`);
  } catch (error) {
    console.error('Error saving order:', error);
  }
};

export async function GET(req) {
  await redisClient.connect();

  console.log('Listening for order messages...');

  // subscribe to the order channel
  // and listen for incoming order messages
  await redisClient.subscribe('orderChannel', (message) => {
    const orderData = JSON.parse(message);
    processOrder(orderData);
  });

  return new Response(JSON.stringify({ message: 'Listening for order messages...' }), { status: 200 });
}