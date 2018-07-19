<template>
	<div class="display-3">
		{{character ? character.name : '---'}}
	</div>
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
