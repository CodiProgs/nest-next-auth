type TimeUnit = 's' | 'm' | 'h' | 'd' | 'M' | 'y'
/**
 * Converts a time value from one unit to another.
 *
 * @param {string} time The time value and its unit, as a string (e.g., "10s" or "2h").
 * @param {TimeUnit} targetUnit The target unit of time to convert to.
 * @returns {number} The converted time value in the target unit, as a number.
 * @throws {Error} If the time unit in the `time` string or `targetUnit` is invalid.
 */
export const convertTime = (time: string, targetUnit: TimeUnit): number => {
	const timeUnits: { [key in TimeUnit]: number } = {
		s: 1,
		m: 60,
		h: 3600,
		d: 86400,
		M: 2592000,
		y: 31536000
	}

	const sourceUnit = time.slice(-1) as TimeUnit
	const num = parseFloat(time.slice(0, -1))

	if (!timeUnits[sourceUnit] || isNaN(num)) {
		throw new Error('Invalid source time unit or number')
	}

	if (!timeUnits[targetUnit]) {
		throw new Error('Invalid target time unit')
	}

	if (sourceUnit === targetUnit) return num

	const timeInSeconds = num * timeUnits[sourceUnit]
	return timeInSeconds / timeUnits[targetUnit]
}
