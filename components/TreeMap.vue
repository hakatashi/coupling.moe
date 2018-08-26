<template>
	<div>
	</div>
</template>

<script>
	import initial from 'lodash/initial';
	import last from 'lodash/last';
	import get from 'lodash/get';
	import set from 'lodash/set';

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
				const target = path.length === 0 ? clonedTree : get(clonedTree, path)
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

	console.log(require('util').inspect(generateTrees([1, 2, 3, 4, 5]), { depth: null }));
</script>

<style>
</style>
