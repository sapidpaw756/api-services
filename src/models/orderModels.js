import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const orderSchema = new Schema({
    id :{
        type: String
    },
    productId :{
        type: String
    },
    count: {
        type: Number
    },
    userId: {
        type: String
    }
})