# frontmatter-markdown-to-json

Converts a `frontmatter markdown` collection of files into one or several json files, each having an array with the front matter data and the body (parsed as HTML) of each file.

## Structure of the input folders
Folder structure must be:
```
input_folder
|___ folder_with_name_of_json //e.g. the folder named "blog" will produce "blog.json"
|	|___ whatever_other_folders//they will not alter the form of the output
|		|___  file.md
|
|___ folder2_with_name_of_json
	|___ whatever_other_folders
		|___  file.md
```

The output `json`s will be an array of objects corresponding to each file. Each objects has an `attributes` property holding the frontmatter and a `body` property holding the parse body as `HTML` of the markdown.

## Installation
`npm i frontmatter-markdown-to-json -S`

## CLI usage
Specify input folder with the option `--in=<path>` (defaults to `'./content'`) and the output folder with the option `--out=<path>` (defaults to `./`)

`node node_modules/frontmatter-markdown-to-json --in=my-content --out=my-data`