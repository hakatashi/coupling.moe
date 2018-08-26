/* eslint global-require: off */

let vuexfire = null;

if (process.env.NUXT_USE_MONGODB === 'true' && !process.browser) {
	vuexfire = {
		firebaseAction: (handler) => {
			return (context, ...args) => {
				return handler({
					...context,
					bindFirebaseRef: () => {},
				}, ...args);
			};
		},
	};
} else {
	vuexfire = require('vuexfire/out/index.js');
}

export default vuexfire;
export const {firebaseAction, firebaseMutations} = vuexfire;
