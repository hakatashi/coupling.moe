/* eslint global-require: off */

import firebase from './firebase';
import assert from 'assert';

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
		constructor(name, query = null) {
			this.type = 'collection';
			this.name = name;
			this.query = query;
		}

		doc(name) {
			return new Document(this, name);
		}

		where(field, condition, value) {
			assert(condition === '==');

			const query = {
				...(this.query || {}),
				[field]: value,
			};

			return new Collection(this.name, query);
		}

		async get() {
			const mongo = await mongoPromise;
			const collection = mongo.collection(this.name);
			const docs = await collection.find(this.query || {});
			const data = await docs.toArray();

			if (this.query === null) {
				return data;
			}

			return {
				size: data.length,
				empty: data.length === 0,
				docs: data.map((datum) => ({
					id: datum._id,
					ref: this.doc(datum._id),
				})),
			};
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
