import { Schema, model } from './mod.ts'

const schema = new Schema({
    name: 'String',
    age: {
        type: 'Number',
        required: true,
    }
})

const User = model('User', schema)

await User.create({
    age: 30,
    name: 'John'
})

await console.log(await User.get())