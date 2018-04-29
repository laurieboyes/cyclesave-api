const fuzzyFindIndex = require('./number-array-fuzzy-find-index');
const dataSources = require('./data-sources');
const queryFitnessDataSource = require('./query-fitness-data-source');

function getClosestLatLng (locationPoints, nanos) {
	const sortedPoints = locationPoints.sort();
	const closestLocation = sortedPoints[fuzzyFindIndex(sortedPoints.map(l => l.startTimeNanos), nanos)];
	return {
		lat: +closestLocation.value[0].fpVal,
		lng: +closestLocation.value[1].fpVal
	};
}

module.exports = (authToken, fromDate, toDate) => {
	return Promise.all([
		dataSources.ACTIVITY_SEGMENTS,
		dataSources.LOCATION_SAMPLES
	].map(dataSource => queryFitnessDataSource(authToken, dataSource, fromDate, toDate)))
		.then(([activities, locationPoints]) => {

			if (!activities) {
				throw new Error('No activities found in the given range');
			}

			return activities

				//point is an array of activity segments
				.filter(a => a.value[0].intVal === 1)

				.map(b => {

					const startTime = new Date(b.startTimeNanos / 1000000);
					const endTime = new Date(b.endTimeNanos / 1000000);

					const durationMs = (b.endTimeNanos - b.startTimeNanos) / 1000000;

					const startLatLang = getClosestLatLng(locationPoints, b.startTimeNanos);
					const endLatLang = getClosestLatLng(locationPoints, b.endTimeNanos);

					return {
						startTime,
						endTime,
						startLatLang,
						endLatLang,
						durationMs
					};
				});
		});
}
