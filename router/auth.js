import express from 'express';
import '../db/conn.js';
import User from '../model/user.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import authenticate from '../middleware/authenticate.js'

const router = express.Router() 

router.get('/', (req, res) => {
    res.send(`Hello from the server from ROUTER/auth.js.`)
})

//USING PROMISES
// router.post('/register', (req, res) => {
//     const { name, email, phone, work, password, cpassword} = req.body;
    
//     if(!name || !email || !phone || !work || !password || !cpassword ){
//         return res.status(422).json({error: "Please fill the column"})
//     }

//     User.findOne({email: email})
//     .then((userExist) => {  
//         if(userExist) {
//             return res.status(422).json({error: "Email already exist."})
//         }
//         const user = new User({name, email, phone, work, password, cpassword})
        
//         //this user is a document 
//         user.save()
//         .then(() => {
//             res.status(201).json({message: "user registered successfully"});
//         })
//         .catch((err) => res.status(500).json({error: "Failed to register"}))
//     }).catch((err) => {console.log(err); });
// })



//USING ASYNC AND AWAIT
router.post('/register', async(req, res) => {
        const { name, email, phone, work, password, cpassword} = req.body;
        
        if(!name || !email || !phone || !work || !password || !cpassword ){
            return res.status(422).json({error: "Please fill the column"})
        }

        try{
            const userExist = await User.findOne({email: email})

            if(userExist) {
                return res.status(422).json({error: "Email already exist."})
            }else if (password != cpassword) {
                return res.status(422).json({error: "Password are not matching"})
            }else {
                const user = new User({ name, email, phone, work, password, cpassword})

            //hashing before saving 

            await user.save();

            res.status(201).json({message: "user registered successfully"});
            }
    }
    catch(err){
        console.log(err);
    }
})


//login route 
router.post('/signin' , async(req,res) => {
    try {
        const { email, password } = req.body;
        
        if(!email || !password){
            return res.status(400).json({error: "Please fill the data"})
        }

        const userLogin = await User.findOne({ email : email});

        // console.log(userLogin);
        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password); 

            const token = await userLogin.generateAuthToken();

            console.log(token);

            res.cookie("jwtoken", token, {
                expires:new Date(Date.now() + 25892000000) ,
                httpOnly: true
            });

            if(!isMatch){
                res.status(400).json({ error: "Invalid Credentials"})
            }
            else{
                res.json({ message: "User signin succesful. "})
            }

        }else{
                res.json({ message: "Invalid Credentials"})
            
        }
    }
    catch (err){
        console.log(err); 
    }
})


//about us route
router.get('/about', authenticate, (req, res) => {      //authenticate is middleware here 
    console.log(`Hello my about`)
    res.send(req.rootUser)
})

//get user data for contact us and home page 
router.get('/getdata', authenticate, (req, res) => {
    console.log(`Hello my contact`)
    res.send(req.rootUser)
})


//message save gaeko 
router.post('/contact', authenticate, async(req, res) => {
    try{
        const {name, email, phone, message } = req.body

        if( !name || !email || !phone || !message ) {
            console.log("Error in contact form");
            return res.json({ error: "Please fill the contact form "})
        } 
        const userContact = await User.findOne({ _id:req.userID})

        if(userContact){
            const userMessage = await userContact.addMessage(name, email, phone, message);

            await userContact.save();

            res.status(201).json({message: "user contact success"})
        }
    } 
    catch (error){
        console.log(error);
    }
})


//logout route
router.get('/logout', (req, res) => {      //authenticate is middleware here 
    console.log(`Hello my Logout Page`)
    res.clearCookie('jwtoken', {path: '/'})
    res.status(200).send('User Logout')
})
    

export default router;







// {
//     "name" : "Bhishan Bhandari",
//     "email" : "bbhishan123@gmail.com",
//     "phone": "9952635511",
//     "work": "web dev",
//     "password": "123Ak",
//     "cpassword": "123Ak"
// }




