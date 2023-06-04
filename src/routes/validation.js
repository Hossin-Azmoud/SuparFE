let email_regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
const isEmail   = (E) => email_regex.test(E);
export { isEmail };