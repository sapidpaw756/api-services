import { addNewContact, getContacts, getContactsWithID , updateContact , deleteContact } from "../controllers/crmController.js";

const routes = (app) => {
    app.route('/contact')
     //get all contacts
    .get((req, res , next) => { 
        //middleware
        console.log(`Request type ${req.method}`)
        next();
     
    }, getContacts)
    .post(addNewContact);

    app.route('/contact/:contactId')
    //get specific contacts
    .get(getContactsWithID)
    .put(updateContact)
    .delete(deleteContact)
}

export default routes