/**
 * Script that runs on the output of the Nearley parser
 */

import { readFileSync, writeFileSync } from 'fs';

const path = './src/lib/grammars/generated/main.cjs';

changeExports(path);
addLintDisable(path);

/**
 * Moves all import statements to the top of the file by removing (function () { ... })()
 * @param {string} path - The path to the file to modify
 */
function changeExports(path) {
	let grammar = readFileSync(path, 'utf8');

	grammar = grammar.replace(/^\(function \(\) {$\n/m, '');

	// change if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') { module.exports = grammar;} else {window.grammar = grammar;} to export default grammar;
	grammar = grammar.replace(
		/if \(typeof module !== 'undefined'[ \n]*&&[ \n]*typeof module.exports !== 'undefined'\)[ \n]*{[ \n]*module.exports = grammar;[ \n]*}[ \n]*else[ \n]*{[ \n]*window.grammar = grammar;[ \n]*}[ \n]*\}\)\(\);/m,
		'export default grammar;'
	);

	writeFileSync(path, grammar);
}

/**
 * Add lint disable comment to the top of the file
 *
 * @param {string} path - The path to the file to modify
 */
function addLintDisable(path) {
	const grammar = [`// @ts-nocheck`, `/* eslint-disable */`].join('\n') + '\n' + readFileSync(path, 'utf8');
	writeFileSync(path, grammar);
}
