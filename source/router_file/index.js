const express = require('express')
require('../data_base_db/mongoose_source')
const User = require('../models/model_User')

const auth = require('../middleware/auth')

const sharp =require('sharp')

const multer = require('multer')

const app = express()

const router =express.Router()

const port = process.env.PORT || 3000

app.use(express.json())

////////////////post request  without async and await //////////////////////

// app.post('/user',(request,response)=>{

//     const user = new User(request.body)
//     user.save().then((val)=>{
//         console.log(val)
//     }).catch((error)=>{
//         console.log(error)
//     })

//     response.send('Testing ! ')
// })

/////////////////Post request using async and await //////////////////

app.post('/user', async (request ,response)=>{

    const user =new User(request.body)
    //console.log(user)
    
    try{

        await user.save()
        const token =await user.GenerateAuthenticateToken()
        console.log(token)
        response.status(200).send({user:user.GetPublicProfile(),token})

    } catch(error) {
        response.status(400).send(error)
    }



})

//////////////////Get request without using async and await ///////////////////////
// app.get('/user' ,(request,response)=>{
//     User.find({}).then((val)=>{
//         response.send(val)
//     }).catch((error)=>{
//         response.status(500).send()
//     })
// })

///////////////Get request with using async and await /////////////////////////

app.get('/user',auth, async (request ,response)=>{

    /// this is used to set default request quary if not given

    const { page = 1, limit = 4 } = request.query;


    try {
        let l = []
        const user = await User.find({}) .limit(limit * 1).skip((page - 1) * limit).exec();

        // get total documents in the user collection 
        const count = await User.countDocuments();


        user.forEach((single_user) => {
            l.push(single_user.GetPublicProfile())
        });
        response.status(200).send({l,totalPages: Math.ceil(count / limit),currentPage: page})
    }
    catch(error){
        response.status(500).send(error)
    }
})
///////// for profile ///////////////


app.get('/user/me',auth,async(request,response)=>{
    response.send({user:request.user.GetPublicProfile()})
})

//////// for profile piture of user //////////////
const upload = multer({
    
    //for uploading file to profile_img folder uncomment the dest:'profile_img' portion
    //for uploading image into database make sure that dest:'profile_img' section is commented 
    //dest:'profile_img',
    limits:8000000,
    fileFilter(request,file,cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)){
            return cb(new Error('please upload image'))
        }
        cb(undefined,true)
    }
})

app.post('/user/me/profile_pic',auth ,upload.single('profile_pic') ,async(request,response)=>{

    const buffer = await sharp(request.file.buffer).resize({height:250,width:250}).png().toBuffer()

    request.user.profile_pic = buffer
    await request.user.save()
    response.send()

},(error ,request, response ,next)=> {
    response.status(400).send({error:error.message})
})
////delete profile_photo///////

app.delete('/user/me/delete', auth,async (request,response)=>{
    request.file.buffer=undefined
    await request.user.save()
    response.send()
})

////get user img using url /////////////

app.get('/user/:id/profile_pic',async (request,response)=>{
    try{
        const user = await User.findById(request.params.id)

        if (!user || user.profile_pic)
        {
            throw new Error('')
        }

        response.set('content-type','image/png')
        response.send(user.profile_pic)
    }
    catch(error)
    {
        response.status(404).send()
    }
})

/////////// upload file //////////////////////////

const upload1 = multer({
    dest:'upload_file',
    limits:10000000,
    fileFilter(request,file,cb){
        if (!file.originalname.match(/\.(doc|docx|pdf)$/)){
            return cb(new Error('please upload pdf'))
        }
        cb(undefined,true)
    }


})

app.post('/user/me/file', upload1.single('file') ,(request,response)=>{

    response.send()

},(error ,request, response ,next)=> {
    response.status(400).send({error:error.message})
})



////////////Get request to find element in database using GetElementById//////////////////
////////////without using async and await ////////////////////////////////////////////////

// app.get('/user/:id' ,(request,response)=>{

//     const _id = request.params.id

//     User.findById(_id).then((val)=>{
//         if (!val){
//             response.status(404).send()
//             console.log("Error 404")
//         }

//         response.send(val)

//     }).catch(()=>{
//         response.status(500).send()
//         console.log("error : 500")
//     })
//     // console.log(request.params)
// })
////////////Get request to find element in database using GetElementById//////////////////
////////////using async and await ////////////////////////////////////////////////

/////using this may create security threate to all ///////////////////
// app.get('/user/:id', async (request,response)=>{

//     const _id = request.params.id

//     try {
//             const user  = await User.findById(_id)
//             if(!user){
//                 return response.status(404).send()
//                 //console.log("Error 404")
//             }

//             response.send({user:user.GetPublicProfile()})

//     }
//     catch(error){
//         response.status(500).send()
//         console.log("error : 500")
//     }


// })

//////////////update database with help of find element by id and update /////////////////////

app.patch('/user/me',auth, async (request,response)=>{

    //////////this portion of code is used to check if key is present or not 
    let b=0,c='';
    const arr_p = Object.keys(request.body)
    const arr =['name' , 'age', 'email','password']
    for (let i =0 ;i<arr_p.length ;i++)
    {
        let a=0;
        for (let j=0 ;j<arr.length ;j++)
        {
            if (arr_p[i]==arr[j])
            {
                a=1;
                break;
            }
        }
        if (a===0)
        {
            c=c+arr_p[i]
            b=1
            break;
        }
    }
    if (b===1)
    {
        console.log("can't find key to update : "+c)
        return response.status(404).send("can't find key to update : "+c)
    }
    const id = request.params.id

    try{

        const user = request.user
        for (let i=0 ;i<arr_p.length ;i++)
        {
            user[arr_p[i]] = request.body[arr_p[i]]
        }
        await user.save()

        //const user = await User.findByIdAndUpdate(request.params.id,request.body , {new :true , runValidators:true}) // 1st parameter is used to find user and 2nd parameter is used to update at specific id 

        if(!user){
            return response.status(404).send('User not found')
        }

        response.send({user:user.GetPublicProfile()})
    }
    catch(error){
        console.log("ERROR")
        response.status(400).send('Error  :' + error)
    }

})


/////////////////////to delete user by id /////////////////////

app.delete('/user/me',auth,async (request,response)=>{
    const id = request.user._id

    try{
        // const user = await User.findByIdAndDelete(id)

        // if(!user)
        // {
        //     response.status(404).send()
        // }

        await request.user.delete()

        response.send(request.user)
    }
    catch(error)
    {

        response.send(error)

    }
})

////////// for log in ///////////////////

app.post('/user/login', async (request,response)=>{

    try
    {
        const user = await User.findByCredentials(request.body.email ,request.body.password)

        const token = await user.GenerateAuthenticateToken()
        console.log(token)

        response.send({user:user.GetPublicProfile(),token})
    }
    catch(error)
    {
        response.status(400).send()
    }

})

app.post('/user/logout',auth,async (request,response)=>{

    try
    {
        request.user.tokens = request.user.tokens.filter((val)=>{
            return val.token !==request.token
        })

        await request.user.save()

        response.send('logout')

    }
    catch(error)
    {
        response.status(500).send()
    }
})





app.listen(port, ()=>{
    console.log('server is up on port '+port)
})
