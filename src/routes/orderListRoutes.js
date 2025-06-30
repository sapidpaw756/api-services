import { addNewOrders , getOrdersWithID } from "../controllers/orderController.js";
import jwt from 'jsonwebtoken';

const orderRoutes = (app) => {
    app.route('/api/orders')
     //get all contacts
    .get((req, res , next) => { 
        //middleware
        console.log(`Request type ${req.method}`)
        next();
     
    })
    .post(addNewOrders);
    app.route('/api/orders/:userId')
        //get specific contacts
    .get(authenticateToken,getOrdersWithID)
}

export default orderRoutes

function authenticateToken (req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , (err, user) =>{
    console.log(err)
    if(err) {
      const model = [{
        status : '403',
        statusText : 'Forbidden'
      }]

      return res.send(model);
    }
    req.user = user
    next()
  })
}