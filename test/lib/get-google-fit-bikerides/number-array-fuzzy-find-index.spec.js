const { expect } = require('chai');
const numberArrayFuzzyFindIndex = require('../../../src/lib/get-google-fit-bikerides/number-array-fuzzy-find-index');

describe('numberArrayFuzzyFindIndex', () => {
	it('should return the array index of the closest number to that which is given', () => {
		const theArray = [3, 8, 30, 60];
		const theNumber = 16;
		expect(numberArrayFuzzyFindIndex(theArray, theNumber)).to.equal(1);
	});

	it('should work when the number is the last in the array', () => {
		const theArray = [3, 8, 30, 60];
		const theNumber = 200;
		expect(numberArrayFuzzyFindIndex(theArray, theNumber)).to.equal(3);
	});

	it('should work when the number is the first in the array', () => {
		const theArray = [3, 8, 30, 60];
		const theNumber = 1;
		expect(numberArrayFuzzyFindIndex(theArray, theNumber)).to.equal(0);
	});

	it('should work for arrays with negative numbers too', () => {
		const theArray = [-500, -56, 3, 8, 30, 60];
		const theNumber = -30;
		expect(numberArrayFuzzyFindIndex(theArray, theNumber)).to.equal(1);
	});

	it('should work regardless of the order of the array', () => {
		const theArray = [8, -500, 30, -56, 60, 3];
		const theNumber = -30;
		expect(numberArrayFuzzyFindIndex(theArray, theNumber)).to.equal(3);
	});
});
