const express = require("express");
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");


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


//middlewares
// sends all this routes if present in the respective files
app.use("/api/v1", home);
app.use("/api/v1", user);
app.use("/api/v1", product);

//export app
module.exports = app;
