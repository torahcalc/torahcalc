/**
 * Script that runs on the output of the Nearley parser to make fixes.
 *
 * - Fixes top-level import issue by removing the import statement within the function and replacing it at the top of the file.
 */

import { readFileSync, writeFileSync } from 'fs';

let grammar = readFileSync('./src/lib/grammars/_output.cjs', 'utf8');

const importRegex = /^import .* from ".*";$/gm;

// iterate over all matches, store them in an array, and remove them from the grammar
/** @type {string[]} */
const imports = [];
grammar = grammar.replace(importRegex, (match) => {
	imports.push(match);
	return '';
});

// add the imports to the top of the grammar
grammar = imports.join('\n') + '\n' + grammar;

writeFileSync('./src/lib/grammars/_output.cjs', grammar);
