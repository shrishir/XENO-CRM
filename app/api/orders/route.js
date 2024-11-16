import dbConnect from '@/lib/db';
import Order from '@/models/order.model';
import { authenticate } from '@/lib/auth';

const getOrdersHandler = async (req) => {
  await dbConnect();

  // find all orders for the authenticated user
  const orders = await Order.find({ customerId: req.userId }).populate('customerId', 'name email');

  return new Response(JSON.stringify(orders), { status: 200 });
};

export const GET = authenticate(getOrdersHandler);