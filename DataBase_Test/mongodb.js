// CRUD create read update and delete

const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient



const connectionURL = 'mongodb://127.0.0.1:27017'
const databasename = 'Task-manager'



const Obj_id = mongodb.ObjectID
console.log(Obj_id())


MongoClient.connect(connectionURL,{ UseNewUrlParser: true },(error,client)=>{

    if (error){
        return console.log('unable to connect to data bases')
    }

    // console.log('connected correctly !')
 


    const db = client.db(databasename)



// creation of data base /////////////////////////////////////////////
    //use to insert one object at a time
    // db.collection('User').insertOne({

    //     name:'Amit',
    //     age:22,
    //     college:'Indian institute of information Technology'

    // },(error,result)=>{
    //     if (error){
    //         return console.log(' unable to insert user ')
    //     }

    //     console.log(result.ops)
    // })


    // this is used to insert many object at same time /////////////////////////////////

    // db.collection('User').insertMany([{
    //     name:'shweta',
    //     roll_no:2187,
    //     collage:'IERT'
    // },{
    //     name:'usha',
    //     roll_no:2314,
    //     collage:'USMS'
    // }   
    // ],(error,result)=>{
    //     if (error){
    //         return console.log('unable to insert many object in user')
    //     }

    //     console.log(result.ops)


    // })

// reading of data base ////////////////////////////////////////

    //reading from Task-manager Database for one spacific val 

    // db.collection('user').findOne({ _id:new Obj_id("5ec55004bb87165a358497e4"),} ,(error,val)=>{
    //     if (error){
    //         return console.log("Error unable to fetch")
    //     }

    //     console.log(val)
    // })

    ////////// reading from Task-manger Database using find 

    // db.collection('user').find({name:"Amit"}).toArray((error,val)=>{
    //     if (error){
    //         console.log("Error : unable to featch")
    //     }

    //     console.log(val)

    // })
    // db.collection('user').find({name:"Amit"}).count((error,val)=>{
    //     if (error){
    //         console.log("Error : unable to featch")
    //     }

    //     console.log(val)

    // })


    //////////////////////////Update data base /////////////////////

    // const Update_pro = db.collection('user').updateOne({
    //     _id:new Obj_id("5ec53d6b85f02b4fc376c0c7")
    // },{
    //     $set:{
    //         name:"Amit_1_new_updated_name"
    //     },    
    //     $inc:{
    //         age:1
    //     }
    
        


    // })

    // Update_pro.then((val)=>{
    //     console.log(val)
    // }).catch((error)=>{
    //     console.log("Error : not updated")
    // })

    ////////////////////// delete data from data base //////////////////

    db.collection('User').deleteMany({
        age:22

    }).then((val)=>{
        console.log(val)
    }).catch((error)=>{
        console.log("Error : cannot delete object from database")
    })

})