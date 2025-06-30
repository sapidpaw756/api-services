import { addNewProducts, getProducts, getProductsWithID , updateProducts , deleteProducts } from "../controllers/productController.js";
import jwt from 'jsonwebtoken';

const productRoutes = (app) => {
    app.route('/api/products')
     //get all contacts
    .get((req, res , next) => { 
        //middleware
        console.log(`Request type ${req.method}`)
        next();
     
    }, getProducts)
    .post(addNewProducts);

    app.route('/api/products/:productsId')
    //get specific contacts
    .get(getProductsWithID)
    .put(updateProducts)
    .delete(deleteProducts)
}

export default productRoutes


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