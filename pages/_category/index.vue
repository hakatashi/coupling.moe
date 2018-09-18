<template>
	<v-container
		grid-list-sm
		text-xs-center
		wrap
	>
		<v-progress-linear
			v-if="isLoading"
			:style="{margin: 0}"
			:indeterminate="true"
		/>
		<v-list>
			<v-layout
				row
				wrap
			>
				<v-flex
					v-for="character in characters"
					:key="character.id"
					xs12
					sm6
					md4
					lg3
					xl2
				>
					<v-list-tile
						:to="`/${$route.params.category}/${character.name}/`"
						nuxt
					>
						<v-list-tile-avatar>
							<img :src="character.imageUrl.replace(/^https:\/\/i\.pximg\.net\/c\/128x128\//, 'https://i-mail.pximg.net/c/360x360_70/')">
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

export default {
	data() {
		return {
		};
	},
	async fetch({store}) {
		if (!process.browser) {
			await store.dispatch('characters/initList');
		}
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
	mounted() {
		this.$store.dispatch('characters/initList');
	},
	methods: {
	},
	head() {
		return {
			title: 'キャラクター一覧 - カップリングデータベース',
		};
	},
};
</script>

<style>
</style>
