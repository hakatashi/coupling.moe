<template>
	<div>
		<div class="character-header" :style="{backgroundColor: isLoading ? 'grey' : 'blue'}">
			<div class="display-3 white--text">
				{{coupling ? coupling.names[0] : `${$route.params.name}×${$route.params.name2}`}}
			</div>
			<div class="character-ruby headline white--text">
				うめみれ
			</div>
			<v-avatar class="character-avatar" size="128" color="grey">
				<img src="">
			</v-avatar>
		</div>
		<v-container grid-list-sm text-xs-center wrap>
			<v-subheader>
				ほげ
			</v-subheader>
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
