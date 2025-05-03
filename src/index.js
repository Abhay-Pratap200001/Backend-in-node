// require ('dotenv').config({path: './env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
    path: './env'
});

connectDB()
let appListning = (process.env.PORT)
.then(() =>{
    app.listen(appListning || 3000, () =>{
        console.log(`Server is running ata port: ${appListning}`);
        
    })
})
.catch((error) =>{
 console.log("MONGO DB connection error", error);
 
})

