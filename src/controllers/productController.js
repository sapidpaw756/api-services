import mongoose from "mongoose";
import { productSchema } from "../models/productModels.js";

const Products = mongoose.model("Products", productSchema);

export const addNewProducts  = async (req, res) =>{
    try {
        await new Products(req.body).save();
        res.status(200).send(req.body)
    } catch (err) {
        res.send(err);
    }
}

export const getProducts = async (req, res) =>{
    try {
        var contacts = [];
        await Products.find().then(result => {
            contacts = result.sort((a, b) => parseFloat(a.id) - parseFloat(b.id)); ;
        }).then(() => {
            res.status(200).json(contacts)
        }).catch(e => {
            console.error(e);
            res.status(500)
        });
       
    } catch (err) {
        res.send(err);
    }
}

export const getProductsWithID = async (req, res) =>{
    try {
        var contacts = [];
        await Products.findOne({ id: req.params.productsId }).then(result => {
            contacts = result;
        }).then(() => {
            res.status(200).json(contacts)
        }).catch(e => {
            console.error(e);
            res.status(500)
        });
       
    } catch (err) {
        res.send(err);
    }
}

export const updateProducts = async (req, res) =>{
    try {
        var contacts = [];
        await Products.findOneAndUpdate({id: req.params.productsId}, req.body , { new : true}).then(result => {
            contacts = result;
        }).then(() => {
            res.status(200).json(contacts)
        }).catch(e => {
            console.error(e);
            res.status(500)
        });
       
    } catch (err) {
        res.send(err);
    }
}

export const deleteProducts = async (req, res) =>{
    try {
        var contacts = [];
        await Products.deleteOne({id: req.params.productsId}).then(result => {
            contacts = result;
        }).then(() => {
            res.status(200).json({message: 'Succesfully deleted'})
        }).catch(e => {
            console.error(e);
            res.status(500)
        });
       
    } catch (err) {
        res.send(err);
    }
}