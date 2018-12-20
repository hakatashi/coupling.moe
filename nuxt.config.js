module.exports = {
	build: {
		postcss: {
			precss: {},
			'postcss-import-url': {
				modernBrowser: true,
			},
		},
		extend(config) {
			config.node = {
				fs: 'empty',
				dns: 'empty',
				module: 'empty',
				net: 'empty',
				tls: 'empty',
			};
		},
		html: {
			minify: {
				minifyCSS: false,
				minifyJS: false,
			},
		},
	},

	loading: {color: '#3B8070'},

	manifest: {
		name: 'カップリングDB',
		short_name: 'カップリングDB',
		theme_color: '#3B8070',
		gcm_sender_id: '103953800507',
	},

	modules: [
		'@nuxtjs/pwa',
	],

	env: {
		VAPID_KEY: 'BNwKlUsy_JXMtIFPCH2PCcZ213I6QZJt27ZwiqhKzNf-f0XeYQDdfGE165x3M49fEaMAH-B9Z0oQhK4gCI_R68o',
	},

	plugins: ['~/plugins/vuetify', '~/plugins/vue-resize'],

	css: ['vuetify/dist/vuetify.css', 'vue-resize/dist/vue-resize.css'],

	generate: {
		routes: async () => {
			// eslint-disable-next-line global-require
			const firebase = require('./lib/firebase.js');
			const db = firebase.firestore();
			const characters = await db.collection('characters').get();
			const couplings = await db.collection('couplings').get();
			return [
				'/',
				'/imas346/',
				...characters.docs.map((character) => `/imas346/${character.get('name')}`),
				...couplings.docs.map((coupling) => {
					const character1 = characters.docs.find((character) => character.id === coupling.get('character1').id);
					const character2 = characters.docs.find((character) => character.id === coupling.get('character2').id);
					return `/imas346/${character1.get('name')}/x/${character2.get('name')}`;
				}),
			];
		},
		concurrency: 50,
	},
};
