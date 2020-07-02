const mongoose =require('mongoose')


const validator = require('validator')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({ 
    
    //here User is just like class 
    name:{                           // name is field of class 
        type:String,                 // here we put condition what type of value any field can have type means what data type a value can have 
        required:true,                // required if ture means it is cumpulsary to enter this field while creating object
        trim:true,    
    },


    email:{
        type:String,
        require:true,
        unique:true,              // to make no two person can have same email
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error(" Email is invalid ")
            }
        }

    },


    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,
        validate(value){
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password contain the word password')
            }
        }

    },


    age:{
        type:Number,
        required:true,
        default:false,                  // default if ture then any random value is assign to this age property if not provided while creating object
        validate(value){
            if (value<0){
                throw new Error(" age must be a postive number ")
            }
        }
        
    },

    profile_pic:{
        type:Buffer
    },


    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]


},{
    timestamps:true
})


/////////////////hash the plain text password ///////////////////////////

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password , 8)
    }

    next()
})

//////////////find by credentials function ///////////////////////////


userSchema.statics.findByCredentials = async (email ,password)=>{

    const user = await User.findOne({ email })

    if (!user)
    {
        throw new Error('unable to log in')
    }

    const ismatch = await bcrypt.compare(password,user.password)

    if (!ismatch)
    {
        throw new Error('unable to log in')
    }

    return user

}

/////////////function to generate token //////////////////////////

userSchema.methods.GenerateAuthenticateToken = async function(){
    const user = this 

    const token = jwt.sign({_id:user._id.toString()}, 'amitSecretKey')

    // user.tokens = user.tokens.concate({token:token})
    user.tokens = user.tokens.concat({ token })

    await user.save()

    return token

}

//////////used to protect the important document/////////////////
//////////from individual user /////////////////////////////////
userSchema.methods.GetPublicProfile = function (){
    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    // delete userObject.profile_pic
    return userObject
}



const User = mongoose.model('User',userSchema)

module.exports = User
