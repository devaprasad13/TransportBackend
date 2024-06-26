const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const UserModel = require('./modals/Users')
const RouteModel = require('./modals/Routing')
require('dotenv').config()
const app= express()
app.use(cors(
    {
        origin:["http://localhost:3000","https://main-project-omega.vercel.app"],
        method:["GET","POST"],
        credentials:true,
    }
))
app.use(express.json())
app.use(cookieParser())
const port = process.env.PORT || 3001
mongoose.connect("mongodb+srv://deva:deva@mern.gizrqwt.mongodb.net/MERN")
//add function

app.post('/log',(req,res)=>
{
    const{email,password} = req.body;
    UserModel.findOne({email: email})
    .then(user=>
        {
            if(user)
            {
                 bcrypt.compare(password,user.password,(err,response)=>
                {
                    if(response)
                    {
                        const token = jwt.sign({email:user.email,role:user.role},"jwt-secret-key",{expiresIn:'1d'})
                         res.cookie('token',token)
                        return res.json({Status:"Success",role:user.role})
                       
                    }
                    else
                    {
                       return res.json("the password is incorrect")
                    }
                })
                 
            }
            else
            {
                res.json("No account exist");
            }
        })

})
app.post("/user",(req,res)=>
{
    const{ name, email, password, roll, year, role, phone,bus,boarding} = req.body;
     bcrypt.hash(password,10)
     .then(hash=>
    {
       UserModel.create({name, email, password:hash, roll, year, role, phone,bus,boarding})
       .then(res=>res.json("Success"))
       .catch(err=>res.json(err))
    }).catch(err=>res.json(err))
})



// view function
app.get('/getUser',(req,res)=>
{
    UserModel.find({})
    .then(users=>res.json(users))
    .catch(err => res.json(err))
})
//Update Function
app.get('/getUp/:id',(req,res)=>
{
    const id = req.params.id;
    UserModel.findById({_id:id})
    .then(users=>res.json(users))
    .catch(err => res.json(err))
})
app.put('/Up/:id',(req,res)=>
{
    const id = req.params.id;
    UserModel.findByIdAndUpdate({_id:id},{name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        roll:req.body.roll,
        year:req.body.year,
        role:req.body.role,
        phone:req.body.phone,
        bus:req.body.bus,
        boarding:req.body.boarding})
    .then(users=>res.json(users))
    .catch(err => res.json(err))
})
//delete function
app.delete('/deleteUser/:id',(req,res)=>
{
    const id = req.params.id;
    UserModel.findByIdAndDelete({_id:id})
    .then(users=>res.json(users).status(200))
    .catch(err => res.json(err))
})
//Add Routes

app.post("/rou", async (req, res) => {
    
    try
    {
         const newRoute = new RouteModel(req.body)
         await newRoute.save();

         res.status(200).json({message:"route add succesffully"})
    }
    catch(error)
    {
       console.log("Error",error)
       res.status(500).json({error:"Failed to add route"})
    }
});
//search result
app.post("/it",async(req,res)=>
{
    try
    {
        const{from,to,bus} = req.body
        const searchresult = await RouteModel.find(
            {
                from:from,
                to:to,
                bus:bus,
            }
        )
        res.status(200).json(searchresult)
        console.log(searchresult)
    }
    catch(error)
    {

        console.log("error",error)
         res.status(500).json({erro:"Failed to add route"})
    }
})


//count
app.get('/count', async (req,res)=> 
{
    try
    {
        const counter = await UserModel.countDocuments();
        res.json({counter});
        
    }
    catch(err)
    {
        res.status(500).json({error:err.message})  
    }
 
})

app.listen(port,()=>
{
    console.log("server is Running")
})