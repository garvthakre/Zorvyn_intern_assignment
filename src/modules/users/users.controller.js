import * as UsersService from './users.service.js'
import { ApiResponse } from '../../utils/ApiResponse.js'

// Controller functions for user management routes
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UsersService.getAllUsers()
    res.json(new ApiResponse(200, users, 'Users fetched'))
  } catch (error) {
    next(error)
  }
}

// Controller function to get a single user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await UsersService.getUserById(Number(req.params.id))
    res.json(new ApiResponse(200, user, 'User fetched'))
  } catch (error) {
    next(error)
  }
}

// Controller function to update a user's role
export const updateUserRole = async (req, res, next) => {
  try {
    const user = await UsersService.updateUserRole(Number(req.params.id), req.body.role)
    res.json(new ApiResponse(200, user, 'User role updated'))
  } catch (error) {
    next(error)
  }
}

// Controller function to update a user's status (active/inactive)
export const updateUserStatus = async (req, res, next) => {
  try {
    const user = await UsersService.updateUserStatus(Number(req.params.id), req.body.status)
    res.json(new ApiResponse(200, user, 'User status updated'))
  } catch (error) {
    next(error)
  }
}

// Controller function to delete a user by ID
export const deleteUser = async (req, res, next) => {
  try {
    await UsersService.deleteUser(Number(req.params.id))
    res.json(new ApiResponse(200, null, 'User deleted'))
  } catch (error) {
    next(error)
  }
}