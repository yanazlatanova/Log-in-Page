const express = require('express') // Set up express
const app = express() // Set up express
const database = require("./database.js"); // Database instance
const jwt = require('jsonwebtoken') // Token
const bcrypt = require('bcrypt') // For Sensitive Data Encryption
require('dotenv').config()


// Set up View
app.set('view-engine', 'ejs') // tell express app to use view-engine and ejs
app.use(express.urlencoded({ extended: false })) //when extended property is set to false, the URL-encoded data will instead be parsed with the query-string library.
app.use(express.json())

/*// For cross platform requests
const cors = require('cors')  //allows sending requests to the api server
app.use(express.json())
app.use(cors({ origin: "*", }))*/

var current_Token = ""
var current_Username = ""

// LISTENING ON PORT 
app.listen(5000, () => { console.log("Server listening on port: " + 5000); })


function verifyAdmin(req, res, next) {

   // console.log('current_Token ', current_Token);
   // console.log('Is jwt verified ', jwt.verify(current_Token, process.env.ACCESS_TOKEN_SECRET));

   if (current_Username == "") {
      res.redirect("/login/error")      
   } else if (current_Username == "admin") {
      next()
   } else {
      res.redirect("/login/error")
   }
   // console.log("we are in the authentication controll function");
   // next()   
}

app.get('/admin', verifyAdmin, async (req, res) => {
   var users = await database.getUsers()
   res.render('admin.ejs', { users: users })
})

app.get('/', async (req, res) => {
   res.redirect("/login")
})

app.get('/login', async (req, res) => {
   res.render('login.ejs', { error: '' })
})


app.get('/login/error', async (req, res) => {   
   // Print an error msg if the user wants to access pages without logged in
   res.render('login.ejs', { error: "Denied access! Please, try to log in with a different role!" })
})

function authenticateToken(req, res, next) {

   // console.log('current_Token ', current_Token);
   // console.log('Is jwt verified ', jwt.verify(current_Token, process.env.ACCESS_TOKEN_SECRET));

   if (current_Token == "") {
      res.redirect("/login/error")      
   } else if (jwt.verify(current_Token, process.env.ACCESS_TOKEN_SECRET)) {
      next()      
   } else {
      res.redirect("/login/error")
   }
   // console.log("we are in the authentication controll function");
   // next()   
}

app.get('/granted', authenticateToken, async (req, res) => {
   // The program runs first authenticateToken()
   // And continues here if next() called
   res.render('start.ejs')
})

app.post('/login', async (req, res) => {

   try {
      // Get the first user with the same username
      var user = await database.getUserByName(req.body.username)

      // Dose user exist and is password correct
      if (user != null && await bcrypt.compare(req.body.password, user.password)) {

         // Create a signed token
         const payload = {
            username: user.username,
            password: user.password
         }

         // Create and log the token
         var token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
       
         // Save the user session info
         current_Token = token
         current_Username = user.username

         // Successful log in
         if (current_Username == "admin") {
            res.redirect("/admin")
         } else {
            res.redirect("/granted")
         }
         
      } else {
         // Failed log in
         res.render('fail.ejs')
      }

   } catch (error) {
      console.log(error)
   }

})






/*
// GET
app.get('/', async (req, res) => {
   res.redirect("/login")
})

app.get('/login', async (req, res) => {
   res.render('login.ejs')
})

app.get('/register', async (req, res) => {
   res.render('register.ejs')
})

app.get('/admin', async function (req, res) {

   var users = await database.getUsers()

   res.render('admin.ejs', { users: users })
})

// POST
app.post('/register', async (req, res) => {

   try {
      
      // Encrypt password
      let encryptedPassword = await bcrypt.hash(req.body.password, 10)

      // Add the new user
      database.addUser(req.body.username, encryptedPassword)


   } catch (error) {
      console.log(error)
   }

   req.method = 'GET'
   res.redirect("/login")
})

app.post('/login', async (req, res) => {

   try {
      // Get the first user with the same username
      var user = await database.getUserByName(req.body.username)

      // Dose user exist and is password correct
      if (user != null && await bcrypt.compare(req.body.password, user.password)) {

         // Create a signed token
         const payload = {
            username: user.username,
            password: user.password
         }

         // Create and log the token
         var token = jwt.sign(payload, process.env.TOKEN)
         console.log(token)

         // Successful log in
         res.render('start.ejs', { username: user.username })

      } else {
         // Failed log in

         res.render('fail.ejs')
      }

   } catch (error) {
      console.log(error)
   }

})*/