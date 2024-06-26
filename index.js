import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import User from "./connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import {fileURLToPath} from "url";
import path,{dirname} from "path"
const __filename =fileURLToPath(import.meta.url);
const __dirname =dirname(__filename);

const app = express();
const PORT =3002;
const secretKey ="vikashSharma"

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.set("view engine","ejs");
app.use(express.static('public'));
app.use(express.static(path.join(__dirname,"public")))

app.get("/", (req, res) => {
  res.render("login",{errorMessage:null});
});

app.post("/login",async(req,res)=>{
    const username=req.body.username;
    const password = req.body.password;
    if(!username|| !password){
        return res.status(400).send("username and password is require")
    }
    const user =await User.findOne({username})
    if(!user){
        return res.status(400).send("user not fond")
       
    }
    const match =await bcrypt.compare(password,user.password);
    if(!match){
      return res.status(400).render('login',{errorMessage:'Invalid username or password'})
        // return res.status(400).send("password is incoorect")
    }
    const token =jwt.sign({id:user._id},secretKey,{expiresIn:'1h'});
    console.log(token)
    res.render("home")
    
})

app.get("/register", (req, res) => {
  res.render("register",{requireMessage:null});
});

app.post("/register",async(req,res)=>{
    const username=req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const email = req.body.email;

    if(!username|| !password|| !name|| !email){
        // return res.status(400).send("username and password is require")
      return res.status(400).render('register',{requireMessage:'username and password is require'})

    }
    const hashPassword =await bcrypt.hash(password,10);
    const user = new User({username,name,email,password:hashPassword})
    await user.save();
    console.log(username,password,name,username)
    res.status(200).send("dhv")
    // return res.status(200).render('register',{succesMessage:'User Register Succesfully'})


})

app.listen(PORT, () => {
  console.log(`app is listening on http://localhost:${PORT}`);
});