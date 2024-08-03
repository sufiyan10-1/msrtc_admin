import twilio from 'twilio'




const accountSid = process.env.TWILIO_ACCOUNT_SDI
const authToken = process.env.TWILIO_AUTH_TOKEN
const serviceId = process.env.TWILIO_SERVICE_ID

const client = twilio(accountSid, authToken)

export async function GET(request){
  
try {
   const twilioResponse = await client.verify.v2
   .services(serviceId)
   .verificationChecks.create({
    code: "12345",
    to: `+8421018605`,
   })    

   if(twilioResponse.status ==="approved"){
    return Response.json({
        success: true,
        message: "User register successfully"
    },{status: 200})
   }
   else{
    return Response.json({
        success: false,
        message: "ohh... invalid code"
    },{status:400})
   }

    } catch (error) {
        console.log("error while accepting otp"+ error)
        return Response.json({
            success: false,
            message: error
        },{status: 500})
    }
}