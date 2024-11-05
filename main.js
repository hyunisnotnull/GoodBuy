const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const session = require('express-session');
const Memorystore = require('memorystore')(session);
const path = require('path');
const pp = require('./lib/passport/passport');

// Socket.IO 설정
const http = require('http');
const server = http.createServer(app);
const initSocket = require('./lib/socket/socket');

// Socket.io 초기화
initSocket(server);

app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('c:\\goodbuy\\upload\\profile_thums\\'));
app.use(express.static('c:\\goodbuyforadmin\\upload\\event_images\\'));
app.use(express.json());

// session
const maxAge = 1000 * 60 * 30;
const sessionObj = {
    secret: 'green!@#$%^',
    resave: false, 
    saveUninitialized: true, 
    store: new Memorystore({checkPeriod: maxAge}),
    cookie: {
        maxAge: maxAge,
    }
};
app.use(session(sessionObj));

// passport START
let passport = pp.passport(app);
app.post('/user/sign_in_confirm', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/sign_in_form?errMsg=INCORRECT USER ID OR PW',
}));

// view template engine
app.set('view engine', 'ejs');
app.set('views', './views');

// routing
app.get('/', (req, res) => {
    console.log('/');
    res.redirect('/home');

});

// router
const homeRouter = require('./routes/homeRouter');
app.use('/home', homeRouter);

const userRouter = require('./routes/userRouter');
app.use('/user', userRouter);

const chatRouter = require('./routes/chatRouter');
app.use('/chat', chatRouter);

const productRouter = require('./routes/productRouter');
app.use('/product', productRouter);

const uploadRouter = require('./routes/uploadRouter');
app.use('/upload', uploadRouter);

server.listen(3001);