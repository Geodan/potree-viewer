import resolve from 'rollup-plugin-node-resolve';


export default {
  // If using any exports from a symlinked project, uncomment the following:
  // preserveSymlinks: true,
	input: ['demo-app.js'],
	output: {
		file: 'build/demo-app.js',
		format: 'es',
		sourcemap: true
	},
	plugins: [
	    resolve()
	]
};