module.exports = {

	/*
	 ** Build configuration
	 */
	build: {},

	/*
	 ** Headers
	 ** Common headers are already provided by @nuxtjs/pwa preset
	 */
	head: {},

	/*
	 ** Customize the progress-bar color
	 */
	loading: {color: '#3B8070'},

	/*
	 ** Customize app manifest
	 */
	manifest: {
		name: 'カップリングDB',
		short_name: 'カップリングDB',
		theme_color: '#3B8070',
		gcm_sender_id: '103953800507',
	},

	/*
	 ** Modules
	 */
	modules: ['@nuxtjs/pwa'],

	env: {
		VAPID_KEY: 'BNwKlUsy_JXMtIFPCH2PCcZ213I6QZJt27ZwiqhKzNf-f0XeYQDdfGE165x3M49fEaMAH-B9Z0oQhK4gCI_R68o',
	},

	plugins: [
		'~/plugins/vuetify',
	],

	css: [
		'vuetify/dist/vuetify.css',
	]
};
