<template>
	<div/>
</template>

<script>
import get from 'lodash/get';
import initial from 'lodash/initial';
import last from 'lodash/last';
import range from 'lodash/range';
import set from 'lodash/set';
import sum from 'lodash/sum';
import sumBy from 'lodash/sumBy';

const deepClone = (d) => JSON.parse(JSON.stringify(d));

const generateTrees = (leaves) => {
	if (leaves.length === 1) {
		return [[leaves[0]]];
	}

	const trees = [];
	const newLeaf = last(leaves);

	const traverse = (originalTree, tree, path) => {
		if (Array.isArray(tree)) {
			const clonedTree = deepClone(originalTree);
			const target = path.length === 0 ? clonedTree : get(clonedTree, path);
			target.push(newLeaf);
			trees.push(clonedTree);

			if (tree.length !== 1) {
				for (const [index, item] of tree.entries()) {
					traverse(originalTree, item, [...path, index]);
				}
			}
		} else {
			const clonedTree = deepClone(originalTree);
			set(clonedTree, path, [tree, newLeaf]);
			trees.push(clonedTree);
		}
	};

	for (const tree of generateTrees(initial(leaves))) {
		traverse(tree, tree, []);
	}

	return trees;
};

const getTreeRatio = (images, tree, isColumn) => {
	const newRatios = tree.map((item) => {
		if (Array.isArray(item)) {
			return getTreeRatio(images, item, !isColumn);
		}
		return images[item].ratio;
	});

	if (isColumn) {
		return sum(newRatios);
	}

	return 1 / sumBy(newRatios, (ratio) => 1 / ratio);
};

const findLayout = (images, targetRatio) => {
	const trees = generateTrees(range(images.length));
	let minDistance = Infinity;
	let minTree = null;

	for (const tree of trees) {
		for (const isColumnFirst of [true, false]) {
			const ratio = getTreeRatio(images, tree, isColumnFirst);
			if (Math.abs(targetRatio - ratio) < minDistance) {
				minDistance = Math.abs(targetRatio - ratio);
				minTree = {tree, isColumnFirst};
			}
		}
	}

	const getLayout = (tree) => {
		if (Array.isArray(tree)) {
			return tree.map((item) => getLayout(item));
		}

		return images[tree];
	};

	return {tree: getLayout(minTree.tree), isColumnFirst: minTree.isColumnFirst};
};

export default {
	props: {
		images: {
			required: true,
			type: Array,
		},
	},
	data() {
		return {
			layout: [],
		};
	},
	watch: {
		images(oldImages, newImages) {
			this.regenerateLayout(newImages);
		},
	},
	created() {
		this.regenerateLayout(this.images);
	},
	methods: {
		regenerateLayout(images) {
			this.layout = findLayout(
				images.map(({image, link}) => ({
					link,
					ratio: Math.max(1 / 3, Math.min(image.width / image.height, 3)),
				})),
				3
			);
		},
	},
};
</script>
