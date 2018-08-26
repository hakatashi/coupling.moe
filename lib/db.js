/* eslint global-require: off */

import firebase from './firebase';

let db = null;

if (process.env.NUXT_USE_MONGODB === 'true' && !process.browser) {
	class Document {
		constructor(collection, name) {
			this.type = 'document';
			this.collection = collection;
			this.name = name;
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
