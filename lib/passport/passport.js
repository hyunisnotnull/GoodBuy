const shortid = require('shortid');
const DB = require('../db/db');
const bcrypt = require('bcrypt');
require('dotenv').config();

exports.passport = (app) => {

    let passport = require('passport');
    let LocalStrategy = require('passport-local').Strategy;
    let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    let NaverStrategy = require('passport-naver').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) { 
        console.log('1. serializeUser: ', user);
        done(null, { U_ID: user.U_ID, U_NO: user.U_NO, U_NICK: user.U_NICK, U_ACTIVE: user.U_ACTIVE, U_CLASS: user.U_CLASS });
        
    });
    
    passport.deserializeUser(function(user, done) {
        console.log('3. deserializeUser: ', user);
        done(null, user);

    });

    passport.use(new LocalStrategy(
        {
            usernameField: 'u_id',
            passwordField: 'u_pw',
        },
        function(username, password, done) {
            console.log('username of LocalStrategy: ', username);
            console.log('password of LocalStrategy: ', password);

            DB.query(`
                SELECT * FROM TBL_USER WHERE U_ID = ?
            `,
            [username], 
            (error, user) => {

                if (error) {
                    return done(error);
                }

                if (user.length > 0) {

                    if (user[0].U_ACTIVE === 0) {
                        return done(null, false, { message: '탈퇴된 계정입니다. 관리자에게 문의하세요.' });
                    }
                    
                    if (bcrypt.compareSync(password, user[0].U_PW)) {
                        return done(null, user[0], {message: 'Welcome'});
                    } else {
                        return done(null, false, {message: 'INCORRECT USER PW'});
                    }

                } else {
                    return done(null, false, {message: 'INCORRECT USER ID'});

                }

            });

        }
    ));

    // Google START
    const googleCredential = JSON.parse(process.env.GOOGLE_LOGIN_API); // JSON 파싱

    passport.use(new GoogleStrategy({
        clientID: googleCredential.web.client_id,
        clientSecret: googleCredential.web.client_secret,
        callbackURL: googleCredential.web.redirect_uris[0]
        },
        function(accessToken, refreshToken, profile, done) {
            console.log('0. ');

            let email = profile.emails[0].value;

            DB.query(
                `
                    SELECT * FROM TBL_USER WHERE U_ID = ?
                `,
                [email], 
                (error, user) => {
                    if (user.length > 0) {    
                        DB.query(
                            `
                                UPDATE TBL_USER SET U_SNS_ID = ? WHERE U_ID = ?
                            `,
                            [profile.id, email],
                            (error, result) => {
                                done(null, user[0]);

                            }
                        );
                    
                    } else {      
                        let u_no;
                        let u_id = email;
                        let u_pw = shortid.generate();
                        let u_nick = shortid.generate();
                        let u_phone = '--';
                        let u_sex = '--';
                        let u_age = '--';
                        let u_post_address = '--';
                        let u_detail_address = '--';
                        let u_sns_id = profile.id;

                        DB.query(
                            `
                                INSERT INTO TBL_USER(U_ID, U_PW, U_NICK, U_PHONE, U_SEX, U_AGE, U_POST_ADDRESS, U_DETAIL_ADDRESS, U_SNS_ID) 
                                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
                            `,
                            [u_id, bcrypt.hashSync(u_pw, 10), u_nick, u_phone, u_sex, u_age, u_post_address, u_detail_address, u_sns_id],
                            (error, result) => {
                                if (error) {
                                    return done(error);
                                }
                                
                                u_no = result.insertId;
                                
                                done(null, { U_ID: u_id, U_NO: u_no, isNewUser: true });
                            }
                        );

                    }

                }
            );

        }
    ));

    app.get('/auth/google',
            passport.authenticate(
                'google', 
                {
                    scope: ['https://www.googleapis.com/auth/plus.login', 'email'] 
                }
            )
    );

    app.get('/auth/google/callback', 
            passport.authenticate(
                'google', 
                { 
                    failureRedirect: '/user/sign_in_form' 
                }
            ),
            (req, res) => {
                console.log('2. ');
                console.log('Google Logged in user: ', req.user);

                if (req.user && req.user.isNewUser) {
                    req.logout(() => {
                        return res.redirect('/user/social_sign_up_ok?newUser=true');
                    });
                    
                } else {
                    res.redirect('/');
                }
            }
    );

    // Naver START
    passport.use(new NaverStrategy({
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: process.env.NAVER_CALLBACK_URL
        },
        function(accessToken, refreshToken, profile, done) {
            console.log('0. naver');
            console.log('0. profile', profile);

            let email = profile._json.email;
            console.log('0. email', email);

            DB.query(
                `
                    SELECT * FROM TBL_USER WHERE U_ID = ?
                `,
                [email], 
                (error, user) => {
                    if (user.length > 0) {    
                        DB.query(
                            `
                                UPDATE TBL_USER SET U_SNS_ID = ? WHERE U_ID = ?
                            `,
                            [profile.id, email],
                            (error, result) => {
                                done(null, user[0]);

                            }
                        );
                    
                    } else {      
                        let u_no;
                        let u_id = email;
                        let u_pw = shortid.generate();
                        let u_nick = profile._json.nickname;
                        let u_phone = '--';
                        let u_sex = '--';
                        let u_age = profile._json.age;
                        let u_post_address = '--';
                        let u_detail_address = '--';
                        let u_sns_id = email;

                        DB.query(
                            `
                                INSERT INTO TBL_USER(U_ID, U_PW, U_NICK, U_PHONE, U_SEX, U_AGE, U_POST_ADDRESS, U_DETAIL_ADDRESS, U_SNS_ID) 
                                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
                            `,
                            [u_id, bcrypt.hashSync(u_pw, 10), u_nick, u_phone, u_sex, u_age, u_post_address, u_detail_address, u_sns_id],
                            (error, result) => {
                                if (error) {
                                    return done(error);
                                }
                                
                                u_no = result.insertId;
                                
                                done(null, { U_ID: u_id, U_NO: u_no, isNewUser: true });
                            }
                        );

                    }

                }
            );

        }
    ));

    app.get('/auth/naver',
            passport.authenticate(
                'naver', 
                {
                    scope: ['email', 'profile']
                }
            )
    );

    app.get('/auth/naver/callback', 
            passport.authenticate(
                'naver', 
                { 
                    failureRedirect: '/user/sign_in_form' 
                }
            ),
            (req, res) => {
                console.log('2. ');
                console.log('Naver Logged in user: ', req.user);

                if (req.user && req.user.isNewUser) {
                    req.logout(() => {
                        return res.redirect('/user/social_sign_up_ok?newUser=true');
                    });

                } else {
                    res.redirect('/');
                }
            }
    );

    return passport;

}