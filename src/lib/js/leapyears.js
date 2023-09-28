/**
 * Checks whether the given year is a leap year on the Gregorian calendar.
 *
 * @param {number} year - The year to check.
 * @returns {{ isLeapYear: boolean, reason: string, nextLeapYear: number, nextLeapYearReason: string }} - The leap year check result.
 */
export const isGregorianLeapYear = (year) => {
	/**
	 * Checks whether the given year is a leap year.
	 * @param {number} year - The year to check.
	 * @returns {{ isLeapYear: boolean, reason: string }} - The leap year check result.
	 */
	const checkLeapYear = (year) => {
		if (year % 4 === 0) {
			if (year % 100 === 0) {
				if (year % 400 === 0) {
					return {
						isLeapYear: true,
						reason: `${year} is divisible by 400, and is therefore a leap year.`,
					};
				} else {
					return {
						isLeapYear: false,
						reason: `${year} is divisible by 100, but not by 400, and is therefore not a leap year.`,
					};
				}
			} else {
				return {
					isLeapYear: true,
					reason: `${year} is divisible by 4 and not by 100, and is therefore a leap year.`,
				};
			}
		} else {
			return {
				isLeapYear: false,
				reason: `${year} is not divisible by 4, and is therefore not a leap year.`,
			};
		}
	};

	if (year !== Math.floor(year)) {
		throw new Error('Year must be an integer.');
	}

	if (year === 0) {
		throw new Error('Year 0 does not exist.');
	}

	// Check if the year is a leap year
	const { isLeapYear, reason } = checkLeapYear(year);

	// Find the next leap year
	let nextLeapYear = year + 1;
	while (!checkLeapYear(nextLeapYear).isLeapYear) {
		nextLeapYear++;
	}
	const { reason: nextLeapYearParitalReason } = checkLeapYear(nextLeapYear);
	const nextLeapYearReason = `After ${year}, the next leap year is ${nextLeapYear}. ${nextLeapYearParitalReason}`;

	return {
		isLeapYear,
		reason,
		nextLeapYear,
		nextLeapYearReason,
	};
};

/**
 * Gets the ordinal suffix of the given number.
 *
 * @param {number} number - The number to get the ordinal suffix of.
 */
const ordinalSuffixOf = (number) => {
	const j = number % 10;
	const k = number % 100;
	if (j === 1 && k !== 11) {
		return `${number}st`;
	}
	if (j === 2 && k !== 12) {
		return `${number}nd`;
	}
	if (j === 3 && k !== 13) {
		return `${number}rd`;
	}
	return `${number}th`;
};

/**
 * Checks whether the given year is a leap year on the Hebrew calendar.
 *
 * @param {number} year - The year to check.
 * @returns {{ isLeapYear: boolean, reason: string, nextLeapYear: number, nextLeapYearReason: string }} - The leap year check result.
 */
export const isHebrewLeapYear = (year) => {
	/**
	 * Checks whether the given year of the Metonic cycle is a leap year.
	 * @param {number} yearOfCycle - The year of the Metonic cycle to check.
	 */
	const isLeapYearOfCycle = (yearOfCycle) => [3, 6, 8, 11, 14, 17, 19].includes(yearOfCycle);

	/**
	 * Get the year of the Metonic cycle for the given year.
	 * @param {number} year - The year to get the Metonic cycle year for.
	 */
	const getYearOfMetonicCycle = (year) => year % 19 || 19;

	if (year !== Math.floor(year)) {
		throw new Error('Year must be an integer.');
	}

	if (year <= 0) {
		throw new Error('Year must be greater than 0.');
	}

	// Check if the year is a leap year
	const yearOfMetonicCycle = getYearOfMetonicCycle(year);
	const cycleYearOrdinal = ordinalSuffixOf(yearOfMetonicCycle);
	let isLeapYear = false;
	let reason = `${year} is the ${cycleYearOrdinal} year of the 19-year Metonic cycle and is therefore`;
	if (isLeapYearOfCycle(yearOfMetonicCycle)) {
		isLeapYear = true;
		reason += ' a leap year.';
	} else {
		reason += ' not a leap year.';
	}

	// Find the next leap year
	let nextLeapYear = year + 1;
	while (!isLeapYearOfCycle(getYearOfMetonicCycle(nextLeapYear))) {
		nextLeapYear++;
	}
	const nextLeapYearMetonicCycle = getYearOfMetonicCycle(nextLeapYear);
	const nextLeapYearCycleOrdinal = ordinalSuffixOf(nextLeapYearMetonicCycle);
	const nextLeapYearReason = `After ${year}, the next leap year is ${nextLeapYear} – the ${nextLeapYearCycleOrdinal} year of the cycle.`;

	return {
		isLeapYear,
		reason,
		nextLeapYear,
		nextLeapYearReason,
	};
};
