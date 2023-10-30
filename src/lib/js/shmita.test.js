import { describe, expect, it } from 'vitest';
import { nextShmita, previousShmita } from './shmita';

describe('test nextShmita', () => {
	it('calculates next shmita from year before', async () => {
		const result = nextShmita(2007, true);
		expect(result).toBe(5768);
	});

	it('calculates next shmita from same year', async () => {
		const result = nextShmita(2008, true);
		expect(result).toBe(5768);
	});

	it('calculates next shmita from year after', async () => {
		const result = nextShmita(2009, true);
		expect(result).toBe(5775);
	});

	it('calculates next shmita from hebrew year before', async () => {
		const result = nextShmita(5767, false);
		expect(result).toBe(5768);
	});

	it('calculates next shmita from hebrew same year', async () => {
		const result = nextShmita(5768, false);
		expect(result).toBe(5768);
	});

	it('calculates next shmita from hebrew year after', async () => {
		const result = nextShmita(5769, false);
		expect(result).toBe(5775);
	});

	it('calculates next shmita from 1', async () => {
		const result = nextShmita(1, true);
		expect(result).toBe(3766);
	});

	it('calculates next shmita from -100', async () => {
		const result = nextShmita(-100, true);
		expect(result).toBe(3661);
	});
});

describe('test previousShmita', () => {
	it('calculates previous shmita from year before', async () => {
		const result = previousShmita(2007, true);
		expect(result).toBe(5761);
	});

	it('calculates previous shmita from same year', async () => {
		const result = previousShmita(2008, true);
		expect(result).toBe(5761);
	});

	it('calculates previous shmita from year after', async () => {
		const result = previousShmita(2009, true);
		expect(result).toBe(5768);
	});

	it('calculates previous shmita from hebrew year before', async () => {
		const result = previousShmita(5767, false);
		expect(result).toBe(5761);
	});

	it('calculates previous shmita from hebrew same year', async () => {
		const result = previousShmita(5768, false);
		expect(result).toBe(5761);
	});

	it('calculates previous shmita from hebrew year after', async () => {
		const result = previousShmita(5769, false);
		expect(result).toBe(5768);
	});

	it('calculates previous shmita from 1', async () => {
		const result = previousShmita(1, true);
		expect(result).toBe(3759);
	});

	it('calculates previous shmita from -100', async () => {
		const result = previousShmita(-100, true);
		expect(result).toBe(3654);
	});
});
