<template>
	<section class="container">
		<div>
			<logo/>
			<h1 class="title">
				NUXT
			</h1>
			<h2 class="subtitle">
				PWA Vue.js Application
			</h2>
			<button
				type="button"
				@click="handleClickButton"
				class="button--green counter"
				:disabled="!online"
			>
				{{counter}}
			</button>
			<div :class="['network', online ? 'online' : 'offline']">
				<div class="circle"/>
				{{online ? 'online' : 'offline'}}
			</div>
			<div class="links">
				<a
					href="https://nuxtjs.org/"
					target="_blank"
					class="button--green"
					rel="noopener">Documentation</a>
				<a
					href="https://github.com/nuxt/nuxt.js"
					target="_blank"
					class="button--grey"
					rel="noopener">GitHub</a>
			</div>
		</div>
	</section>
</template>

<script>
import Logo from '~/components/Logo.vue';
import {mapGetters} from 'vuex';
import firebase from '~/lib/firebase.js';
import db from '~/lib/db.js';

export default {
	components: {Logo},
	data() {
		return {
			online: true,
		};
	},
	computed: {
		...mapGetters(['counter']),
	},
	created() {
		this.usersRef = db.collection('users');
	},
	mounted() {
		if (!window.navigator) {
			this.online = false;
			return;
		}

		this.online = Boolean(window.navigator.onLine);
		this.$store.dispatch('init');
		this.enableNotification();

		window.addEventListener('offline', this.handleNetworkChange);
		window.addEventListener('online', this.handleNetworkChange);
	},
	destroyed() {
		window.removeEventListener('offline', this.handleNetworkChange);
		window.removeEventListener('online', this.handleNetworkChange);
	},
	methods: {
		handleNetworkChange({type}) {
			this.online = type === 'online';
		},
		handleClickButton() {
			if (!this.online) {
				return;
			}

			this.$store.dispatch('increment');
		},
		async enableNotification() {
			if (process.browser) {
				const {user} = await firebase.auth().signInAnonymously();

				this.messaging = firebase.messaging();
				this.messaging.usePublicVapidKey(process.env.VAPID_KEY);
				await this.messaging.requestPermission();
				const token = await this.messaging.getToken();
				await this.usersRef.doc(user.uid).set({
					notificationToken: token,
				});

				this.messaging.onMessage((payload) => {
					console.log('onMessage:', payload);
				})
			}
		},
	},
};
</script>

<style>
</style>
