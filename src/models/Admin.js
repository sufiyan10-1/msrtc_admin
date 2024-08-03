import mongoose,{Schema, Document} from "mongoose";


const AdminSchema = new mongoose.Schema({
   username: {
    type: String,
    required: [true, "username is required"],
    unique: true
   },
   phoneNo: {
    type: Number,
    required: [true, "phone number is required"],
    unique: true
   },
   password: {
    type: String,
    required: [true, 'Password is required'],
  },
  verifyCode: {
    type: String,
    required: [true, 'Verify Code is required'],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, 'Verify Code Expiry is required'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
   

})
const AdminModel = (mongoose.models.Admin) || mongoose.model('Admin', AdminSchema);

export default AdminModel;