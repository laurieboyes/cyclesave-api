const fetch = require('node-fetch');
const getNanos = require('./get-nanos');

const MAX_GAPI_RESULTS = 100000;

function getDateFromNanos (nanos) {
	return new Date(nanos / 1000000);
}

function lessThanADayApart (dateA, dateB) {
	return dateA.getTime() - dateB.getTime() < 86400000;
}

module.exports = (authToken, dataSourceId, fromDate, toDate) => {
	return fetch(`https://www.googleapis.com/fitness/v1/users/me/dataSources/${dataSourceId}/datasets/${getNanos(fromDate)}-${getNanos(toDate)}`, {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${authToken}`
		}
	})
		.then(res => res.json())
		.then(results => {
			if (results.error) {
				throw new Error(`Error querying datasource: ${results.error.message}`);
			} else {
				return results;
			}
		})
		.then(({ point }) => point)
		.then(points => {
			if (points.length < MAX_GAPI_RESULTS) {
				return points;
			} else {
				const earliestDateInPoints = getDateFromNanos(points[0].startTimeNanos);
				const newToDate = new Date(earliestDateInPoints.getTime() - 1);
				console.log(`Loads of results for ${dataSourceId}. Querying again to get points before ${earliestDateInPoints.toDateString()}`);
				return queryFitnessDataSource(dataSourceId, fromDate, newToDate)
					.then(prevBatchOfPoints => prevBatchOfPoints.concat(points));
			}
		})

}
