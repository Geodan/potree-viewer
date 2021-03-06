import resolve from 'rollup-plugin-node-resolve';


export default {
  // If using any exports from a symlinked project, uncomment the following:
  // preserveSymlinks: true,
        input: ['src/potree-viewer.js'],
        output: {
                file: 'build/potree-viewer.js',
                format: 'iife',
                sourcemap: true
        },
        plugins: [
            resolve()
        ]
};
