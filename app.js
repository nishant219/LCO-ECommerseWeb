const express = require("express");
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const googlePassportConfig=require("./passport/googlePassport");
const passport = require("passport");
const cookieSession = require("cookie-session");

app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:[process.env.COOKIE_KEY]
}))


app.use(passport.initialize());
app.use(passport.session());

//for swagger documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//cookie and file middleware
app.use(cookieParser());
//to store temp files 
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/temp/",
}));



//morgon middleware
//app.use(morgan(':id :method :url :response-time'));  //bunch of modifications present in morgon
app.use(morgan("tiny"));


//import all routes here
const home = require("./routes/home");
const user = require("./routes/user");
const product = require("./routes/product");
const payment= require("./routes/Payment");


//middlewares
// sends all this routes if present in the respective files
app.use("/api/v1", home);
app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", payment);

//export app
module.exports = app;
