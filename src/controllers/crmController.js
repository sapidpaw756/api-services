import mongoose from "mongoose";
import { contactSchema } from "../models/crmModels.js";

const Contact = mongoose.model("Contact", contactSchema);

export const addNewContact  = async (req, res) =>{
    try {
        await new Contact(req.body).save();
        res.status(200).send(req.body)
    } catch (err) {
        res.send(err);
    }
}

export const getContacts = async (req, res) =>{
    try {
        var contacts = [];
        await Contact.find().then(result => {
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

export const getContactsWithID = async (req, res) =>{
    try {
        var contacts = [];
        await Contact.findById(req.params.contactId).then(result => {
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

export const updateContact = async (req, res) =>{
    try {
        var contacts = [];
        await Contact.findOneAndUpdate({_id: req.params.contactId}, req.body , { new : true}).then(result => {
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

export const deleteContact = async (req, res) =>{
    try {
        var contacts = [];
        await Contact.deleteOne({_id: req.params.contactId}).then(result => {
            console.log(result);
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