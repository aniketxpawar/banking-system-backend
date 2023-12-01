const users = require('../models/Users')
const Accounts = require('../models/Accounts')
const { ObjectId } = require('mongoose').Types;

const login = async (req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password) return res.status(200).json({message:"Incomplete Information"})
        const user = await users.findOne({email})
        // Ideally we should stored hash of the password and compare 
        // it with the hash of this password but for now we are doing it in plain text
        if(user.password !== password) return res.status(401).json({message:"Incorrect password"})
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
        const {id} = req.params;
        const transactions = await Accounts.find({userId:new ObjectId(id)})
        if(transactions.length == 0) return res.status(404).json({message:"No Transactions"})

        res.status(200).json(transactions)
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
            user.balance = user.balance + amount;
            await user.save();
            return res.status(200).json({message:`Amount Rs.${amount} Deposited`})
        }
        else if(type=='Withdrawal'){
            if(user.balance < amount) return res.status(400).json({message: "Insufficient Funds"})
            await Accounts.create({userId, type, amount})
            user.balance = user.balance + amount;
            await user.save();
            return res.status(200).json({message:`Amount Rs.${amount} Withdrawn`})
        }
        else{
            return res.status(400).json({message: "Invalid Type"})
        }

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports = {login, getTransactions, transaction}