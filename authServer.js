import express from 'express';
import routes from './src/routes/crmRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import {} from 'dotenv/config';

const app = express();
const port = 4000;

app.use(cors())


//
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//static images
app.use(express.static('public/images'));

routes(app);
productRoutes(app);

let refreshTokens = []

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

app.post('/login', (req, res) => {
  //Authenticate User
  const username = req.body.username
  const user = { name: username}

  const accessToken =  generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken);
  res.json({ accessToken : accessToken, refreshToken: refreshToken})
})

function generateAccessToken(user){
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m'})
}

console.log(refreshTokens);

app.get('/', (req, res) => {
  res.send(`Node and express server is running on port ${port}`)
});

app.listen(port, () => console.log(`Your server is running on port ${port}`));