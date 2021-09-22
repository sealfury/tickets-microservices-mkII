import mongoose from 'mongoose' 

// Describes required props to create new User
interface UserAttrs {
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

const User = mongoose.model('User', userSchema)

// replaces call to new User()
const buildUser = (attrs: UserAttrs) => {
  return new User(attrs)
}

export { User, buildUser }
