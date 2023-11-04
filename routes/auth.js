const router = require('express').Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const Otp = require("../models/Otp");
const crypto = require('crypto');
const SECRET = process.env.JWT_SEC;
const sendEmail = require('../mail/mail');


// Controllers here
const {
    registerUser,
    loginUser,
    userAuth
} = require('../controllers/auth');




router.get('/user/signup', (req, res)=>{
    res.render('signup');
})

router.post('/user/signup', async (req, res)=>{
    await registerUser(req.body, "user", res);
});

router.get('/user/login', (req, res)=>{
    res.render('log');
})

router.post('/user/login', async (req, res)=>{
    await loginUser(req.body, "user", res);
});

router.get('/login-google',  passport.authenticate("google", { scope: ['profile', 'email'] }))

router.get('/google/cb',  passport.authenticate("google", {
    failureRedirect:`/auth/login`,
   }), (req, res) => {

    const generateToken = (user_id, role, email) => {
      return jwt.sign({ user_id, role , email}, SECRET, {
        expiresIn: "7 days",
      });
    };


    const user = {
        _id: req.user._id,
        role: req.user.role,
        email: req.user.email,
        token: generateToken(req.user._id, req.user.role, req.user.email),
      } 

     res.redirect(
        `/auth/login-success/${user.token}`
      );
})


router.get('/login-success/:token', (req, res)=>{
    res.status(200).render('success');
})

router.get('/secret', (req, res)=>{
    res.render('secret');
})

router.get('/secret-api', passport.authenticate("jwt", { session: false }), (req, res) =>{
    res.status(200).json({
        message: "The secret is displayed here."
    });
})

router.get('/forgot-password', (req, res)=>{
    res.status(200).render("forgot");
})

router.post('/forgot-password', async (req, res)=>{
    const user = await User.findOne({email: req.body.email});

    
    if(user){
        const getOtp = () =>{
            var x = Math.floor(1000 + Math.random() * 9000);
        
            return x;
        }
    
        const newOtp = new Otp({
            email: req.body.email,
            otp: getOtp(),
            updatedAt: Date.now()
        })
    
        const findEntry = await Otp.findOne({email: req.body.email}) ? true : false;
        
        let otpEdit = getOtp();

        if(findEntry){
            sendEmail(otpEdit, req.body.email)
            token = await Otp.findOneAndUpdate({email: req.body.email},{otp: otpEdit});
        } else{
            sendEmail(newOtp.otp, req.body.email)
            token = await newOtp.save();
        }



        res.status(200).json({
            message: "OTP sent to registered mail id."
        });
    } else{
        res.status(403).json({
            message: "User not found"
        })
    }

})

router.post('/forgot-password/otp', async (req, res)=>{
    const {email, otp, password} = req.body;

    const otpServer = await Otp.findOne({email: email});

    if(otpServer.otp == otp){

        const hash = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate({email: email}, {password: hash});



        res.status(200).json({
            message: "Password Updated"
        })
    } else{
        res.status(403).json({
            message: "OTP incorrect"
        })
    }

})




module.exports = router;