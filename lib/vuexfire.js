/* eslint global-require: off */

let vuexfire = null;
const originalVuexfire = require('vuexfire/out/index.js');

if (process.env.NUXT_USE_MONGODB === 'true' && !process.browser) {
	const db = require('~/lib/db.js');

	vuexfire = {
		firebaseAction: (handler) => {
			return (context, ...args) => {
				return handler({
					...context,
					bindFirebaseRef: async (path, doc) => {
						context.commit('vuexfire/SET_VALUE', {
							path,
							target: context.state,
							data: await doc.get(),
						}, {root: true});
					},
				}, ...args);
			};
		},
		firebaseMutations: originalVuexfire.firebaseMutations,
	};
} else {
	vuexfire = originalVuexfire;
}

export default vuexfire;
export const {firebaseAction, firebaseMutations} = vuexfire;
