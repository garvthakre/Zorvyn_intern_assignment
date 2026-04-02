import swaggerJsdoc from 'swagger-jsdoc'
import { env } from './env.js'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Dashboard API',
      version: '1.0.0',
      description: 'Role based finance dashboard backend. Use /api/auth/login to get a JWT token then click Authorize to test protected routes.',
    },
    servers: [
      {
        url: 'https://zorvyn-intern-assignment.onrender.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.js'],
}

export const swaggerSpec = swaggerJsdoc(options)

export const connectSwagger = async () => {
   console.log(`Swagger docs at ${env.appUrl}/api/docs`)
}
