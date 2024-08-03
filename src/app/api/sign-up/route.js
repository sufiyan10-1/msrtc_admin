import dbConnect from "@/lib/dbConnect";
import AdminModel from "@/models/Admin";
import bcrypt from 'bcryptjs';
 



export async function POST(request){
 await dbConnect();

 try{
    const {password, phoneNo,username,  } = await request.json();
    const existingVerifiedUserByUsername = await AdminModel.findOne({
        username,
        isVerified: true,
    })
    if(existingVerifiedUserByUsername){
        return Response.json(
            {
                success: false,
                message: "user name is already taken"
            },{status: 400}
        );
    }
    const existingUserByPhoneNo = await AdminModel.findOne({phoneNo});
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if(existingUserByPhoneNo){
      if(existingUserByPhoneNo.isVerified){
        return Response.json({
            success: false,
            message: 'user already exists with this email',
        },{status: 400}
       )
      }
      else{
        const hashPassword = await bcrypt.hash(password, 10)
        existingUserByPhoneNo.password = hashPassword;
        existingUserByPhoneNo.verifyCode = verifyCode;
        existingUserByPhoneNo.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByPhoneNo.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newAdmin = new AdminModel({
        username,
        phoneNo,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,

      });

      await newAdmin.save();
    }

    return Response.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your account.',
      },
      { status: 201 }
    );
 }catch (error){
  console.error('Error registering user:', error);
    return Response.json(
      {
        success: false,
        message: 'Error registering user',
      },
      { status: 500 }
    );
 }

}