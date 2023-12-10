
export const toYMD = (date: Date = new Date(Date.now())) => { 

    return date.toLocaleDateString().split('/').reverse().join('-')
}

export const getDateStart = (date: Date = new Date(Date.now())) => { 
    var d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 7)

    return d
}