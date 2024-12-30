const {z} = require("zod");


function isValidEntry(req,res,next){
    const valid = z.object({
        email : z.string().email(),
        password : z.string()
    });
    const isValid = valid.safeParse(req.body);
    if(!isValid.success){
        res.json({
            message : "Invalid credentials",
            error : isValid.error
        });
    }else next();
}
module.exports = {
    isValidEntry
}