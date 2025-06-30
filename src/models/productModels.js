import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const productSchema = new Schema({
    id :{
        type: String
    },
    title :{
        type: String
    },
    price:{
        type: String
    },
    category:{
        type: String
    },
    description:{
        type: String
    },
    image:{
        type: String
    }
})