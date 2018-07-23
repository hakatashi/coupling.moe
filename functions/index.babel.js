const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const {google} = require('googleapis');
const {promisify, inspect} = require('util');

firebase.initializeApp();
const db = firebase.firestore();
const couplingsRef = db.collection('couplings');
const imagesRef = db.collection('images');

const customsearch = google.customsearch('v1');

exports.helloWorld = functions.https.onRequest((request, response) => {
	response.send('Hello from Firebase!');
});

exports.incrementCounter = functions.pubsub.topic('minute-tick').onPublish(async () => {
	const counterRef = db.collection('counter').doc('counter');
	await db.runTransaction(async (transaction) => {
		const counterTransaction = await transaction.get(counterRef);
		transaction.update(counterRef, {
			value: counterTransaction.data().value + 1,
		});
	});
});

exports.updateImages = functions.pubsub.topic('fifteen-minute-tick').onPublish(async () => {
	const googleClient = await google.auth.getClient({
		scopes: [
			'https://www.googleapis.com/auth/cloud-platform',
			'https://www.googleapis.com/auth/cse',
		],
		projectId: 'coupling-moe',
		keyFilename: 'service-account.json',
	});

	let coupling = null;
	const couplings = await couplingsRef.where('imagesUpdatedAt', '==', null).limit(1).get();

	if (couplings.size > 0) {
		coupling = couplings.docs[0];
	} else {
		const fetchedCouplings = await couplingsRef.orderBy('imagesUpdatedAt').limit(1).get();
		if (fetchedCouplings.size > 0) {
			coupling = fetchedCouplings.docs[0];
		} else {
			return;
		}
	}

	console.log(`Fetching images for ${inspect(coupling.data())}`);

	const searchResult = await customsearch.cse.list({
		q: `${coupling.get('names').map((name) => `"${name}"`).join(' OR ')} アイドルマスターシンデレラガールズ`,
		cx: functions.config().cronjobs.customsearch_engine_id,
		lr: 'lang_ja',
		num: 10,
		searchType: 'image',
		auth: googleClient,
	});

	const images = [];

	for (const item of searchResult.data.items) {
		const result = await imagesRef.where('link', '==', item.link).get();

		if (result.empty) {
			const imageRef = await imagesRef.add(item);
			images.push(imageRef);
			console.log(`Added ${item.link}: ${inspect(item)}`);
		} else {
			await result.docs[0].ref.update(item);
			images.push(result.docs[0].ref);
			console.log(`Updated ${item.link}: ${inspect(item)}`);
		}
	}

	await coupling.ref.update({
		images,
		imagesUpdatedAt: new Date(),
	});
});
