import * as UsersService from './users.service.js'
import { ApiResponse } from '../../utils/ApiResponse.js'

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UsersService.getAllUsers()
    res.json(new ApiResponse(200, users, 'Users fetched'))
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const user = await UsersService.getUserById(Number(req.params.id))
    res.json(new ApiResponse(200, user, 'User fetched'))
  } catch (error) {
    next(error)
  }
}

export const updateUserRole = async (req, res, next) => {
  try {
    const user = await UsersService.updateUserRole(Number(req.params.id), req.body.role)
    res.json(new ApiResponse(200, user, 'User role updated'))
  } catch (error) {
    next(error)
  }
}

export const updateUserStatus = async (req, res, next) => {
  try {
    const user = await UsersService.updateUserStatus(Number(req.params.id), req.body.status)
    res.json(new ApiResponse(200, user, 'User status updated'))
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    await UsersService.deleteUser(Number(req.params.id))
    res.json(new ApiResponse(200, null, 'User deleted'))
  } catch (error) {
    next(error)
  }
}