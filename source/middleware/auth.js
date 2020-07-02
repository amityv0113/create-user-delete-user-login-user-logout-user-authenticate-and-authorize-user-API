const jwt = require('jsonwebtoken')

const User = require('../models/model_User')



const auth =async(request,response ,next) => {
    
    try
    {
        /// get the token from header request from client side /////////
        const token = request.header('Authorization').replace('Bearer ','')

        // console.log(token)
        
        /// decode the token with security signature 
        const decoded = jwt.verify(token,'amitSecretKey')
        console.log(decoded)

        //////find user with help of decoded value 
        const user = await User.findOne({_id:decoded._id,'tokens.token':token})

        // console.log(user)

        if (!user)
        {
            ///////used to throw error////////
            throw new Error
        }
        request.token = token

        request.user = user
        
        console.log(request.user)
        console.log(request)
        //to execute the futher quary 
        next()

    }
    catch(error)
    {
        response.status(401).send({error:'please authenticate'})
    }
}

module.exports = auth