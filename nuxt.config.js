const firebase = require('./lib/firebase.js');
const db = firebase.firestore();

module.exports = {
	build: {},

	head: {},

	loading: {color: '#3B8070'},

	manifest: {
		name: 'カップリングDB',
		short_name: 'カップリングDB',
		theme_color: '#3B8070',
		gcm_sender_id: '103953800507',
	},

	modules: ['@nuxtjs/pwa'],

	env: {
		VAPID_KEY: 'BNwKlUsy_JXMtIFPCH2PCcZ213I6QZJt27ZwiqhKzNf-f0XeYQDdfGE165x3M49fEaMAH-B9Z0oQhK4gCI_R68o',
	},

	plugins: [
		'~/plugins/vuetify',
	],

	css: [
		'vuetify/dist/vuetify.css',
	],

	head: {
		link: [
			{rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons'},
		],
	},

	generate: {
		routes: async () => {
			const characters = await db.collection('characters').get();
			return characters.docs.map((character) => (
				`/characters/${character.get('name')}`
			));
		},
	},
};
