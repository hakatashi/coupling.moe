/* eslint no-underscore-dangle: off */

const serviceAccount = require('./service-account.json');
const firebase = require('firebase-admin');
const {MongoClient} = require('mongodb');

require('firebase/firestore');

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: 'https://coupling-moe.firebaseio.com',
});

const db = firebase.firestore();
db.settings({timestampsInSnapshots: true});

const escapeKey = (key) => (
	key.replace(/[.$\s]/g, '_')
);

const traverse = (object, mapper) => {
	const newObject = {};
	for (const [key, value] of Object.entries(object)) {
		if (Array.isArray(value)) {
			newObject[escapeKey(key)] = value.map(mapper);
		} else if (value.constructor === Object) {
			newObject[escapeKey(key)] = traverse(value, mapper);
		} else {
			newObject[escapeKey(key)] = mapper(value);
		}
	}
	return newObject;
};

(async () => {
	const mongoClient = await MongoClient.connect('mongodb://localhost:27017/');
	const mongo = mongoClient.db('coupling-moe');

	const collections = await db.listCollections();
	for (const collection of collections) {
		console.log(`Importing ${collection.id}...`);
		await mongo.createCollection(collection.id);
		await mongo.collection(collection.id).deleteMany({});

		let count = Infinity;
		let offset = '';

		do {
			console.log(`Exporting ${collection.id} (offset = ${JSON.stringify(offset)})...`);
			const records = [];

			const docs = collection.id === 'images' ? (await collection.where('link', '>', offset).orderBy('link').limit(1000).get()) : (await collection.get());

			// eslint-disable-next-line mysticatea/prefer-for-of
			docs.forEach((doc) => {
				const data = {
					...traverse(doc.data(), (value) => {
						if (value instanceof firebase.firestore.DocumentReference) {
							return {
								__ref: value._path.segments,
							};
						}
						return value;
					}),
					_id: doc.id,
				};
				records.push(data);
			});

			if (records.length > 0) {
				await mongo.collection(collection.id).insertMany(records, {ordered: false});
			}

			count = docs.size;
			if (docs.size > 0) {
				offset = docs.docs[docs.size - 1].get('link');
			}
		} while (count > 0 && collection.id === 'images');
	}

	process.exit();
})();
