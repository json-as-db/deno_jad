export type SchemaType = Record<string, 'String' | 'Number' | 'Date' | 'Object' | 'Array' | SchemaTypeOptions>

type SchemaTypeOptions = {
    type: 'String' | 'Number' | 'Date' | 'Object' | 'Array'
    required?: boolean
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
}

export type SchemaOptionsType = {
    timestamp?: boolean
}
