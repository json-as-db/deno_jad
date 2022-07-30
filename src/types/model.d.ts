export type ModelDb = {
    [key: string]: ModelTable
}

type ModelTable = [
    {
        [key: string]: string | number | boolean
    }
]