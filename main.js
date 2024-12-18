const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const session = require('express-session');
const Memorystore = require('memorystore')(session);
const path = require('path');
const pp = require('./lib/passport/passport');
const cors = require('cors');
const errorHandler = require('./lib/config/utils');

// Socket.IO 설정
const http = require('http');
const server = http.createServer(app);
const { initSocket } = require('./lib/socket/socket');

// Socket.io 초기화
initSocket(server);

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('c:\\goodbuy\\upload\\profile_thums\\'));
app.use('/uploads/chat_images', express.static('c:\\goodbuy\\upload\\chat_images\\'));
app.use('/uploads/admin_chat_images', express.static('c:\\goodbuy\\upload\\admin_chat_images'));
app.use(express.static('c:\\goodbuyforadmin\\upload\\event_images\\'));
app.use(express.json());

// session
const maxAge = 1000 * 60 * 30;
const sessionObj = {
    secret: 'green!@#$%^',
    resave: false, 
    saveUninitialized: false, 
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
    failureRedirect: '/user/sign_in_form?errMsg=ID 또는 PW가 일치하지 않습니다.',
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
const { MulterError } = require('multer');
app.use('/product', productRouter);

const uploadRouter = require('./routes/uploadRouter');
app.use('/upload', uploadRouter);

app.use((err, req, res, next) => {
    if (req.files.length === 3){
        res.status(500).json({ message: '이미지는 최대 3장까지만 가능합니다.' });
    }
    console.log(err);
})

// 404 페이지 처리
app.use(errorHandler.handle404);

server.listen(3001,'0.0.0.0');