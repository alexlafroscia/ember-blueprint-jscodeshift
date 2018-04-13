# ember-blueprint-jscodeshift

> Aid addon installation by running a codemod on the host application

![Demo of installing an addon and automatically running a codemod](./docs/demo.gif)

## Motivation

In my experience, Ember addon authors often have a choice to make around providing a great installation experience for their users:

- Force the user to manually modify their application after installation
- Include some global code that the user has no control over and doesn't necessary even know exists
- Add a blueprint that defines files that override existing default ones, blowing away the users' changes and forcing them to clean up the difference

This library provides an alternative; using a codemod, modify the user's existing files while allowing them to approve each file change individually.

## Usage

First, install the library

```bash
yarn add ember-blueprint-jscodeshift
```

Next, include it in the blueprint that you want to invoke the codemod. Normally this will be a blueprint that matches the name of your addon, since that is run automatically when the addon is installed.

Now you can define a set of JSCodeShift transforms to run whenever this generator is invoked. Note that a transform can be a URL or a relative path to one.

```javascript
// blueprints/some-blueprint/index.js
const withCodeShift = require('ember-blueprint-jscodeshift');

module.exports = withCodeShift({
  transforms: [
    '../../lib/transforms/some-transform.js'
  ]
});
```

## Caveats

- This library works by hijacking the way that a blueprint can add files to an application. It will not work with an existing `files` directory in the same blueprint.
- This library defines a `beforeInstall` hook for you, so your blueprint should not have its own. `afterInstall` is fine, however, if you want to add additional libraries to the application as part of installation.
