import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { contactSchema } from "../models/crmModels.js";
import axios from 'axios';
const SALT_WORK_FACTOR = 10; 

const Contact = mongoose.model("Contact", contactSchema);

export const addNewUser  = async (req, res) =>{
    try {
        await new Contact(req.body).save();
        
        res.status(200).send(req.body)
    } catch (err) {
        res.sendStatus(500).send(err);
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
            res.sendStatus(500)
        });
       
    } catch (err) {
        res.send(err);
    }
}


export const getContactsUserAndPass = async (req, res, next) =>{
    const user = await Contact.findOne({username: req.body.username})
    const token = await axios.post(`${AUTH_LINK}login`, { username:req.body.username })
    try{

        if(await bcrypt.compare(req.body.password, user.password)){

            const model = {
                firstName: user.firstName,
                token: token.data.accessToken,
                id: user._id
            }

            res.status(200).json(model)
        } else{
            res.status(404).send()
            next();
        }
    } catch {
        res.status(500).send()
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

function authenticateToken (req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , (err, user) =>{
    console.log(err)
    if(err) return res.sendStatus(403)
    req.user = user
    next()
  })
}