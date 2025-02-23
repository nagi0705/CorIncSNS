require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;

const app = express();
app.use(express.json());

// セッション設定
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Passportの初期化
app.use(passport.initialize());
app.use(passport.session());

// 認証後のシリアライズ・デシリアライズ処理
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// **Twitter認証**
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_API_KEY,
  consumerSecret: process.env.TWITTER_API_SECRET_KEY,
  callbackURL: "http://localhost:3000/auth/twitter/callback"
}, (token, tokenSecret, profile, done) => {
  return done(null, { profile, token, tokenSecret });
}));

// **Facebook認証**
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_API_KEY,
  clientSecret: process.env.FACEBOOK_API_SECRET_KEY,
  callbackURL: "http://localhost:3000/auth/facebook/callback"
}, (accessToken, refreshToken, profile, done) => {
  return done(null, { profile, accessToken });
}));

// **Instagram認証**
passport.use(new InstagramStrategy({
  clientID: process.env.INSTAGRAM_API_KEY,
  clientSecret: process.env.INSTAGRAM_API_SECRET_KEY,
  callbackURL: "http://localhost:3000/auth/instagram/callback"
}, (accessToken, refreshToken, profile, done) => {
  return done(null, { profile, accessToken });
}));

// **各SNSの認証ルート**
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/instagram', passport.authenticate('instagram'));

// **認証成功後のリダイレクト処理**
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/auth/failure' }), (req, res) => {
  if (!req.user) return res.redirect('/auth/failure');
  
  // 🔥 認証成功時に accessToken も返すように修正！
  res.json({ message: "認証成功", user: req.user.profile, accessToken: req.user.token });
});

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth/failure' }), (req, res) => {
  if (!req.user) return res.redirect('/auth/failure');

  res.json({ message: "認証成功", user: req.user.profile, accessToken: req.user.accessToken });
});

app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/auth/failure' }), (req, res) => {
  if (!req.user) return res.redirect('/auth/failure');

  res.json({ message: "認証成功", user: req.user.profile, accessToken: req.user.accessToken });
});

// **認証結果を返すエンドポイント**
app.get('/auth/success', (req, res) => {
  if (!req.user) return res.status(401).json({ message: "未認証" });
  res.json({ message: "認証成功", user: req.user });
});

app.get('/auth/failure', (req, res) => {
  res.status(401).json({ message: "認証失敗" });
});

// **ログアウト**
app.get('/auth/logout', (req, res) => {
  req.logout();
  res.json({ message: "ログアウトしました" });
});

module.exports = app;