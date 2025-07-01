const jwt = require('jsonwebtoken');
const express = require('express');
const cookieParser = require('cookie-parser');
const port = 500;
const app = express();
const connectDb = require('./Db/Db.connection');
const userAuth = require('./Routes/UserAuth');
const Task = require('./Models/Task');
const User = require('./Models/User');

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/Views');

app.get('/', isAuthenticated, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id });
        log.info('Tasks fetched successfully:', tasks);
    
        
        res.render('Dashboard', { title: 'Home Page', tasks });
    } catch (error) {
        res.render('Dashboard', { title: 'Home Page', tasks: [], error: error.message });
    }
});

app.get('/register', (req, res) => {
  res.render('Register', { title: 'Register Page' });
});

app.get('/login', (req, res) => {
  res.render('Login', { title: 'Login Page' });
});

function isAuthenticated(req, res, next) {
  const token = req.cookies && req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = { _id: decoded.userId };
    next();
  } catch (err) {
    return res.redirect('/login');
  }
}




app.use('/api', userAuth);
app.use('/api', require('./Routes/Task'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});