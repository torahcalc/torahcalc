/**
 * Script that runs on the output of the Nearley parser
 */

import { readFileSync, writeFileSync } from 'fs';

const path = './src/lib/grammars/generated/main.cjs';

moveImportsToTop(path);
addLintDisable(path);

/**
 * Moves all import statements to the top of the file
 * @param {string} path - The path to the file to modify
 */
function moveImportsToTop(path) {
	let grammar = readFileSync(path, 'utf8');

	const importRegex = /^import .* from ".*";$\n/gm;

	// iterate over all matches, store them in an array, and remove them from the grammar
	/** @type {string[]} */
	const imports = [];
	grammar = grammar.replace(importRegex, (match) => {
		imports.push(match);
		return '';
	});

	// add the imports to the top of the grammar
	if (imports.length > 0) {
		grammar = imports.join('\n') + '\n' + grammar;
	}

	writeFileSync(path, grammar);
}

/**
 * Add lint disable comment to the top of the file
 * 
 * @param {string} path - The path to the file to modify
 */
function addLintDisable(path) {
	const grammar = [`// @ts-nocheck`,`/* eslint-disable */`].join("\n") + "\n" + readFileSync(path, 'utf8');
	writeFileSync(path, grammar);
}