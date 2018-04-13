# ember-blueprint-jscodeshift

> Aid addon installation by running a codemod on the host application

## Motivation

In my experience, Ember addon authors often have a tough time creating a great installation experience for their addons

- Forcing the user to manually modify their application after installation makes the process harder than it needs to be
- Including global code in the `vendor.js` goes against best practices and can confuse users, as the addon seems to "magically" appear
- Adding a blueprint that defines `files` that override default ones can blow away customizations that the user has already made, pushing the "pain" of resolving how to modify the files onto the user

This library provides an alternative; using a codemod, script the installation in a way that allows the user to approve each change while avoiding the need for them to manually edit each file themselves.

## Installation

```bash
yarn add ember-blueprint-jscodeshift
```

## Usage

Include the library in one of your blueprints and wrap the module in it.

Now you can define a set of JSCodeShift transforms to run whenever this generator is invoked. For example, if you want to run some installation codemod when you addon is installed, you would add the following to the blueprint that matches the name of your addon.

Node that a transform can be a URL or a relative path to a transform in your addon.

```javascript
// blueprints/some-blueprint/index.js
const withCodeShift = require('ember-blueprint-jscodeshift');

module.exports = withCodeShift({
  transforms: [
    '../../lib/transforms/some-transform.js'
  ]
});
```

For each modification that is made to the application, the user will be prompted to accept the file change. They can choose to accept, deny, or see more information about the modifications being made, just like when using the blueprint `files` directory.

## Caveats

- This library works by hijacking the way that a blueprint can add files to an application. It will not work with an existing `files` directory in the same blueprint.
- This library defines a `beforeInstall` hook for you, so your blueprint should not have its own. `afterInstall` is fine, however, if you want to add additional libraries to the application as part of installation.
