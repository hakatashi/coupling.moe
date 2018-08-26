<template>
	<div>
		<div class="character-header" :style="{backgroundColor: character ? character.color : 'grey'}">
			<div class="display-3 white--text">
				{{character ? character.name : $route.params.name}}
			</div>
			<div class="character-ruby headline white--text">
				{{character ? character.ruby : ''}}
			</div>
			<v-dialog
				v-model="isChangeColorDialogShowing"
				width="500"
			>
				<v-btn
					slot="activator"
					flat
					icon
					color="white"
					class="character-change-color"
				>
					<v-icon>
						format_color_fill
					</v-icon>
				</v-btn>
				<v-card class="change-color-dialog">
					<v-card-title
						class="headline grey lighten-2"
						primary-title
					>
						テーマカラーを変更する
					</v-card-title>
					<v-alert
						:value="true"
						type="warning"
					>
						テーマカラーは全ユーザー共通です
					</v-alert>
					<v-card-text>
						<div class="colors">
							<div
								v-for="color in themeColors"
								:key="color"
								class="color"
								:style="{
									backgroundColor: color,
								}"
								@click="onClickColor(color)"
							>
								<div
									v-if="selectedColor === color" class="circle"
									:style="{
										borderColor: color,
									}"
								>
								</div>
							</div>
						</div>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn
							color="primary"
							flat
							@click="onClickChangeColor"
						>
							変更する
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-avatar class="character-avatar" size="128" color="grey">
				<img :src="character && character.imageUrl.replace(/^https:\/\/i\.pximg\.net\/c\/128x128\//, 'https://i-mail.pximg.net/c/360x360_70/')">
			</v-avatar>
		</div>
		<v-container grid-list-sm text-xs-center wrap>
			<v-subheader>
				{{character ? character.name : $route.params.name}}のカップリング一覧
			</v-subheader>
			<v-progress-linear v-if="isLoading" :style="{margin: 0}" :indeterminate="true"></v-progress-linear>
			<v-list>
				<v-layout row wrap>
					<v-flex v-for="coupling in couplings" :key="coupling.id" xs12 sm6 md6 lg4 xl3>
						<v-list-tile nuxt :to="`/${$route.params.category}/${coupling.originalCharacter1.name}/x/${coupling.originalCharacter2.name}/`">
							<v-list-tile-avatar>
								<img :src="coupling.imageUrls[0] && coupling.imageUrls[0].replace(/^https:\/\/i\.pximg\.net\/c\/128x128\//, 'https://i-mail.pximg.net/c/360x360_70/')">
							</v-list-tile-avatar>
							<v-list-tile-content>
								<v-list-tile-title>
									{{coupling.names[0]}}
								</v-list-tile-title>
								<v-list-tile-sub-title>
									<span :style="{color: coupling.character1.color, fontWeight: 'bold'}">
										{{coupling.character1.name}}
									</span>
									×
									<span :style="{color: coupling.character2.color, fontWeight: 'bold'}">
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
import db from '~/lib/db.js';
import {themeColors} from '~/lib/constants.js';

const charactersRef = db.collection('characters');

export default {
	data() {
		return {
			isLoading: true,
			isChangeColorDialogShowing: false,
			themeColors,
			temporalColor: null,
		};
	},
	async fetch({store, params}) {
		if (!process.browser) {
			await store.dispatch('characters/bindByName', params.name);
		}
	},
	computed: {
		character() {
			return this.$store.getters['characters/getByName'](this.$route.params.name);
		},
		couplings() {
			const couplings = this.character ? this.$store.getters['couplings/getByCharacter'](this.character.id) : [];
			return couplings.map((coupling) => {
				if (coupling.isReversible && coupling.character2.name === this.character.name) {
					return {
						...coupling,
						originalCharacter1: coupling.character1,
						originalCharacter2: coupling.character2,
						character1: coupling.character2,
						character2: coupling.character1,
					};
				}

				return {
					...coupling,
					originalCharacter1: coupling.character1,
					originalCharacter2: coupling.character2,
				};
			});
		},
		selectedColor() {
			if (this.temporalColor === null && this.character) {
				return this.character.color;
			}

			return this.temporalColor;
		},
	},
	created() {
	},
	mounted() {
		this.$store.dispatch('characters/bindByName', this.$route.params.name).then(() => {
			this.isLoading = false;
		});
	},
	destroyed() {
	},
	methods: {
		onClickColor(color) {
			this.temporalColor = color;
		},
		async onClickChangeColor() {
			if (this.temporalColor !== null) {
				charactersRef.doc(this.character.id).update({
					color: this.temporalColor,
				});
				this.temporalColor = null;
			}
			this.isChangeColorDialogShowing = false;
		}
	},
	head() {
		return {
			title: `${this.$route.params.name} - カップリングデータベース`,
		};
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

.character-change-color {
	position: absolute;
	right: 0;
	bottom: 0;
}

.character-change-color:hover {
	position: absolute;
}

.character-avatar {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translate(-50%, 50%);
}

.change-color-dialog .colors {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
}

.change-color-dialog .colors::after {
	content: '';
	flex: auto;
}

.change-color-dialog .color {
	width: 30px;
	height: 30px;
	margin: 10px;
	border-radius: 50%;
	cursor: pointer;
	position: relative;
}

.change-color-dialog .color .circle {
	position: absolute;
	top: -6px;
	left: -6px;
	right: -6px;
	bottom: -6px;
	border-width: 3px;
	border-style: solid;
	border-radius: 50%;
}
</style>
