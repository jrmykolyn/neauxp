# Neauxp

![Neauxp](https://raw.githubusercontent.com/jrmykolyn/neauxp/master/neauxp.gif)

## Table of Contents
- [About](#about)
- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [Documentation](#documentation)
- [Attribution](#attribution)

## About
Neauxp protects you... from yourself. Use globs and regular expressions to stop bad code at commit time.

Neauxp exposes a CLI tool, as well as an importable module. Use the CLI with [Husky](https://www.npmjs.com/package/husky) to easily add an additional layer of protection around your codebase, or import the module and build your own workflow.

## Installation

To install Neauxp in a given project, run the following command:

```
npm install neauxp
```

## Setup

Neauxp is configured via `package.json`. To get started, add a `neauxp` field with a `patterns` key.

```
...
"neauxp": {
	"patterns": {
		"*foo*": [
			"Good",
			"Bad",
			"Double Plus Ungood"
		]
	}
}
...
```

Given the example above, Neauxp will check any files or file paths which contain the string 'foo' for the terms 'Good', 'Bad', and 'Double Plus Ungood'. If *any* of these terms are found in *any* of the matched files, Neauxp will throw an error.

## Usage

Neauxp is designed to be run at commit time, meaning that it plays well with tools like [Husky](https://www.npmjs.com/package/husky).

To get started, follow the Husky installation instructions [here](https://www.npmjs.com/package/husky#install), then update your project's `package.json` file to include the following script:

```
...
"scripts": {
	"precommit": "neauxp"
}
...
```

## Documentation
Currently, Neauxp does not include any external documentation.

For an overview of the project's evolution, please consult the CHANGELOG.

## Attribution
- `README.md` gif: https://giphy.com/gifs/basketball-jason-4DMoU35sYt1bW
