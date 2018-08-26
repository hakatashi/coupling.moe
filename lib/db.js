/* eslint global-require: off */

import firebase from './firebase';

let db = null;

if (process.env.NUXT_USE_MONGODB === 'true' && !process.browser) {
	const mongoPromise = (async () => {
		const {MongoClient} = require('mongodb');
		const mongoClient = await MongoClient.connect('mongodb://localhost:27017/');
		return mongoClient.db('coupling-moe');
	})();

	class Document {
		constructor(collection, name) {
			this.type = 'document';
			this.collection = collection;
			this.name = name;
		}

		async get() {
			const mongo = await mongoPromise;
			const collection = mongo.collection(this.collection.name);
			const data = await collection.findOne({_id: this.name});
			return data;
		}
	}

	class Collection {
		constructor(name) {
			this.type = 'collection';
			this.name = name;
		}

		doc(name) {
			return new Document(this, name);
		}

		async get() {
			const mongo = await mongoPromise;
			const collection = mongo.collection(this.name);
			const docs = await collection.find({});
			const data = await docs.toArray();
			return data;
		}
	}

	db = {
		collection: (name) => new Collection(name),
	};
} else {
	db = firebase.firestore();
	if (process.browser) {
		db.settings({timestampsInSnapshots: true});
	}
}

export default db;
