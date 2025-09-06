export function isValidEmail(email) {
return /\S+@\S+\.\S+/.test(email);
}


export function isStrongPassword(pwd) {
return typeof pwd === 'string' && pwd.length >= 8; // extend as needed
}
