const isPhoneNumber = (number) => {
  var filter = /^\d{10}$/;

  if (filter.test(number)) {
    return true;
  } else { 
    return false;
  }
};
//helper function to check the string is equal or not

const isEmpty = (string) => {
  if(string!== undefined){
  if (string.trim() === "") return true;
  else return false;
  }
};

exports.validateSignupData = (data) => {
  let errors = {};

  //validation of email
  console.log(data);
  if (isEmpty(data.phone.toString())) {
    errors.phone = "Must not be empty";
  } else if (!isPhoneNumber(data.phone)) {
    errors.phone = "Not a valid number";
  }

  if (isEmpty(data.password)) errors.password = "Must not be empty";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords must match";
  if (isEmpty(data.userType)) errors.userType = "Must not be empty";  

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateLoginData = (data) => {
  let errors = {};
  if (isEmpty(data.phone.toString())) errors.phone = "Must not be empty";
  if (isEmpty(data.password)) errors.password = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

