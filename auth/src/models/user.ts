import mongoose from 'mongoose'

// Describes required props to create new User
interface UserAttrs {
  email: string
  password: string
}

// Describes props that a User model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

// Describes props that a User document has
interface UserDoc extends mongoose.Document {
  email: string
  password: string
} 

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})
// replaces call to new User()
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

const user = User.build({
  email: 'test@test.com',
  password: 'password'
})

export { User }
