Start:
In the terminal run: npm run runServer
In the browser go to: http://localhost:5000/login


Admin Log in
username: admin
password: 1234

Users Log in
username: alex, mari, anton
Password: "test" for all users

Set Up:
npm install node.js
npm install express
npm install ejs

// For nodeman live server
npm install nodemon

// For encryption
npm install bcrypt

// Json Web token
npm install jsonwebtoken

// Environment variable
npm install dotenv


About the JWT:
- JWT is formated like:
JSON header + "." + JSON payload + "." + Signature

- All componenst for JWT are encrypted with the issuer private key :)

- JWT can be changed only with the private key

- Standartized - It can be used for authmentication by all services that trust the issuer of the JWT