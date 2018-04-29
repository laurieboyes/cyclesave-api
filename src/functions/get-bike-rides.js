const getGoogleFitBikerides = require('../lib/get-google-fit-bikerides');

module.exports.handle = (event, context, callback) => {

	const googleAuthToken = event.queryStringParameters && event.queryStringParameters.authToken;

	if (!googleAuthToken || !googleAuthToken.length) {
		callback(null, callback(null, {
			statusCode: 400,
			body: JSON.stringify({
				message: 'authToken queryParam required'
			}),
		}));
	}

	getGoogleFitBikerides(googleAuthToken, new Date('2016-08-01'), new Date('2016-08-31'))
		.then(bikeRides => {
			console.log('bikeRides', bikeRides);
			callback(null, {
				statusCode: 200,
				body: JSON.stringify({
					bikeRides
				}),
			});
		})
		.catch(err => {
			console.log('err', err);
			callback(null, {
				statusCode: 500,
				body: JSON.stringify({
					message: err.message
				}),
			});
		})
};
