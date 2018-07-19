<template>
	<v-container grid-list-sm text-xs-center wrap>
		<v-progress-linear v-if="isLoading" :style="{margin: 0}" :indeterminate="true"></v-progress-linear>
		<v-list>
			<v-layout row wrap>
				<v-flex v-for="character in characters" :key="character.id" xs12 sm6 md4 lg3 xl2>
					<v-list-tile nuxt :to="`/characters/${character.name}`">
						<v-list-tile-avatar>
							<img :src="character.imageUrl">
						</v-list-tile-avatar>
						<v-list-tile-content>
							<v-list-tile-title>
								{{character.name}}
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
		...mapState({
			isLoading: (state) => (
				!state.characters.isInitList
			),
			characters: (state) => {
				if (!state.characters.list) {
					return [];
				}

				return state.characters.list.slice().sort((a, b) => a.ruby.localeCompare(b.ruby));
			},
		}),
	},
	created() {
	},
	mounted() {
		this.$store.dispatch('characters/initList');
	},
	destroyed() {
	},
	methods: {
	},
};
</script>

<style>
</style>
