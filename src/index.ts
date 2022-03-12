import { ke } from "./ke";
// ke.isSafaricomOperator("+254  716 94 6646");
console.log("saf operator", ke.isOperator("+254  716 94 646", "saf"));
console.log("GET operator", ke.getNetworkOperator("+254  747 94 6646"));
console.log("isValidNationalNumber", ke.isValidNationalNumber("+254  716 94 6646"));
console.log("isValidNationalNumber", ke.isValidNationalNumber("0  716 94 6646"));
console.log("isValidInternationalNumber__", ke.isValidInternationalNumber("+254  716 94 6646"));
console.log("isValidInternationalNumber__", ke.isValidInternationalNumber("254  716 94 6646"));

export { ke };
