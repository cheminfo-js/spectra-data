# spectra-data

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![David deps][david-image]][david-url]
  [![npm download][download-image]][download-url]

spectra-data project - used as a starting point for new libraries

## Configuration

 * Copy all files of this project
 * Edit :
  * package.json
  * bower.json
  * README.md
 * Put code in `src`, export from `src/index.js`
 * Put tests in `test`, use [mocha](http://mochajs.org/) and [should](http://shouldjs.github.io/)
 * Publish to npm `npm publish` (must be done for each release)
 * Publish to bower `bower publish` (only once)
 * Activate the hook on [travis](https://travis-ci.org/profile) (first test suite will be executed on next commit)

## Development

### Install dev dependencies

`npm install`

### Execute test suite

`npm test`

Or to test just one of the testing file

`npm test test/testSD.js`

http://unitjs.com/guide/should-js.html

You can test one of


## Build and distribute

### Be sure to have the last version

* git pull

### Change the version

Increment the version in:
* package.json
* bower.json

### Build dist files

`npm run build`

### Commit and push

* git commit
* git push

### Go on github

* https://github.com/cheminfo-js/spectra-data/releases
  * Create a new release
  * Attach binaries that is contained in the dist folder
* publish the release

### Publish the npm

npm publish

## Install a new dependence

You may go on http://www.npmjs.org and look for an interesting project

After you will enter

`npm install theNameOfTheProject --save` This will add this dependency in package.json

and load it in the project with a usual `require`




## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/spectra-data.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/spectra-data
[travis-image]: https://img.shields.io/travis/cheminfo-js/spectra-data/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/cheminfo-js/spectra-data
[david-image]: https://img.shields.io/david/cheminfo-js/spectra-data.svg?style=flat-square
[david-url]: https://david-dm.org/cheminfo-js/spectra-data
[download-image]: https://img.shields.io/npm/dm/spectra-data.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/spectra-data
