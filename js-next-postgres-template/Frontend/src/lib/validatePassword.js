const validatePassword = (value) => {
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const hasMinLength = value.length >= 8;

  if (!hasMinLength) {
    return "* Password must be at least 8 characters long";
  }
  if (!hasNumber) {
    return "* Password must include at least one number";
  }
  if (!hasSpecialChar) {
    return "* Password must include at least one special character";
  }

  // Strength evaluation
  if (hasMinLength && hasNumber && hasSpecialChar) {
    return true; // Strong password
  } else if (hasMinLength && (hasNumber || hasSpecialChar)) {
    return "* Password strength: Medium";
  } else {
    return "* Password strength: Weak";
  }
};

export default validatePassword;
