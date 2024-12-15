const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = 'mongodb+srv://jeznode:89891@nodelearn.xwxyn.mongodb.net/nodelearn?retryWrites=true&w=majority&appName=nodelearn';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// routes

app.get('*', checkUser); 
app.use(authRoutes); 
app.use(courseRoutes); 
app.use(studentRoutes); 
app.get('/', (req, res) => res.redirect('/login));
app.get('/index', (req, res) => res.render('index', { title: 'Login' }));
app.get('/signup', (req, res) => res.render('signup', { title: 'Sign Up' }));
app.get('/create', (req, res) => res.render('schedule', { title: 'Schedule' }));

module.exports = app;