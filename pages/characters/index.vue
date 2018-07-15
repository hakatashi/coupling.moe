<template>
	<ul>
		<li v-for="character in characters">
			{{character.name}}
		</li>
	</ul>
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
