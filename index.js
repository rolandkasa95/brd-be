const express = require('express')
const passport = require('passport')
const localStrategy = require('./src/Auth.js')
var cookieParser = require('cookie-parser');
var session = require('express-session');
const fileUpload = require('express-fileupload');
const MemoryStore = require('memorystore')(session)
var fs = require('fs');
const { cwd } = require('process');
const app = express()
var cors = require('cors')
const port = 80
passport.use(localStrategy())
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    credentials: true,
    'origin': 'http://localhost:3001',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}))


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'brandusei',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  store: new MemoryStore({
    checkPeriod: 86400000
  })
}));
app.use(express.static('docs'))
app.use(passport.authenticate('session'));

app.get('/login/callback', (req, res) => {
    return res.send({
        payload: {
            success: true
        },
        error: null
    })
})

app.get('/brd-a',() => {
    if(!req.isAuthenticated()){
        return res.status(401).send({
            payload: null,
            error: {
                status: 401,
                message: 'Unauthenticated'
            }
        })
    }


})

app.post('/upload-a', upload.single('file'), (req,res) => {
    if(!req.isAuthenticated()){
        return res.status(401).send({
            payload: null,
            error: {
                status: 401,
                message: 'Unauthenticated'
            }
        })
    }
    const date = new Date()

    if(fs.existsSync(`${cwd()}/docs/brd-a/current.pdf`)){
        console.log(date.toISOString())
        fs.rename(`${cwd()}/docs/brd-a/current.pdf`, `${cwd()}/docs/brd-a/${date.getTime()}.pdf`, (err) => {
            if(!err){
                console.log('Successfully moved file')
            }

            fs.copyFileSync(req.file.path, `${cwd()}/docs/brd-a/current.pdf`)
            res.send(req.file)
        })
    }else{
        fs.copyFileSync(req.file.path, `${cwd()}/docs/brd-a/current.pdf`)
        res.send(req.file)
    }
})

app.post('/upload-b', upload.single('file'), (req,res) => {
    if(!req.isAuthenticated()){
        return res.status(401).send({
            payload: null,
            error: {
                status: 401,
                message: 'Unauthenticated'
            }
        })
    }

    const date = new Date()

    if(fs.existsSync(`${cwd()}/docs/brd-b/current.pdf`)){
        console.log(date.toISOString())
        fs.rename(`${cwd()}/docs/brd-b/current.pdf`, `${cwd()}/docs/brd-b/${date.getTime()}.pdf`, (err) => {
            if(!err){
                console.log('Successfully moved file')
            }

            fs.copyFileSync(req.file.path, `${cwd()}/docs/brd-b/current.pdf`)
            res.send(req.file)
        })
    }else{
        fs.copyFileSync(req.file.path, `${cwd()}/docs/brd-b/current.pdf`)
        res.send(req.file)
    }
})

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { username: user.localUser });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/login/callback'})
)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})