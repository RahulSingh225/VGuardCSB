export default const  Validator = {

     checkEmail:(text:string)=>{
        const pattern = "[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}"
        const regexPattern = new RegExp(pattern);
        return text.match(regexPattern)
    },

    checkPAN:(text:string)=>{
            
    }
}