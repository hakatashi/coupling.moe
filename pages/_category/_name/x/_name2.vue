<template>
	<div>
		<v-progress-linear
			v-if="isLoading"
			:style="{margin: 0}"
			:indeterminate="true"
		/>
		<div class="coupling-name">
			<div
				:style="{opacity: isLoading ? 0.1 : 1, height: `${titleScale * 16}px`}"
				class="coupling-title"
			>
				<span
					ref="title"
					:style="{transform: `scale(${titleScale})`}"
				>
					<div
						class="stripe"
						:style="{
							backgroundImage: `
								repeating-linear-gradient(
									30deg,
									${character1.color},
									${character1.color} 2px,
									${character2.color} 2px,
									${character2.color} 4px
								)
							`,
						}"
					/>
					{{coupling.names[0]}}
					<resize-observer @notify="onResize"/>
				</span>
			</div>
			<div
				v-if="coupling.names.length > 1"
				:style="{opacity: isLoading ? 0.1 : 1, textAlign: 'center'}"
				class="coupling-subnames"
			>
				<span
					v-for="name in coupling.names.slice(1)"
					:key="name"
				>
					{{name}}
				</span>
			</div>
		</div>
		<div
			:style="{opacity: isLoading ? 0.1 : 1, display: 'flex', flexDirection: 'row', justifyContent: 'center'}"
			class="display-1 text-xs-center"
		>
			<nuxt-link
				:to="`/imas346/${character1.name}/`"
				:style="{
					color: character1.color,
					fontWeight: 'bold',
				}"
			>
				{{character1.name}}
			</nuxt-link>
			×
			<nuxt-link
				:to="`/imas346/${character2.name}/`"
				:style="{
					color: character2.color,
					fontWeight: 'bold',
				}"
			>
				{{character2.name}}
			</nuxt-link>
		</div>
		<v-subheader>
			{{coupling ? coupling.pixpediaDescription : ''}}
		</v-subheader>
		<div class="tree-maps">
			<tree-map :images="coupling ? coupling.images.slice(0, 5).filter(({image}) => image) : []"/>
			<tree-map :images="coupling ? coupling.images.slice(5, 10).filter(({image}) => image) : []"/>
		</div>
	</div>
</template>

<script>
import TreeMap from '~/components/TreeMap.vue';

export default {
	components: {TreeMap},
	data() {
		return {
			isLoading: true,
			isChangeColorDialogShowing: false,
			temporalColor: null,
			titleScale: 1,
		};
	},
	async fetch({store, params}) {
		if (!process.browser) {
			await store.dispatch('couplings/bindByCharacterNames', [params.name, params.name2]);
		}
	},
	computed: {
		coupling() {
			return (
				{
					names: [`${this.$route.params.name}×${this.$route.params.name2}`],
					images: [],
					...this.$store.getters['couplings/getByCharacterNames']([this.$route.params.name, this.$route.params.name2])[0],
				}
			);
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
	mounted() {
		this.$store.dispatch('couplings/bindByCharacterNames', [this.$route.params.name, this.$route.params.name2]).then(() => {
			this.isLoading = false;
		});
		window.addEventListener('resize', this.resizeTitle);
		this.resizeTitle();
	},
	destroyed() {
		window.removeEventListener('resize', this.resizeTitle);
	},
	methods: {
		onResize() {
			this.resizeTitle();
		},
		resizeTitle() {
			if (!this.$el || !this.$refs.title) {
				return;
			}
			const targetWidth = this.$el.clientWidth * 0.95;
			const targetScale = Math.min(5, targetWidth / this.$refs.title.clientWidth);
			this.titleScale = targetScale;
		},
	},
	head() {
		return {
			title: `${this.coupling.names[0]} (${this.$route.params.name}×${this.$route.params.name2}) - カップリングデータベース`,
		};
	},
};
</script>

<style>
.coupling-title {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;

	line-height: 1em;
	font-family: coupling-font;
	font-weight: 900;
	font-feature-settings: 'palt';
	font-size: 16px;

	color: #444;

	.title {
		display: inline-block;
		white-space: nowrap;
		position: relative;
	}

	.stripe {
		position: absolute;
		bottom: 0.05em;
		left: -3px;
		right: -3px;
		height: 0.15em;
		z-index: -1;
		opacity: 0.5;
	}
}
.coupling-name {
	margin: 1em 0;
}
.tree-maps {
	display: flex;
	justify-content: center;
	flex-direction: column;

	@media (min-width: 720px) {
		flex-direction: row;
	}

	.tree-map {
		width: 100vw;
		height: 40vw;

		@media (min-width: 720px) {
			width: 50vw;
			height: 20vw;
		}
	}
}
</style>
