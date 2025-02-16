import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        const {email, password} = reqBody
        console.log(reqBody);

       const user = await User.findOne({email})
       if(!user){
        return NextResponse.json({error: "user does not exist"},{status: 400})
       }
       const validPass = await bcryptjs.compare(password,user.password)
       if(!validPass){
        return NextResponse.json({error: "password not valid"},{status: 400})
       }

       //create token data
       const tokenData = {
        id: user._id,
        username: user.username,
        email: user.email
       }

       //token creation
       const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn:"1d"})

       const response = NextResponse.json({
        message: "login success",
        success: true
       })
       response.cookies.set("token",token, {
        httpOnly: true,
       })
       return response;

    } catch (error: any) {
        return NextResponse.json({error: error.message},{status: 500})
    }
}