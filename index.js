import express from 'express';
import routes from './src/routes/crmRoutes.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';


const app = express();
const port = 3000;

//mongoose connection 
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/CRMdb')

//
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//static images
app.use(express.static('public/images'));

routes(app);

app.get('/', (req, res) => {
  res.send(`Node and express server is running on port ${port}`)
});

app.listen(port, () => console.log(`Your server is running on port ${port}`));