# ember-blueprint-jscodeshift

## Usage

Include the module in one of your blueprints and wrap the module in it. This gives you access to a `this.runTransform` method that will the codemod you provide the path to.

This can be a URL or the relative path to a transform in your repo.

```javascript
// blueprints/some-blueprint/index.js
const withCodeShift = require('ember-blueprint-jscodeshift');

module.exports = withCodeShift({
  name: 'some-blueprint',

  afterIntall() {
    return this.runTransform('../../lib/transforms/some-transform.js')
  }
});
```
