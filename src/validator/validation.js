

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length > 0) return true;
    return false;
  };
  
  const isValidRequest = function (object) {
    return Object.keys(object).length > 0
  }
  
  const isValidEmail = function (value) {
    const regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regexForEmail.test(value)
  }        
  
  const regixValidator = function (value) {
    let regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/ 
    return regex.test(value)
  }
  
  const isValidPincode = function (pincode) {
    if ( /^\+?([1-9]{1})\)?([0-9]{5})$/.test(pincode)) return true
}

const isValidPassword = function (password) {
    if (/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password)) return true
}


module.exports ={
    isValid, isValidRequest,isValidEmail,regixValidator,isValidPincode,isValidPassword
}