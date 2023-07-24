const bcrypt = require("bcryptjs");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const crypto = require('crypto')
const SECRET = process.env.JWT_SEC;



const registerUser = async(userDets, role, res) =>{
    let nameNotTaken = await User.findOne({email: userDets.email}) ? false: true;

    if(!nameNotTaken){
        return res.status(400).json({
            message: `Username is already taken.`,
            success: false
        });
    }

    const hash = await bcrypt.hash(userDets.password, 10);

    const user = new User({
        email: userDets.email,
        name: "Abhishek",
        phone: "Hello",
        password: hash,
        uuid: crypto.randomUUID()
    }) 

    await user.save();



    res.status(200).json({
        message: `Registered`,
        success: true
    })
}


const loginUser = async (userDets, role, res) =>{
    let match = await User.findOne({email: userDets.email}) ? true: false;
    if(!match){
        return res.status(400).json({
            message: `Email incorrect.`,
            success: false
        });
    }

    const user = await User.findOne({email: userDets.email});


    if(user.role != role){
        return res.status(401).json({
            message: `Role does not match.`,
            success: false
        });
    }

    var isMatch;

    if(user.password){
        isMatch = await bcrypt.compare(userDets.password, user.password);
    } else{
        isMatch == false;
    }

    
    if(isMatch){
        let token = jwt.sign({
            user_id: user._id,
            role: user.role,
            email: user.email
            },
            SECRET,
            { expiresIn: "7 days" }
        )

        let result = {
            name: user.name,
            email: user.email,
            role: user.role,
            uuid: user.uuid,
            token: `Bearer ${token}`,
            expiresIn: 168
        }

        return res.status(200).json({
            ...result,
            message: 'Login Successful',
            success: true
        })
        
    } else{
        return res.status(403).json({
            message: `Password does not match.`,
            success: false
        });
    }
}

const userAuth = passport.authenticate("jwt", { session: false });


module.exports = {
    registerUser,
    loginUser,
    userAuth
}