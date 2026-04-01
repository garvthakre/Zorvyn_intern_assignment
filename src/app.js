import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
const app = express();

app.use(express.json());

app.get('/health',(req,res)=> {
    res.json({status : 'ok' , message : 'Server is running'})
})
app.use(errorHandler);
const start = async () => {
  await connectDB()
  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`)
  })
}

start()

export default app