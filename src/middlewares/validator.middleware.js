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

const error = {
  code: 400,
  message: "validation error",
  status: "VALIDATION_FAILED",
  details: {}
};

// ✅ Only process if this is a Joi validation error
if (execption.isJoi && Array.isArray(execption.details)) {
  execption.details.forEach((errorObj) => {
    // safer: take the first element of the path instead of popping
    const field = errorObj.path[0];
    error.details[field] = errorObj.message;
  });
}

next(error);
        }
    }
}

module.exports = bodyValidator;