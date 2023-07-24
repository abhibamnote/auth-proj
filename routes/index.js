const router = require('express').Router();

const authRoutes = require('./auth');
const sendEmail = require('../mail/mail');
// Controllers here

router.use('/auth', authRoutes);

router.get('/secretpage', (req, res)=>{
    res.render('secret');
})

router.get('/sendMail', async (req, res)=>{
    await sendEmail();

    res.status(200).send("Sent");
})

router.get('/', (req, res)=>{

    res.send("Hello");
})



module.exports = router;