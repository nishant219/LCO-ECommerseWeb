//try-catch & async-await  || use promise everywhere
//we are directly passing fun as parameter/1st class citizen
//take youe regular method/fun and wrapp them around BigPromise (else you can use try-catch & async-await)

module.exports=func=>(req,res,next)=>
Promise.resolve(func(req,res,next)).catch(next)


//Promise.resolve().catch()
//resolve(functions is executing)  && catch(err so next)


