import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;

const client = twilio(accountSid, authToken);

export async function GET(request) {
  
    
 
    try {
        const twilioVerification = await client.verify.v2
            .services(serviceId)
            .verifications.create({
                channel: 'sms',
                to: `+918421018605`,
            });

        if (twilioVerification.status === "pending") {
            return new Response(JSON.stringify({
                success: true,
                message: "OTP sent Successfully"
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: "Ohh... problem with OTP sending"
            }), { status: 500 });
        }
    } catch (error) {
        console.log("Error while sending OTP: " + error);
        return new Response(JSON.stringify({
            success: false,
            message: error.message
        }), { status: 500 });
    }
}
