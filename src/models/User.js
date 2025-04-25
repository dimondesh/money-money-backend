import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactInfo: {
      phone: String,
      address: String,
    },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true },
);




UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
  
  };
  

const User = mongoose.model('User', UserSchema);
export default User;
