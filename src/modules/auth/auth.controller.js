import * as AuthService from './auth.service.js'
import { ApiResponse } from '../../utils/ApiResponse.js'

export const register = async (req, res, next) => {
  try {
    const result = await AuthService.register(req.body)
    res.status(201).json(new ApiResponse(201, result, 'User registered successfully'))
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body)
    res.json(new ApiResponse(200, result, 'Login successful'))
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await AuthService.getMe(req.user.id)
    res.json(new ApiResponse(200, user, 'Profile fetched'))
  } catch (error) {
    next(error)
  }
}