
class HttpRespose { 
    success: boolean
    data: any[]

    constructor(data?: any[], success?: boolean) {
        this.success = success ?? true;
        this.data = data ?? []
    }
}

export default HttpRespose