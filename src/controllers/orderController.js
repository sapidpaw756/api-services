import mongoose from "mongoose";
import { orderSchema } from "../models/orderModels.js";
import { contactSchema } from "../models/crmModels.js";
import { productSchema } from "../models/productModels.js";

const Orders = mongoose.model("Orders", orderSchema);
const Contact = mongoose.model("Contact", contactSchema);
const Products = mongoose.model("Products", productSchema);

export const addNewOrders  = async (req, res) =>{
    try {
        console.log(req.body);
        await Orders.insertMany(req.body);
        res.status(200).send(req.body)
    } catch (err) {
        res.send(err);
    }
}

export const getOrdersWithID = async (req, res, next) =>{
    try {
        let userId = '';
        let orderObject = null;

        await Contact.findById(req.params.userId,'_id').then(result => {
            userId = result._id.toString().slice(0,10);
        }).then(() => {
        }).catch(e => {
            console.error(e);
            res.status(500).send();
        });

        if(userId){
            await Orders.find({ userId: userId }).then(result => {
                orderObject = result;
            })
            // await Orders.aggregate([{
            //     $lookup:{
            //         from: "products",
            //         localField: "productId",
            //         foreignField: "id",
            //         as: "product",
            //     },
            //     $project:{
            //         _id: 0,
            //     },
            // }])
            // .then((data) => {
            //     res.json(data)
            // }).catch((err) => {
            //     console.log(err);
            // });

        }
        else{
            res.status(404).send();
        }
        if(orderObject){
            let model = [{'user':userId}];
            
            const response = await delayedIterator(orderObject);

            model.push(response);

            if(model[1].length === 0){
                res.status(404).send();
            }
        
            res.status(200).json(model);
            
        }
        else{
            res.status(404).send();
        }
       
    } catch (err) {
        res.send(err);
    }
}


function concatenator(y) {
  return new Promise ((resolve) => {
    setTimeout(() => {
      let added = 'add '+ y;
      resolve(added);
    }, 500);
  })
}

async function delayedIterator(x) {
  var newArr = [];
  for (const elem of x) {
    const newElem = await Products.find({ id: elem.productId }, '-_id -description -category');

    newArr.push({"count":elem.count,"title": newElem[0].title,"productId": elem.productId,"price":newElem[0].price,"image":newElem[0].image});
  }
  return newArr;
}