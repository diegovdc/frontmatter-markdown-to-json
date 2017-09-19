const fs = require('fs')
const fm = require('front-matter')
const marked = require('marked');
const glob = require('glob')
const R = require('ramda')
const {readAsText, writeFile} = require('coral-fs-tasks')
const Task = require('data.task')
const getDir = dir => glob.sync(`./content/**/*.md`)
const formatJson = require('format-json-pretty');

let parse = R.compose(
	content => R.assoc('body', marked(content.body), content),
	fm
)

let groupFilesByFolder = R.compose(
	R.map(R.map(x => parse(x.content))),
	R.groupBy(x => x.folder)
)

let fileTask = path => R.composeK(
	file => Task.of({folder: path.split('/').slice(2)[0], content: file}),
	readAsText('utf8')
)(path)

const writeJsons = obj => 
	R.sequence(
		Task.of, 
		R.map(key => 
			writeFile('./', {filename:key+'.json' ,buffer:JSON.stringify(obj[key])}), 
		Object.keys(obj))
	)


let files = R.sequence(Task.of, R.map(fileTask, getDir()))
	.map(groupFilesByFolder)
	.chain(writeJsons)
	.fork(console.log, s => console.log('Alles Gut!'))
