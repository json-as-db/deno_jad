export type ModelDb = {
    [key: string]: ModelTable
}

export type ModelTable = [
    {
        [key: string]: string | number | boolean
    }
]