import { Schema, model } from './mod.ts'

const schema = new Schema({
    name: 'String',
    age: {
        type: 'Number',
        required: true,
    }
}, {
    timestamps: true,
})

const User = model('User', schema)

const a = await User.create({
    age: 30,
    name: 'John'
})

await User.updateById(a._id, {
    age: 331,
})

await User.deleteById(a._id)
await console.log(await User.get())
await console.log(await User.getById(a._id))