import dayjs from 'dayjs';

/**
 * Format a date as Mon, January 11, 2023. This method is modified to work with 2-digit years and years before year 1.
 *
 * @param {number} year - The year to format.
 * @param {number} month - The month to format (1-12).
 * @param {number} day - The day to format (1-31).
 * @returns {string} The formatted date.
 */
export const formatDate = (year, month, day) => {
	const dateToFormat = new Date(year, month - 1, day);
	dateToFormat.setFullYear(year > 0 ? year : year + 1); // fix for 2-digit years and years before year 1
	let formatted = dayjs(dateToFormat).format('ddd, MMMM D, YYYY');
	if (year === 0) {
		throw new Error('Gregorian year 0 does not exist.');
	}
	if (isNaN(Math.abs(year))) {
		throw new Error('Invalid Gregorian date.');
	}
	// pad year with zeros to 4 digits and replace year with the actual year
	const formattedYear = (year < 0 ? '-' : '') + Math.abs(year).toString().padStart(4, '0');
	formatted = formatted.replace(/[\d-]+$/, formattedYear);
	return formatted;
};

/**
 * Override for formatDate that takes a Date object instead of year, month, and day.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date.
 */
export const formatDateObject = (date) => {
	return formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
};

/**
 * Returns true if daylight saving time is in effect for a given date
 * @param {Date} date - The date to check
 * @returns {boolean} True if daylight saving time is in effect for the given date
 */
export function isDST(date) {
	const jan = new Date(date.getFullYear(), 0, 1);
	const jul = new Date(date.getFullYear(), 6, 1);
	return Math.min(jan.getTimezoneOffset(), jul.getTimezoneOffset()) == date.getTimezoneOffset();
}
