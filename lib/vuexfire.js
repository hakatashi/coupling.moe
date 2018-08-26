/* eslint global-require: off */

let vuexfire = null;
const originalVuexfire = require('vuexfire/out/index.js');

if (process.env.NUXT_USE_MONGODB === 'true' && !process.browser) {
	const mongoPromise = (async () => {
		const {MongoClient} = require('mongodb');
		const mongoClient = await MongoClient.connect('mongodb://localhost:27017/');
		return mongoClient.db('coupling-moe');
	})();

	vuexfire = {
		firebaseAction: (handler) => {
			return (context, ...args) => {
				return handler({
					...context,
					bindFirebaseRef: async (path, doc) => {
						const db = await mongoPromise;
						if (doc.type === 'document') {
							const collection = db.collection(doc.collection.name);
							const data = await collection.findOne({_id: doc.name});

							context.commit('vuexfire/SET_VALUE', {
								path,
								target: context.state,
								data,
							});
						}
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
