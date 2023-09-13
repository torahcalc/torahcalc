/**
 * Check if a string represents a true value.
 *
 * @param {string?} value - The string to check.
 * @returns {boolean} Whether the string represents a true value.
 */
export const isTrue = (value) => {
	return ['true', '1'].includes(value || '');
};
