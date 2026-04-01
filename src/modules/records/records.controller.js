import * as RecordsService from './records.service.js'
import { ApiResponse } from '../../utils/ApiResponse.js'

export const createRecord = async (req, res, next) => {
  try {
    const record = await RecordsService.createRecord(req.body, req.user.id)
    res.status(201).json(new ApiResponse(201, record, 'Record created'))
  } catch (error) {
    next(error)
  }
}

export const getRecords = async (req, res, next) => {
  try {
    const filters = {
      type: req.query.type,
      category: req.query.category,
      from: req.query.from,
      to: req.query.to,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
    }
    const result = await RecordsService.getRecords(filters)
    res.json(new ApiResponse(200, result, 'Records fetched'))
  } catch (error) {
    next(error)
  }
}

export const getRecordById = async (req, res, next) => {
  try {
    const record = await RecordsService.getRecordById(Number(req.params.id))
    res.json(new ApiResponse(200, record, 'Record fetched'))
  } catch (error) {
    next(error)
  }
}

export const updateRecord = async (req, res, next) => {
  try {
    const record = await RecordsService.updateRecord(Number(req.params.id), req.body)
    res.json(new ApiResponse(200, record, 'Record updated'))
  } catch (error) {
    next(error)
  }
}

export const deleteRecord = async (req, res, next) => {
  try {
    await RecordsService.deleteRecord(Number(req.params.id))
    res.json(new ApiResponse(200, null, 'Record deleted'))
  } catch (error) {
    next(error)
  }
}