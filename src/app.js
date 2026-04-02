import express from "express";
import morgan from "morgan"
import swaggerUi from 'swagger-ui-express'
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import recordRoutes from "./modules/records/records.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import { swaggerSpec,connectSwagger } from "./config/swagger.js";
import { apiLimiter, authLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

const app = express();

app.use(express.json());
app.use(morgan('dev'))

app.get('/health',(req,res)=> {
    res.json({status : 'ok' , message : 'Server is running'})
})

// general rate limiter for all API routes
app.use('/api', apiLimiter)


// API routes
app.use('/api/auth',authLimiter, authRoutes)
app.use('/api/users',userRoutes)
app.use('/api/records', recordRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Swagger documentation route
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(errorHandler);
const start = async () => {
  await connectDB()
  await connectSwagger()
  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`)
  })
}

start()

export default app