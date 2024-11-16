import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  product: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', // refernce key!!!
    required: true 
  },
}, {
  timestamps: true 
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);