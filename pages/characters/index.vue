<template>
	<v-list>
		<v-list-tile v-for="character in characters" :key="character.id" nuxt :to="`/characters/${character.name}`">
			<v-list-tile-avatar>
				<img :src="character.imageUrl">
			</v-list-tile-avatar>
			<v-list-tile-content>
				<v-list-tile-title>
					{{character.name}}
				</v-list-tile-title>
			</v-list-tile-content>
		</v-list-tile>
	</v-list>
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
		...mapState({
			characters: (state) => state.characters.list,
		}),
	},
	created() {
	},
	mounted() {
		this.$store.dispatch('characters/init');
	},
	destroyed() {
	},
	methods: {
	},
};
</script>

<style>
</style>
