import mongoose from 'mongoose'

export const fakeId = new mongoose.Types.ObjectId().toHexString()
