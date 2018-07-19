<template>
	<v-container grid-list-sm text-xs-center wrap>
		<div class="display-3">
			{{character ? character.name : '---'}}
		</div>
		<v-list>
			<v-layout row wrap>
				<v-flex v-for="coupling in couplings" :key="coupling.id" xs12 sm6 md6 lg6 xl6>
					<v-list-tile nuxt :to="`/couplings/${coupling.id}`">
						<v-list-tile-avatar>
							<img :src="coupling.imageUrls[0]">
						</v-list-tile-avatar>
						<v-list-tile-content>
							<v-list-tile-title>
								{{coupling.names[0]}}
							</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-flex>
			</v-layout>
		</v-list>
	</v-container>
</template>

<script>
import {mapState} from 'vuex';
import firebase from '~/lib/firebase.js';

export default {
	data() {
		return {
		};
	},
	computed: {
		character() {
			return this.$store.getters['characters/getByName'](this.$route.params.name);
		},
		couplings() {
			return this.character ? this.$store.getters['couplings/getByCharacter'](this.character.id) : [];
		},
	},
	created() {
	},
	mounted() {
		this.$store.dispatch('characters/bind', this.$route.params.name);
	},
	destroyed() {
	},
	methods: {
	},
};
</script>

<style>
</style>
