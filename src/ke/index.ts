import { parsePhoneNumberFromString, PhoneNumber } from "libphonenumber-js";
import {
	CountryCode,
	IExtract,
	IMNOPrefixes,
	ISiftPrefixes,
	PREFIXES
} from "../types";

const MNOS: string[] = [
	"SAFARICOM",
	"AIRTEL KENYA",
	"TELKOM KENYA",
	"JAMII TELECOMMUNICATION"
];
const countryCode: CountryCode = "KE";

/**
 *
 * @param {number} start - Starting number
 * @param {number} stop - Stopping number
 * @param {number} [interval] - Interval between the numbers(skip)
 * @return {Array} - Returns array
 */
function range(start: number, stop: number, interval: number = 1): number[] {
	return Array.from(
		{ length: (stop - start) / interval + 1 },
		(_, i) => start + i * interval
	);
}

const AVAILABLEPREFIXES: PREFIXES = [...range(700, 800), ...range(100, 150)];

const siftSafaricomPrefixes: ISiftPrefixes = () => {
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

const siftAirtelPrefixes: ISiftPrefixes = () => {
	return [
		...range(730, 739),
		...range(750, 756),
		...range(785, 789),
		...range(100, 102)
	];
};
const siftTelkomPrefixes: ISiftPrefixes = () => {
	return [...range(770, 779)];
};
const siftJTLrefixes: ISiftPrefixes = () => {
	return [747];
};

const MNOPrefixes: IMNOPrefixes = {
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

const ke: IExtract = {
	getNetworkOperator(num: string) {
		const parsedNumber: PhoneNumber | undefined = parsePhoneNumberFromString(
			num,
			countryCode
		);
		// console.log("phoneNumber @getNetworkOperator", parsedNumber?.number);
		const keNumber: string | undefined = parsedNumber?.number;
		const isValidKENumber: RegExp = /^(\+?254|0)\d{9}$/;
		if (!isValidKENumber.test(String(keNumber))) {
			// console.log("not valid ke number");
			return "not valid ke number";
		}
		let prefix: string | null = null;
		if (!keNumber) {
			return "invalid Kenya number";
		}
		const capturePrefix = /(\+?254|0)(?<prefix>\d{3})(\d{6})/;
		const extracted: RegExpMatchArray | null = keNumber.match(capturePrefix);
		prefix = extracted && extracted[2];

		console.log("prefix @getNetworkOperator", prefix);
		let prefixNum: number = 0;
		if (!prefix) {
			return "prefix not extracted";
		}
		prefixNum = parseInt(prefix);

		const prefixNumAvailable: boolean = AVAILABLEPREFIXES.includes(prefixNum);
		if (!prefixNumAvailable) {
			return "prefix unavailable in Kenya";
		}
		for (let i: number = 0; i < MNOS.length; i++) {
			let operatorPrefixes: number[] = MNOPrefixes[MNOS[i]];
			if (operatorPrefixes.includes(prefixNum)) {
				console.log("operatorPrefixes", operatorPrefixes);
				return MNOS[i];
			}
		}
		return "unknown";
	},
	isOperator: (num: string, operator: string): boolean => {
		const networkOperator = String(operator.toUpperCase().trim());
		const parsedNumber: PhoneNumber | undefined = parsePhoneNumberFromString(
			num,
			countryCode
		);
		console.log("phoneNumber", parsedNumber?.number);
		const keNumber: string | undefined = parsedNumber?.number;
		let prefix: string | null = null;
		if (keNumber) {
			const capturePrefix = /(\+?254|0)(?<prefix>\d{3})(\d{6})/;
			const extracted: RegExpMatchArray | null = keNumber.match(capturePrefix);
			prefix = extracted && extracted[2];
			console.log("prefix", prefix);
		}
		let prefixNum: number = 0;
		if (prefix) {
			prefixNum = parseInt(prefix);
		}
		const foundOperator = MNOS.find(mno => {
			return mno === networkOperator || mno.startsWith(networkOperator);
		});
		if (foundOperator) return true;
		return false;
	},
	isValidNumber: (num: string): boolean => {
		const parsedNumber: PhoneNumber | undefined = parsePhoneNumberFromString(
			num,
			countryCode
		);
		// console.log("phoneNumber @getNetworkOperator", parsedNumber?.number);
		const keNumber: string | undefined = parsedNumber?.number;
		const isValidKENumber: RegExp = /^(\+?254|0)\d{9}$/;
		return isValidKENumber.test(String(keNumber));
	},
	isValidNationalNumber: (num: string): boolean => {
		console.log("nat num", num);
		const parsedNumber: PhoneNumber | undefined = parsePhoneNumberFromString(
			num,
			countryCode
		);
		// console.log("phoneNumber @getNetworkOperator", parsedNumber?.number);
		const keNumber: string | undefined = parsedNumber?.nationalNumber;
		const isValidKENumber: RegExp = /^(\0?)\d{9}$/;
		return isValidKENumber.test(String(keNumber));
	},
	isValidInternationalNumber: (num: string): boolean => {
		const parsedNumber: PhoneNumber | undefined = parsePhoneNumberFromString(
			num,
			countryCode
		);
		// console.log("phoneNumber @getNetworkOperator", parsedNumber?.number);
		const keNumber: string | undefined = parsedNumber?.number;
		const isValidKENumber: RegExp = /^(\+?254)\d{9}$/;
		return isValidKENumber.test(String(keNumber));
	}
};

export { ke };
