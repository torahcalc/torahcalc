import { describe, it, expect } from 'vitest';
import { calculateZmanim } from './zmanim';

describe('test calculateZmanim', () => {
	it('calculates zmanim', async () => {
		const response = await calculateZmanim({
			date: '2023-09-24',
			latitude: 40.7127753,
			longitude: -74.0059728,
		});
		expect(response.zmanim.alos16Point1.time).toBe('2023-09-24T05:23:56-04:00');
		expect(response.zmanim.alos72.time).toBe('2023-09-24T05:33:19-04:00');
		expect(response.zmanim.chatzos.time).toBe('2023-09-24T12:47:44-04:00');
		expect(response.zmanim.minchaGedola.time).toBe('2023-09-24T13:17:56-04:00');
		expect(response.zmanim.minchaKetana.time).toBe('2023-09-24T16:19:08-04:00');
		expect(response.zmanim.misheyakir.time).toBe('2023-09-24T05:48:44-04:00');
		expect(response.zmanim.misheyakirMachmir.time).toBe('2023-09-24T05:55:41-04:00');
		expect(response.zmanim.plagHamincha.time).toBe('2023-09-24T17:34:38-04:00');
		expect(response.zmanim.sofZmanShmaGRA.time).toBe('2023-09-24T09:46:31-04:00');
		expect(response.zmanim.sofZmanShmaMGA.time).toBe('2023-09-24T09:10:31-04:00');
		expect(response.zmanim.sofZmanTefillaGRA.time).toBe('2023-09-24T10:46:55-04:00');
		expect(response.zmanim.sofZmanTefillaMGA.time).toBe('2023-09-24T10:22:55-04:00');
		expect(response.zmanim.sunrise.time).toBe('2023-09-24T06:45:19-04:00');
		expect(response.zmanim.sunset.time).toBe('2023-09-24T18:50:09-04:00');
		expect(response.zmanim.tzeis3MediumStars.time).toBe('2023-09-24T19:23:08-04:00');
		expect(response.zmanim.tzeis3Stars.time).toBe('2023-09-24T19:30:39-04:00');
		expect(response.zmanim.tzeis72.time).toBe('2023-09-24T20:02:09-04:00');
		expect(response.durations.shaahZmanisGRA.time).toBe('1 hour, 24 seconds');
		expect(response.durations.shaahZmanisMGA.time).toBe('1 hour, 12 minutes, 24 seconds');
	});

	it('calculates candle lighting', async () => {
		const response = await calculateZmanim({
			date: '2023-09-22',
			latitude: 40.7127753,
			longitude: -74.0059728,
		});
		expect(response.events.candleLighting.time).toBe('2023-09-22T18:35:00-04:00');
	});

	it('calculates candle lighting for Yom Kippur', async () => {
		const response = await calculateZmanim({
			date: '2023-09-24',
			latitude: 40.7127753,
			longitude: -74.0059728,
		});
		expect(response.events.candleLighting.time).toBe('2023-09-24T18:32:00-04:00');
	});

	it('calculates fast beginning and end', async () => {
		const response = await calculateZmanim({
			date: '2023-09-18',
			latitude: 40.7127753,
			longitude: -74.0059728,
		});
		expect(response.events.fastBegins.time).toBe('2023-09-18T05:17:00-04:00');
		expect(response.events.fastEnds.time).toBe('2023-09-18T19:33:00-04:00');
	});

	it('calculates havdalah', async () => {
		const response = await calculateZmanim({
			date: '2023-09-23',
			latitude: 40.7127753,
			longitude: -74.0059728,
		});
		expect(response.events.havdalah.time).toBe('2023-09-23T19:32:00-04:00');
	});
});
