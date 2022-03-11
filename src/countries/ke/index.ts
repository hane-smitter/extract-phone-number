import { parsePhoneNumberFromString, PhoneNumber } from "libphonenumber-js";
// ^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$
// /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/

//safaricom test
const safValues: Array<number> = [];
for (let i: number = 700; i < 800; i++) {
	if (i === 709) continue;
	if (i === 730) i = 740;
	if (i === 744) continue;
	if (i === 747) continue;
	if (i === 749) i = 790;
	safValues.push(i);
}
for (let i: number = 100; i < 200; i++) {
	if (i === 110) {
		safValues.push(i);
	}
	if (i === 111) {
		safValues.push(i);
		break;
	}
}
const ke = {
	// for a standard 10 digit phone number
	/**
	 * @function isSafaricomNetworkOperator - Find if phone number is Safaricom
	 * @param {number} num - Mobile phone number in +2547xxxxxx or 07xxxxxx
	 */
	isSafaricomNetworkOperator: (num: string): boolean => {
		const parsedNumber: PhoneNumber | undefined = parsePhoneNumberFromString(
			num,
			"KE"
		);
		console.log("phoneNumber", parsedNumber?.number);
		const keNumber: string | undefined = parsedNumber?.number;
		const isValidKENumber: RegExp = /^(\+?254|0)\d{9}$/;
		if (!isValidKENumber.test(keNumber || "")) {
			// console.log("not valid ke number");
			return false;
		}
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

		const isSafaricomPhoneNumber: boolean = safValues.includes(prefixNum);
		return isSafaricomPhoneNumber;
	}
};

export { ke };
