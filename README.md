<p align="center">
<img src="https://i.ibb.co/jyQxXBb/JAD.png" width="300">
</p>
<p align="center">Una base de datos en formato JSON.</p>

## Uso

**1. Configuracion**

Crea un archivo `jad.config.json` en tu directorio de trabajo de lo contrario se creara el archivo `jad.db.json` en tu directorio de trabajo.

```json
{
  "path": "src/db/",
  "db": "jad.db.json"
}
```

**2. Uso del modulo**

```typescript
import jad from 'https://deno.land/x/deno_jad/mod.ts'

const { Schema, model } = jad

const schema = new Schema({
  name: 'String',
  age: 'Number',
  email: {
    type: 'String',
    required: true
  }
}, {
  timestamps: true
})

export const User = model('users', schema)
```

## Uso del modelo

```typescript
import Products from './src/models/Products'

async function getProducts() {
  return await Products.get()
}
```

## Metodos

Estos son lo metodos que tiene la clase

- get()
- getById()
- create()
- updateById()
- deleteById()