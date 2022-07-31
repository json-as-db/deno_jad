import jad from './mod.ts'

const { Schema, model } = jad

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