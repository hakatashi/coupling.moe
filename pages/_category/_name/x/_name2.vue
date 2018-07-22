<template>
	<div>
		<v-progress-linear v-if="isLoading" :style="{margin: 0}" :indeterminate="true"></v-progress-linear>
		<div class="display-3">
			{{coupling ? coupling.names[0] : `${$route.params.name}×${$route.params.name2}`}}
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
									v-for="image in coupling ? coupling.images : []"
									:key="image.link"
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
	computed: {
		coupling() {
			return this.$store.getters['couplings/getByCharacterNames']([
				this.$route.params.name,
				this.$route.params.name2,
			])[0];
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
</style>
