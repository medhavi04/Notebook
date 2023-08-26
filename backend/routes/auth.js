const express=require('express')
const router=express.Router()
const User= require('../models/Users');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET="megha@sharma@2003"
const fetchuser=require('../middleware/fetchuser')

// ROUTE 1: Create a User using: POST "/api/auth/createuser". Doesn't require authentication(No Login required)
router.post('/createuser',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({ min: 5 })
], async (req,res)=>{
    let success=false;
    // console.log(req.body);
    // let userid=req.params.userid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    try {
    let user= await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({success,error:"Sorry a user with this email already exists"})
    }

    const salt=await bcrypt.genSalt(10);
    const secPass=await bcrypt.hash(req.body.password,salt)
    user = await User.create({
        username: req.body.username,
        password: secPass,
        email: req.body.email,})
        //     .then(user => res.json(user))
        //   .catch(err=>{console.log(err)
        //   res.json({error:'Please enter a unique value for email',message: err.message})})   
        const data={
            user:{
                id:user.id
            }
        }
        const authToken=jwt.sign(data,JWT_SECRET);
        success=true;
    res.json({success,authToken});// No need to write like {authToken: authToken}
} catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error")
}
})

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". (No Login required)
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists()
], async (req,res)=>{
    let success=false;
    // console.log(req.body);
    // let userid=req.params.userid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email,password}=req.body;
    try {
        let user= await User.findOne({email});
        if(!user){
            return res.status(400).json({success,error:"Please try to login with correct credentials"})
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({success,error:"Please try to login with correct credentials"})
        }
        const data={
            user:{
                id:user.id
            }
        }
    const authToken=jwt.sign(data,JWT_SECRET);
    success=true;
    res.json({success,authToken});
    } catch (error) {
        console.log(error.message);
    res.status(500).send("Internal Server Error")
    }
})

// ROUTE 3: Get logged in User Details using: POST "/api/auth/getuser". Login required.
router.post('/getuser', fetchuser, async (req,res)=>{
    try {
        userId=req.user.id;
        const user=await User.findById(userId).select("-password");
        res.send(user);
    // const authToken=jwt.sign(data,JWT_SECRET);
    // res.json({authToken});
    } catch (error) {
        console.log(error.message);
    res.status(500).send("Internal Server Error")
    }
})
module.exports=router