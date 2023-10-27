//you can just extend Error class (empty) or override its constructor

class CustomError extends Error{
    constructor(message, code){
        super(message);
        this.code=code;
    }

}
module.exports=CustomError;