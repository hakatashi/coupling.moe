<template>
	<div
		:style="{width, height}"
		:class="[className, {column}]"
		class="tree-map-component"
	>
		<div
			v-for="(item, index) in normalizedTree"
			:key="index"
			:style="{
				flexGrow: item.ratio * 100,
			}"
			:class="{leaf: !Array.isArray(item.tree)}"
			class="tree-map-component-item"
		>
			<tree-map-component
				v-if="Array.isArray(item.tree)"
				:tree="item.tree"
				:column="!column"
				width="100%"
				height="100%"
			/>
			<a
				v-else
				:style="{
					backgroundImage: `url(${item.tree.link})`,
				}"
				:href="item.tree.contextLink"
				target="_blank"
				noopener
				class="tree-map-component-image"
			/>
		</div>
	</div>
</template>

<script>
import sum from 'lodash/sum';
import sumBy from 'lodash/sumBy';

const getTreeRatio = (tree, isColumn) => {
	const newRatios = tree.map((item) => {
		if (Array.isArray(item)) {
			return getTreeRatio(item, !isColumn);
		}
		return item.ratio;
	});

	if (isColumn) {
		return 1 / sumBy(newRatios, (ratio) => 1 / ratio);
	}

	return sum(newRatios);
};

export default {
	name: 'TreeMapComponent',
	props: {
		width: {
			type: String,
			default: '',
		},
		height: {
			type: String,
			default: '',
		},
		className: {
			type: String,
			default: '',
		},
		tree: {
			required: true,
			type: Array,
		},
		column: {
			required: true,
			type: Boolean,
		},
	},
	computed: {
		normalizedTree() {
			return this.tree.map((item) => {
				const ratio = getTreeRatio([item], this.column);
				if (this.column) {
					return {ratio: 1 / ratio, tree: item};
				}
				return {ratio, tree: item};
			});
		},
	},
};
</script>

<style>
.tree-map-component {
	display: flex;
	flex-direction: row;
}

.tree-map-component.column {
	flex-direction: column;
}

.tree-map-component-item {
	flex-basis: 0;
	flex-shrink: 0;
}

.tree-map-component-item.leaf {
	padding: 1px;
}

.tree-map-component-image {
	display: block;
	background-color: lightgrey;
	background-size: cover;
	background-position: center;
	width: 100%;
	height: 100%;
}
</style>
