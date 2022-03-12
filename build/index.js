"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ke = void 0;
const ke_1 = require("./ke");
Object.defineProperty(exports, "ke", { enumerable: true, get: function () { return ke_1.ke; } });
// ke.isSafaricomOperator("+254  716 94 6646");
console.log("saf operator", ke_1.ke.isOperator("+254  716 94 646", "saf"));
console.log("GET operator", ke_1.ke.getNetworkOperator("+254  747 94 6646"));
console.log("isValidNationalNumber", ke_1.ke.isValidNationalNumber("+254  716 94 6646"));
console.log("isValidNationalNumber", ke_1.ke.isValidNationalNumber("0  716 94 6646"));
console.log("isValidInternationalNumber__", ke_1.ke.isValidInternationalNumber("+254  716 94 6646"));
console.log("isValidInternationalNumber__", ke_1.ke.isValidInternationalNumber("254  716 94 6646"));
