const path = require('path');

const { Builder } = require('broccoli');
const JSCodeShift = require('broccoli-jscodeshift');
const Funnel = require('broccoli-funnel');
const TreeSync = require('tree-sync');

function runTransform(transform) {
  const { target, dummy } = this.options;
  const applicationPath = dummy ? 'app' : 'tests/dummy/app';
  const appDirectory = path.join(target, applicationPath);

  let tree;
  tree = new Funnel(appDirectory, {
    include: ['**/*.*', '**/.gitkeep']
  });
  tree = new JSCodeShift(tree, {
    transform: path.join(__dirname, '../lib/transforms/install-custom-events.js')
  });

  const builder = new Builder(tree);
  return builder.build().then(() => {
    const outputTree = new TreeSync(builder.outputPath, appDirectory);
    outputTree.sync();
  });
}

module.exports = function(blueprint) {
  return Object.assign({}, blueprint, {
    runTransform
  });
}
