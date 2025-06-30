import express from 'express';
import routes from './src/routes/crmRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import orderRoutes from './src/routes/orderListRoutes.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import {} from 'dotenv/config';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors())
app.use('/images', express.static(path.join(__dirname, '../assets/imgs/products')));

//mongoose connection 
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI).
  catch(error => console.log(error));
//
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//static images
app.use(express.static('public/images'));

routes(app);
productRoutes(app);
orderRoutes(app);

const posts = [
  {
    username: 'dark756',
    title: 'Post 1'
  },
  {
    username: 'Jim',
    title: 'Post 2'
  },
]

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name))
})

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

app.get('/', (req, res) => {
  res.send(`Node and express server is running on port ${port}`)
});

app.get('/mong', (req, res) => {

  res.send(`Mongoose connection ${mongoose.connection.readyState}`)
});

app.listen(port, () => console.log(`Your server is running on port ${port}`));