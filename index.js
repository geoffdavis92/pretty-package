'use strict';

const fs = require('fs'),
	  objectify = fileData => JSON.parse(fileData),
	  checkValType = (k,o) => typeof o[k],
	  convertType = (data,desiredType,options) => {
	  	let dataType = typeof data !== 'object' ? typeof data : data.hasOwnProperty('length') ? 'array' : 'object';
	  	if (dataType !== desiredType) {
	  		switch (desiredType) {
	  			case 'array':
	  				if (dataType === 'string') {
	  					let finalArray = [];
	  					data.replace(/\.$/,'').split(' ').forEach(el => finalArray.push(el.replace(/\,/g,'')));
	  					return finalArray;
	  				} else if (dataType === 'number') {
	  					return (data).toString().split('');
	  				} else {
	  					throw 'Ln 17: TypeError -> Only strings and numbers can be converted into Arrays.';
	  				} 
	  			break;
	  			case 'string':
	  				if (dataType === 'array') {
	  					if (options && options.trailingAnd) {
	  						let str = '';
	  						data.forEach((text,i,arr) => {
	  							if (i === (arr.length - 1)) {
	  								str += `and ${text}.`
	  							} else {
	  								str += `${text}, `;
	  							}
	  						});
	  						return str;
	  					} else {
	  						return data.join(', ')
	  					}
	  				} else if (dataType === 'number') {
	  					return `${data}`
	  				} else {
	  					throw 'Ln 38: TypeError -> Only arrays and numbers can be converted into Strings.';
	  				}
	  			break;
	  			default:
	  				throw 'Ln 42: TypeError -> No conversion can be made.';
	  			break;
	  		}
	  	} else { return data; }
	  },
	  getKeys = object => {
	  	let keysArray = [];
	  	for (let key in object) {
	  		keysArray.push(key);
	  	}
	  	return keysArray;
	  },
	  h1 = text => `# ${text}\n`,
	  h2 = text => `## ${text}\n`,
	  h3 = text => `### ${text}\n`,
	  p = text => `\n${text}\n`,
	  ol = array => {
	  	let str = '';
	  	array.forEach((text,n) => str += `\n${n+1}. ${text}`);
	  	str += `\n`;
	  	return str;
	  },
	  ul = array => {
	  	let str = '';
	  	array.forEach(text => str += `\n* ${text}`);
	  	str += `\n`;
	  	return str;
	  },
	  bold = text => `**${text}**`,
	  italic = text => `*${text}*`,
	  code = text => `\`${text}\``,
	  codeBlock = text => `\n    ${text}`

// Setup new file string
let newFile = '';

fs.readFile('./package.json', 'utf8', (err,fileString) => {
	if (err) throw err;
	let packageJSON = objectify(fileString);

	newFile += `${h1((code(packageJSON.name)+' by '+packageJSON.author))}${h2('v'+code(packageJSON.version))}${h3('Description')}${p(packageJSON.description)}${p(bold('Keywords:')+' '+convertType(packageJSON.keywords,'string',{trailingAnd:true}))}${h3('Scripts')}${p('Available scripts: ')}${ul(getKeys(packageJSON.scripts))}${h3('License')}${p(packageJSON.license)}`
	// bsStyles = `<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet"><body class="container"></body>`
	fs.writeFile('test.md',`${newFile}`, (err) => {
		if (err) throw err;
		console.log('test.md written.')
	})
})