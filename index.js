const path = require('path');

const { Builder } = require('broccoli-builder');
const Funnel = require('broccoli-funnel');
const JSCodeShift = require('broccoli-jscodeshift');
const walkSync = require('walk-sync');
const FSTreeDiff = require('fs-tree-diff');
const debugFactory = require('debug');

const SAFE_PATHS = ['app/**/*.*', 'addon/**/*.*', 'tests/**/*.*'];

module.exports = function(blueprint) {
  return Object.assign({}, blueprint, {
    /* @private */
    _builderPath: undefined,

    files() {
      const debug = debugFactory(`ember-blueprint-jscodeshift:${this.name}`);

      // Only walk the transformed output path one time
      if (this._files) {
        debug('Files array already created, using that that');
        return this._files;
      }

      // If we have no yet walked the output path, do it now
      if (this._builderPath) {
        debug('Builder path is set; walking output tree %o', this._builderPath);

        const projectTree = new FSTreeDiff({
          entries: walkSync.entries(this.project.root, {
            globs: SAFE_PATHS,
            directories: false
          })
        });
        const buildOutputTree = new FSTreeDiff({
          entries: walkSync.entries(this._builderPath, {
            directories: false
          })
        });

        this._files = projectTree
          .calculatePatch(buildOutputTree)
          .filter(mod => mod[0] === 'change')
          .map(mod => mod[1]);

        debug('Updated output tree is %O', this._files);
        return this._files;
      }

      debug('No existing files or builder path set');
      return [];
    },

    filesPath() {
      if (this._builderPath) {
        return this._builderPath;
      }

      path.join(this.path, 'files');
    },

    beforeInstall({ project }) {
      const debug = debugFactory(`ember-blueprint-jscodeshift:${this.name}`);

      const projectTree = new Funnel(project.root, {
        include: SAFE_PATHS
      });

      const transforms = this.transforms.map(
        transform =>
          transform.match(/http?s:\/\//)
            ? transform
            : path.resolve(this.path, transform)
      );

      debug('Running transforms: %o', transforms);

      const transformedTree = transforms.reduce(
        (projectTree, transform) => new JSCodeShift(projectTree, { transform }),
        projectTree
      );

      const builder = new Builder(transformedTree);

      return builder.build().then(({ directory }) => {
        this._builderPath = directory;
      });
    }
  });
};
