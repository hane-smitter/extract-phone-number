"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ke = void 0;
const libphonenumber_js_1 = require("libphonenumber-js");
const MNOS = [
    "SAFARICOM",
    "AIRTEL KENYA",
    "TELKOM KENYA",
    "JAMII TELECOMMUNICATION"
];
const countryCode = "KE";
/**
 *
 * @param {number} start - Starting number
 * @param {number} stop - Stopping number
 * @param {number} [interval] - Interval between the numbers(skip)
 * @return {Array} - Returns array
 */
function range(start, stop, interval = 1) {
    return Array.from({ length: (stop - start) / interval + 1 }, (_, i) => start + i * interval);
}
const AVAILABLEPREFIXES = [...range(700, 800), ...range(100, 150)];
const siftSafaricomPrefixes = () => {
    const nonSafaricom = [744, 747, 749];
    return [
        ...range(700, 729),
        ...range(740, 749),
        ...range(790, 799),
        110,
        111
    ].filter(prefix => {
        return !nonSafaricom.includes(prefix);
    });
};
const siftAirtelPrefixes = () => {
    return [
        ...range(730, 739),
        ...range(750, 756),
        ...range(785, 789),
        ...range(100, 102)
    ];
};
const siftTelkomPrefixes = () => {
    return [...range(770, 779)];
};
const siftJTLrefixes = () => {
    return [747];
};
const MNOPrefixes = {
    /**
     * safaricom prefixes
     */
    [MNOS[0]]: siftSafaricomPrefixes(),
    /**
     * airtel prefixes
     */
    [MNOS[1]]: siftAirtelPrefixes(),
    /**
     * telkom prefixes
     */
    [MNOS[2]]: siftTelkomPrefixes(),
    /**
     * jamii telecommunication prefixes
     */
    [MNOS[3]]: siftJTLrefixes()
};
// for a standard 10 digit phone number
const ke = {
    getNetworkOperator(num) {
        const parsedNumber = (0, libphonenumber_js_1.parsePhoneNumberFromString)(num, countryCode);
        // console.log("phoneNumber @getNetworkOperator", parsedNumber?.number);
        const keNumber = parsedNumber === null || parsedNumber === void 0 ? void 0 : parsedNumber.number;
        const isValidKENumber = /^(\+?254|0)\d{9}$/;
        if (!isValidKENumber.test(String(keNumber))) {
            // console.log("not valid ke number");
            return "not valid ke number";
        }
        let prefix = null;
        if (!keNumber) {
            return "invalid Kenya number";
        }
        const capturePrefix = /(\+?254|0)(?<prefix>\d{3})(\d{6})/;
        const extracted = keNumber.match(capturePrefix);
        prefix = extracted && extracted[2];
        console.log("prefix @getNetworkOperator", prefix);
        let prefixNum = 0;
        if (!prefix) {
            return "prefix not extracted";
        }
        prefixNum = parseInt(prefix);
        const prefixNumAvailable = AVAILABLEPREFIXES.includes(prefixNum);
        if (!prefixNumAvailable) {
            return "prefix unavailable in Kenya";
        }
        for (let i = 0; i < MNOS.length; i++) {
            let operatorPrefixes = MNOPrefixes[MNOS[i]];
            if (operatorPrefixes.includes(prefixNum)) {
                console.log("operatorPrefixes", operatorPrefixes);
                return MNOS[i];
            }
        }
        return "unknown";
    },
    isOperator: (num, operator) => {
        const networkOperator = String(operator.toUpperCase().trim());
        const parsedNumber = (0, libphonenumber_js_1.parsePhoneNumberFromString)(num, countryCode);
        console.log("phoneNumber", parsedNumber === null || parsedNumber === void 0 ? void 0 : parsedNumber.number);
        const keNumber = parsedNumber === null || parsedNumber === void 0 ? void 0 : parsedNumber.number;
        let prefix = null;
        if (keNumber) {
            const capturePrefix = /(\+?254|0)(?<prefix>\d{3})(\d{6})/;
            const extracted = keNumber.match(capturePrefix);
            prefix = extracted && extracted[2];
            console.log("prefix", prefix);
        }
        let prefixNum = 0;
        if (prefix) {
            prefixNum = parseInt(prefix);
        }
        const foundOperator = MNOS.find(mno => {
            return mno === networkOperator || mno.startsWith(networkOperator);
        });
        if (foundOperator)
            return true;
        return false;
    },
    isValidNumber: (num) => {
        const parsedNumber = (0, libphonenumber_js_1.parsePhoneNumberFromString)(num, countryCode);
        // console.log("phoneNumber @getNetworkOperator", parsedNumber?.number);
        const keNumber = parsedNumber === null || parsedNumber === void 0 ? void 0 : parsedNumber.number;
        const isValidKENumber = /^(\+?254|0)\d{9}$/;
        return isValidKENumber.test(String(keNumber));
    },
    isValidNationalNumber: (num) => {
        console.log("nat num", num);
        const parsedNumber = (0, libphonenumber_js_1.parsePhoneNumberFromString)(num, countryCode);
        // console.log("phoneNumber @getNetworkOperator", parsedNumber?.number);
        const keNumber = parsedNumber === null || parsedNumber === void 0 ? void 0 : parsedNumber.nationalNumber;
        const isValidKENumber = /^(\0?)\d{9}$/;
        return isValidKENumber.test(String(keNumber));
    },
    isValidInternationalNumber: (num) => {
        const parsedNumber = (0, libphonenumber_js_1.parsePhoneNumberFromString)(num, countryCode);
        // console.log("phoneNumber @getNetworkOperator", parsedNumber?.number);
        const keNumber = parsedNumber === null || parsedNumber === void 0 ? void 0 : parsedNumber.number;
        const isValidKENumber = /^(\+?254)\d{9}$/;
        return isValidKENumber.test(String(keNumber));
    }
};
exports.ke = ke;
