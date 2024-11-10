import { connect } from "http2";
import mongoose from "mongoose";
import { promise } from "zod";

type connectionObject = {
    isConnected ?: number
}

const connection : connectionObject = {};

async function dbConnect() : Promise<void>{
    if(connection.isConnected) {
        console.log("Already connected");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL ||"" , {});
        console.log(db);
        // The readyState property in Mongoose's connection object (db.connections[0]) indicates the current state of the connection to the MongoDB server
        // 0 - disconnected
        // 1 - connected 
        // 2 - connecting 
        // 3 - disconnecting
        connection.isConnected = db.connections[0].readyState 
        console.log("DB connected successfully")
    } catch (error) {
        console.log("error in connevcting db - " , error);
        process.exit(1);
    }
}

export default dbConnect