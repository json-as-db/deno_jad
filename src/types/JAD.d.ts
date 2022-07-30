export interface JADOptions {
    schema: schemaType
    schemaOptions?: schemaOptionsType
}

export type schemaType = {
    [key: string]: 'String' | 'Number' | 'Date' | 'Object' | 'Array' | schemaTypeOptions
}

type schemaTypeOptions = {
    type: 'String' | 'Number' | 'Date' | 'Object' | 'Array'
    required?: boolean
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
}

export type schemaOptionsType = {
    timestamp?: boolean
}
