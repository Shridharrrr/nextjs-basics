import { getDataToken } from "@/helper/getTokenData";
import User from "@/models/userModel";
import {connect} from "@/dbConfig/dbConfig"
import { NextRequest,NextResponse } from "next/server";

connect();

export async function GET(request:NextRequest) {
    try {
       const userId = await getDataToken(request);
       const user = await User.findOne({_id: userId}).select("-password");
       return NextResponse.json({
        message: "user found",
        data: user
     })
    } catch (error: any) {
        return NextResponse.json({error: error.message},{status: 400})
    }
}