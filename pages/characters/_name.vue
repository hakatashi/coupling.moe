<template>
	<div>
		<div class="character-header" :style="{backgroundColor: character && character.color}">
			<div class="display-3 white--text">
				{{character ? character.name : '---'}}
			</div>
			<div class="character-ruby headline white--text">
				{{character ? character.ruby : '---'}}
			</div>
			<v-avatar class="character-avatar" size="128" color="grey">
				<img :src="character && character.imageUrl">
			</v-avatar>
		</div>
		<v-container grid-list-sm text-xs-center wrap>
			<v-subheader>
				{{character ? character.name : '---'}}のカップリング一覧
			</v-subheader>
			<v-progress-linear v-if="isLoading" :style="{margin: 0}" :indeterminate="true"></v-progress-linear>
			<v-list>
				<v-layout row wrap>
					<v-flex v-for="coupling in couplings" :key="coupling.id" xs12 sm6 md6 lg4 xl3>
						<v-list-tile nuxt :to="`/couplings/${coupling.id}`">
							<v-list-tile-avatar>
								<img :src="coupling.imageUrls[0]">
							</v-list-tile-avatar>
							<v-list-tile-content>
								<v-list-tile-title>
									{{coupling.names[0]}}
								</v-list-tile-title>
								<v-list-tile-sub-title>
									<span :style="{color: coupling.character1.color}">
										{{coupling.character1.name}}
									</span>
									×
									<span :style="{color: coupling.character2.color}">
										{{coupling.character2.name}}
									</span>
								</v-list-tile-sub-title>
							</v-list-tile-content>
						</v-list-tile>
					</v-flex>
				</v-layout>
			</v-list>
		</v-container>
	</div>
</template>

<script>
import {mapState} from 'vuex';
import firebase from '~/lib/firebase.js';

export default {
	data() {
		return {
			isLoading: true,
		};
	},
	computed: {
		character() {
			return this.$store.getters['characters/getByName'](this.$route.params.name);
		},
		couplings() {
			const couplings = this.character ? this.$store.getters['couplings/getByCharacter'](this.character.id) : [];
			return couplings.map((coupling) => {
				if (coupling.isReversible && coupling.character2.id === this.character.id) {
					return {
						...coupling,
						character1: coupling.character2,
						character2: coupling.character1,
					};
				}

				return coupling;
			});
		},
	},
	created() {
	},
	mounted() {
		this.$store.dispatch('characters/bind', this.$route.params.name).then(() => {
			this.isLoading = false;
		});
	},
	destroyed() {
	},
	methods: {
	},
};
</script>

<style>
.character-header {
	text-align: center;
	position: relative;
	padding-top: 32px;
	padding-bottom: 80px;
	margin-bottom: 64px;
}

.character-ruby {
	opacity: 0.5;
}

.character-avatar {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translate(-50%, 50%);
}
</style>
