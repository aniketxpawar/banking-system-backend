const users = require('../models/Users')
const Accounts = require('../models/Accounts')
const Bankers = require('../models/Bankers')
const { ObjectId } = require('mongoose').Types;
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

const login = async (req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password) return res.status(201).json({message:"Incomplete Information"})
        const user = await Bankers.findOne({email})
        if(!user) return res.status(201).json({message:"Banker Not Found"})
        // Ideally we should stored hash of the password and compare 
        // it with the hash of this password but for now we are doing it in plain text
        if(user.password !== password) return res.status(201).json({message:"Incorrect password"})
        const token = await jwt.sign({ id: user._id, email }, process.env.JWT_KEY, {
            expiresIn: "2d",
          })
        res.status(200).json({message:"Login Successful",token, userId: user._id})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getAllUsers = async(req,res) => {
    try{
        const allUsers = await users.find({isActive:true})
        res.status(200).json(allUsers)
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getTransactions = async(req,res) => {
    try{
        const {userId} = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId format' });
          }
        const transactions = await Accounts.find({userId:new ObjectId(userId)})
        const user = await users.findById(userId)
        if(!user) return res.status(201).json({message:"User Not Found"})
        if(transactions.length == 0) return res.status(201).json({message:"No Transactions"})

        res.status(200).json({transactions, name: user.name, userId, balance: user.balance})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}




module.exports = {login, getTransactions,getAllUsers}