<template>
	<div>
		<v-progress-linear v-if="isLoading" :style="{margin: 0}" :indeterminate="true"></v-progress-linear>
		<div class="coupling-name">
			<div class="coupling-title" :style="{opacity: isLoading ? 0.1 : 1}">
				{{coupling.names[0]}}
			</div>
			<div
				v-if="coupling.names.length > 1"
				class="coupling-subnames"
				:style="{opacity: isLoading ? 0.1 : 1, textAlign: 'center'}"
			>
				<span
					v-for="name in coupling.names.slice(1)"
					:key="name"
				>
					{{name}}
				</span>
			</div>
		</div>
		<div class="display-1 text-xs-center" :style="{opacity: isLoading ? 0.1 : 1, display: 'flex', flexDirection: 'row', justifyContent: 'center'}">
			<span :style="{color: character1.color, fontWeight: 'bold'}">{{character1.name}}</span>
			×
			<span :style="{color: character2.color, fontWeight: 'bold'}">{{character2.name}}</span>
		</div>
		<v-container grid-list-sm text-xs-center wrap>
			<v-subheader>
				{{coupling ? coupling.pixpediaDescription : ''}}
			</v-subheader>
			<v-layout>
				<v-flex>
					<v-card>
						<v-container grid-list-xs fluid>
							<v-layout row wrap>
								<v-flex
									v-if="coupling"
									v-for="image in coupling ? coupling.images : []"
									:key="image.id"
									xs4
								>
									<v-card
										:href="image.image && image.image.contextLink"
										target="_blank"
										flat
										tile
										nuxt
									>
										<v-card-media
											v-if="typeof image.link === 'string'"
											:src="image.link"
											height="150px"
										></v-card-media>
									</v-card>
								</v-flex>
							</v-layout>
						</v-container>
					</v-card>
				</v-flex>
			</v-layout>
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
			await store.dispatch('couplings/bindByCharacterNames', [
				params.name,
				params.name2,
			]);
		}
	},
	computed: {
		coupling() {
			return this.$store.getters['couplings/getByCharacterNames']([
				this.$route.params.name,
				this.$route.params.name2,
			])[0] || {
				names: [`${this.$route.params.name}×${this.$route.params.name2}`],
			};
		},
		character1() {
			if (this.coupling && this.coupling.character1 && this.coupling.character1.id) {
				return this.coupling.character1;
			}

			return {
				name: this.$route.params.name,
				color: '#222222',
			};
		},
		character2() {
			if (this.coupling && this.coupling.character2 && this.coupling.character2.id) {
				return this.coupling.character2;
			}

			return {
				name: this.$route.params.name2,
				color: '#222222',
			};
		},
	},
	created() {
	},
	mounted() {
		this.$store.dispatch('couplings/bindByCharacterNames', [
			this.$route.params.name,
			this.$route.params.name2,
		]).then(() => {
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
};
</script>

<style>
.coupling-title {
	text-align: center;
	line-height: 1em;
	font-size: 56px;
	font-family: coupling-font;
	font-weight: 900;
	color: #444;
	font-feature-settings: "palt";
}
.coupling-name {
	margin: 1em 0;
}
</style>
