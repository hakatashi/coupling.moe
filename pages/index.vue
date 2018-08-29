<template>
	<section class="container">
		<div>
			現在の尊み <button
				:disabled="!online"
				type="button"
				class="button--green counter"
				@click="handleClickButton"
			>
				{{counter}}
			</button>
			<div class="links">
				<nuxt-link
					to="/imas346/"
					class="button--green"
					rel="noopener"
				>
					デレマス キャラ一覧
				</nuxt-link>
			</div>
		</div>
	</section>
</template>

<script>
import db from '~/lib/db.js';
import firebase from '~/lib/firebase.js';
import {mapGetters} from 'vuex';

export default {
	async fetch({store}) {
		if (!process.browser) {
			await store.dispatch('init');
		}
	},
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
				});
			}
		},
	},
	head() {
		return {
			title: 'トップページ - カップリングデータベース',
		};
	},
};
</script>

<style>
.links {
	margin-top: 1em;
}
</style>
