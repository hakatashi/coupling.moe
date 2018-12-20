/* eslint global-require: off, no-loop-func: off, no-underscore-dangle: off, private-props/no-use-outside: off */

import assert from 'assert';
import firebase from './firebase';
import set from 'lodash/set';

let db = null;

if (process.env.NUXT_USE_MONGODB === 'true' && !process.browser) {
	const mongoPromise = (async () => {
		const {MongoClient} = require('mongodb');
		const mongoClient = await MongoClient.connect('mongodb://localhost:27017/');
		return mongoClient.db('coupling-moe');
	})();

	const populate = async (data) => {
		const mongo = await mongoPromise;
		const caches = new Map();
		let hasNewDocument = true;

		while (hasNewDocument) {
			hasNewDocument = false;

			// Walk to get Object to populate
			const walk = (value, path) => {
				if (value === undefined || value === null) {
					return;
				}

				if ({}.hasOwnProperty.call(value, '__ref')) {
					const cacheKey = JSON.stringify(value.__ref);
					if (!caches.has(cacheKey)) {
						caches.set(cacheKey, {ref: value.__ref, doc: null, paths: []});
					}

					const cache = caches.get(cacheKey);

					if (cache.doc === null) {
						cache.paths.push(path);
					} else {
						set(data, path, cache.doc);
					}
				} else if (Array.isArray(value)) {
					for (const [index, item] of value.entries()) {
						walk(item, [...path, index]);
					}
				} else if (value.constructor === Object) {
					for (const [key, item] of Object.entries(value)) {
						walk(item, [...path, key]);
					}
				}
			};

			walk(data, []);

			await Promise.all([...caches.values()].filter(({doc}) => doc === null).map(async (cache) => {
				const {ref: [collection, id], paths} = cache;
				const doc = await mongo.collection(collection).findOne({_id: id});
				cache.doc = doc;
				hasNewDocument = true;
				for (const path of paths) {
					set(data, path, doc);
				}
			}));
		}

		return data;
	};

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
			const populatedData = await populate(data);
			return populatedData;
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
			const populatedData = await populate(data);

			if (this.query === null) {
				return populatedData;
			}

			return {
				size: populatedData.length,
				empty: populatedData.length === 0,
				docs: populatedData.map((datum) => ({
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
