//#musty.js

//A single global variable contains all functionality

var musty = (function(){
	
	//Factory for building regex-based replacer functions
	
	function replacer(regex,fn){
		return function(str){
			return (''+str).replace(regex,fn);
		}
	}

	//Function to determine the iterationCount
	//in conditional and inverted sections.
	//Takes the key value as argument.

	function truthyLoop(obj){
		var i, t = typeof(obj);
		//If array or object and not null
		if(t == 'object' && obj){
			//If array
			if(obj.splice) return obj.length;
			//Else
			for(i in obj){
				//If non-empty object
				return 1;
			}
			//Else, empty object
			return 0;
		}
		//Else if falsy and not a number
		return !obj && (t !='number' || isNaN(obj))?
			0:
			//Otherwise
			1;
	}
	
	//Function to sanitize html.
	//Converts `<>"'&/` to html encoding
	
	var htmlSafe = replacer(/[\"\/\\<>&\']/g,
		function(m){
			return '&#'+m.charCodeAt(0)+';';
		}
	);
	
	//Function to trim string for trailing whitespace.
	
	var rightTrim = replacer(/\s*$/,'');
	
	//Function to convert a single character to hex encoding (\xFF).
	
	function stringifyReplace(m){
		return '\\x'+('0'+m.charCodeAt(0).toString(16)).slice(-2);
	}

	//Function to encode string to a javascript-encoded string,
	//converts non-printable characters, `"`, `/`, and `\` to
	//hex-encoded characters
	
	var stringify = replacer(/[\x00-\x1f\"\/\\]/g, stringifyReplace);

	//Function to build source code for accessing a given key from
	//the current context + any custom functions and parameters to apply
	
	function datacall(params){
		//Split params by delimiter (@)
		params = rightTrim(params).split('@');
		//Format all params items as javascript strings
		for(var l = params.length; l--;){
			params[l] = '"'+stringify(params[l])+'"';
		}
		//Return source code string
		return 'g(d,['+params+'])';
	}
	
	//Regex to tokenize mustache syntax
	//
	//Identifies
	//
	//1. {{{keys in triple braces}}}
	//2. {{tokens in double braces: #, ^, /, ! or >}}
	//3. {{keys in double braces}}
	//4. characters in need of escaping in javascript source code
	
	var parseRegex = /\{\{\{\s*((?:\}{0,2}[^\}])*)\}\}\}|\{\{([#\/\^\!>]?)\s*((?:\}?[^\}])*)\}\}|([\x00-\x1f\"\/\\])/g;

	//Token handler, takes tokens as input, returns replacement source code
	function templateParser(m, unescapedKey, sectionToken, escapedKey, specialChar){
		//If section closing tag
		return (sectionToken == '!')? '':
			(sectionToken == '>')? '"+g(d,[".","'+stringify(rightTrim(escapedKey))+'",0,d])+"':
				(sectionToken == '\/')?
					//source code to close any section
					'"}return s})(d)+"':
					//else if any of the section opening tokens
					(sectionToken)?
						//sections are compiled to immediately invoked
						//functions
						'"+(function(d){'+
						//get the value of the current key
						'var k='+datacall(escapedKey)+
						//create a string buffer and an iterator variable
						',s="",i,c=d,'+
						//call truthyLoop to get parameters:
						//1: is it a non-empty array?
						//2: how many times to iterate the section body?
						'p=t(k);'+
						((sectionToken == '#')?
							//if conditional section, setup a for loop
							'for(i=0;i<p;i++){d=[k.splice?k[i]:k].concat(c);':
							//if inverted conditional section, test if iteration count is 0
							'if(!p){'
						)+
						//capture subsequent syntax in string buffer
						's+="':
						(unescapedKey)?
							//call value of key in current context
							//without HTML sanitization
							'"+'+datacall(unescapedKey)+'+"':
							(escapedKey)?
								//call value of key in current context
								//with HTML sanitization
								'"+h('+datacall(escapedKey)+')+"':
								(specialChar)?
									//escape special characters
									stringifyReplace(specialChar):
									'';
	}

	//Parser function for template strings,
	//transforms the string to a function body
	var parse = replacer(parseRegex, templateParser);

	//return the compilation function, takes a template string
	//and an optional object with custom functions,
	//returns a compiled template as a function
	return function(tmplStr, fnObj){
		/* return template processor */
		//use try/catch to detect compilation failure
		try{
			//create a compiled template as a function
			var fn = new Function('d', 'g', 'h', 't', 'return "'+parse(tmplStr)+'"');
			//bind the functions getData, htmlSafe and truthyLoop to the scope of
			//the compiled template,
			//assigned to the variables `g`, `h` and `t`,
			//and return the compiled template function
			return function(dataObj, fnObj2, contextChain){
				//Function to access data from the current context
				function getData(contextChain, params){
					//key is the first parameter, name of any custom function is the second
					var key = params[0],
						fn = (fnObj2 && fnObj2[params[1]]) || (fnObj && fnObj[params[1]]), 
						value, data, i, 
						l = contextChain.length;
					for(i = 0; i < l; i++){
						if(contextChain[i] && contextChain[i].hasOwnProperty(key)){
							break;
						}
					}
					data = contextChain[i];
					//assign value if key exists
					value = i < l? 
						typeof data[key] == 'function'?
							//if function, assign return value
							data[key]():
							//else assign value
							data[key]:
						//if key does not exist
						(key == '.'?
							//if dot, assign current context
							contextChain[0]:
							//else, assign empty string
							'');
					if(fn) value = fn.apply(null, (params.splice(0, 2, value), params));
					return truthyLoop(value)? value: '';
				}
				return fn(contextChain || [dataObj], getData, htmlSafe, truthyLoop);
			}
		}catch(e){
			//return false if compilation fails
			return false;
		}
	}
})();
