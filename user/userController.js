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
        res.status(200).json({message:"Login Successful",token})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getTransactions = async(req,res) => {
    try{
        const {id} = req.params;
        console.log(id) 
        const transactions = await Accounts.find({userId:new ObjectId(id)})
        console.log(transactions)
        if(transactions.length == 0) return res.status(404).json({message:"No Transactions"})

        res.status(200).json(transactions)
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports = {login, getTransactions}