const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.authentication = (req,res,next)=>{
    try {
        const token = req.header('Authorization');
        const user = (jwt.verify(token , 'itstoken' ))

        User.findById(user.userId).then(foundUser=>{
            if(!foundUser){
                next("user not found with specified token");
            }
            req.user = foundUser ;
            next();
        })
        
    } catch (error) {
        res.status(500).json(error)
    }
}