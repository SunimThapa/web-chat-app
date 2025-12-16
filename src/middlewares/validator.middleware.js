const bodyValidator =(rules)=>{
    return async (req, res, next)=>{
        try{
            const payload = req.body;
            if(!payload){
                throw{
                    code: 422,
                    message: "data not provided",
                    status: "VALIDATION_ERROR"
                }
            }
            await rules.validateAsync(payload, {abortEarly: false})
            next()
        }catch(execption){
            console.log("Joi Error: ", execption);
            let error= {
                code: 400,
                message: "validation error",
                status: "VALIDATION_FAILED",
                details: {}
            }
            execption.details.map((errorObj)=>{
                let field = errorObj.path.pop();
                error.details[field]= errorObj.message
            });
            next(error);
        }
    }
}

module.exports = bodyValidator;