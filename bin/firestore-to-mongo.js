/* eslint no-underscore-dangle: off */

const serviceAccount = require('./service-account.json');
const firebase = require('firebase-admin');
const {MongoClient} = require('mongodb');
const fs = require('fs');
const {promisify} = require('util');

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

	const collections = await db.getCollections();
	for (const collection of collections) {
		console.log(`Exporting ${collection.id}...`);

		const docs = await collection.get();

		console.log(`Importing ${collection.id}...`);
		await mongo.createCollection(collection.id);
		await mongo.collection(collection.id).deleteMany({});
		const records = [];

		// eslint-disable-next-line mysticatea/prefer-for-of
		docs.forEach((doc) => {
			const data = {
				...traverse(doc.data(), (value) => {
					if (value instanceof firebase.firestore.DocumentReference) {
						return {
							__ref: value._referencePath.segments,
						};
					}
					return value;
				}),
				_id: doc.id,
			};
			records.push(data);
		});

		await mongo.collection(collection.id).insertMany(records, {ordered: false});
	}

	process.exit();
})();
