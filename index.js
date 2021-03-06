const fs = require('fs')
const path = require('path')
const fm = require('front-matter')
const marked = require('marked');
const glob = require('glob')
const R = require('ramda')
const {readAsText, writeFile} = require('coral-fs-tasks')
const Task = require('data.task')
const formatJson = require('format-json-pretty');
// const log = x => {console.log(x); return x}

const input_dir = R.compose(
	s => path.join(process.cwd(), s),
	s => s.replace('--in=', ''),
	xs => xs[0] !== undefined && xs[0] !== '--in=' ? xs[0] : './content/',
	R.filter(s => s.indexOf('--in=') === 0)
)(process.argv)
console.log("input_dir", input_dir);

const output_dir = R.compose(
	s => path.join(process.cwd(), s),
	s => s.replace('--out=', ''),
	xs => xs[0] !== undefined && xs[0] !== '--out=' ? xs[0] : './',
	R.filter(s => s.indexOf('--out=') === 0)
)(process.argv)
console.log("output_dir", output_dir);


const getDir = dir => glob.sync(`${input_dir}/**/*.md`)

let parse = R.compose(
	content => R.assoc('body', marked(content.body), content),
	fm
)

let groupFilesByFolder = R.compose(
	R.map(R.map(x => parse(x.content))),
	R.groupBy(x => x.folder),
)

let getFolder = (input_dir, path) => R.pipe(
	R.replace(input_dir, ''),
	R.split('/'),
	R.reject(R.isEmpty),
	R.head,
)(path)/*? */


let fileTask = path => R.composeK(
	file => Task.of({folder: getFolder(input_dir, path), content: file}),
	readAsText('utf8')
)(path)

const writeJsons = obj => 
	R.sequence(
		Task.of, 
		R.map(key => 
			writeFile(output_dir+'/', {filename:key+'.json', buffer:JSON.stringify(obj[key])}), 
		Object.keys(obj))
	)


let files = R.sequence(Task.of, R.map(fileTask, getDir()))
	.map(groupFilesByFolder)
	.map(R.map(R.map(R.omit('frontmatter'))))
	.chain(writeJsons)
	.fork(console.log, s => console.log('Alles Gut!'))
