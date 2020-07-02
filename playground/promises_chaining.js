require('../source/data_base_db/mongoose_source')

const User = require('../source/models/model_User')

User.findByIdAndUpdate('5ec8e408039e241b826a277b',{age:22}).then((val)=>{
    console.log(val)
    return User.countDocuments({age:22})
}).then((val1)=>{
    console.log(val1)
}).catch((error)=>{
    console.log(error)
})