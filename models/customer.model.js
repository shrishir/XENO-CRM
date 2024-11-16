import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  orders: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order' //array of orders!!
  }],
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);