const cookieToken =(user, res)=>{
    
    const token =user.getJwtToken();

    const options={
        expires: new Date(Date.now()+ process.env.COOKIE_TIME *24*60*60*1000),
        httpOnly:true,
    };


user.password = undefined;

    //name of cookie(token), value of cookie-token, options( expiry time, httpOnly, secure )
    res.status(200).cookie("token", token ,options).json({
        success:true,
        token,
        user,
    });

}

module.exports=cookieToken;

