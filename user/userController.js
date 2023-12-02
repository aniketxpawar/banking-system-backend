const users = require('../models/Users')
const Accounts = require('../models/Accounts')
const { ObjectId } = require('mongoose').Types;
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

const login = async (req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password) return res.status(201).json({message:"Incomplete Information"})
        const user = await users.findOne({email})
        if(!user) return res.status(201).json({message:"User Not Found"})
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

const getTransactions = async(req,res) => {
    try{
        const {userId} = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId format' });
          }
        const transactions = await Accounts.find({userId:new ObjectId(userId)})
        if(transactions.length == 0) return res.status(201).json({message:"No Transactions"})

        res.status(200).json(transactions)
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getBalance = async(req,res) => {
    try{
        const {userId} = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId format' });
          }
        const user = await users.findById(userId)
        if(!user) return res.status(201).json({message:"User Not Found"})
        res.status(200).json({balance: user.balance})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const transaction = async(req,res) => {
    try{
        const {userId, amount, type} = req.body
        const user = await users.findById(userId)        
        if(type=='Deposit') {
            await Accounts.create({userId, type, amount})
            user.balance = user.balance + parseFloat(amount);
            await user.save();
            return res.status(200).json({message:`Amount Rs.${amount} Deposited`})
        }
        else if(type=='Withdraw'){
            if(user.balance < amount) return res.status(400).json({message: "Insufficient Funds"})
            await Accounts.create({userId, type, amount})
            user.balance = user.balance - parseFloat(amount);
            await user.save();
            return res.status(200).json({message:`Amount Rs.${amount} Withdrawn`})
        }
        else{
            return res.status(201).json({message: "Invalid Action Type"})
        }

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports = {login, getTransactions, getBalance, transaction}