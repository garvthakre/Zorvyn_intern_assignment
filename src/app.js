import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import recordRoutes from "./modules/records/records.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { record } from "zod";
const app = express();

app.use(express.json());

app.get('/health',(req,res)=> {
    res.json({status : 'ok' , message : 'Server is running'})
})
app.use('/api/auth', authRoutes)
app.use('/api/users',userRoutes)
app.use('/api/records', recordRoutes)
app.use(errorHandler);
const start = async () => {
  await connectDB()
  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`)
  })
}

start()

export default app