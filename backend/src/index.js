// require('dotenv').config()
import dotenv from 'dotenv'
import connectDB from './db/index.js';

dotenv.config({
    path: './env'
})

connectDB();



























/*

import express from 'express'

const app = express()

//DATABASE CONNECTION Using IIFE first () is for function and second () is for invoking it or running it immediately
;( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("Error", (error) => {
            console.log("Error",error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ",error);
        throw error 
    }
})()

*/