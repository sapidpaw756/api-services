import { addNewUser, getContacts, getContactsWithID , updateContact , deleteContact, getContactsUserAndPass } from "../controllers/crmController.js";
import jwt from 'jsonwebtoken';

const routes = (app) => {
    app.route('/api/contact')
     //get all contacts
    .get((req, res , next) => { 
        //middleware
        console.log(`Request type ${req.method}`)
        next();
    },authenticateToken, getContacts)
    .post(addNewUser);

    app.route('/api/contact/:contactId')
    //get specific contacts
    .get(getContactsWithID)
    .put(updateContact)
    .delete(deleteContact);

    app.route('/api/getuser')
    .post(getContactsUserAndPass)
}

export default routes

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