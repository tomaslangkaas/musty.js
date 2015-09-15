var tests = [
	//Test 1
	
	'Variables and function variables',
	function(done){
		var templateString = "My name is {{name}}, my lucky number is " +
			"{{luckyNumber}}, and I {{don't }}like skating.";

		var templateData = {
			name: "Bart Simpson",
			luckyNumber: function(){
				return 10 * Math.random() | 0
			} 
		};

		var renderedString = musty(templateString)(templateData);

		done(renderedString);
	},
	function(output){
		return /^My name is Bart Simpson, my lucky number is \d, and I like skating\.$/.test(output);
	},
	
	//Test 2
	
	'HTML escaping',
	function(done){
		var templateString = "Escaped: {{boldAndBrave}} & unescaped: {{{boldAndBrave}}}";

		var templateData = {
			boldAndBrave: '<b>bold & "brave"</b>'
		};

		var renderedString = musty(templateString)(templateData);

		done(renderedString);
	},
	'Escaped: &#60;b&#62;bold &#38; &#34;brave&#34;&#60;&#47;b&#62; & unescaped: <b>bold & "brave"</b>',
	
	//Test 3
	
	'Conditional sections',
	function(done){
		var templateString = "{{#showAndTell}}This is only shown if showAndTell is truthy.{{/showAndTell}}";

		var templateData1 = {
			showAndTell: true
		};

		var templateData2 = {
			showAndTell: false
		};

		var renderedString1 = musty(templateString)(templateData1);

		var renderedString2 = musty(templateString)(templateData2);

		done([renderedString1, renderedString2]);
	},
	function(output){
		return output[1] == "" &&
			output[0] == "This is only shown if showAndTell is truthy."
	},
	
	//Test 4
	
	'Inverted conditional sections',
	function(done){
		var templateString = "{{^showAndTell}}This is only shown if showAndTell is falsy.{{/showAndTell}}";

		var templateData1 = {
			showAndTell: true
		};

		var templateData2 = {
			showAndTell: false
		};

		var renderedString1 = musty(templateString)(templateData1);

		var renderedString2 = musty(templateString)(templateData2);

		done([renderedString1, renderedString2]);
	},
	function(output){
		return output[1] == "This is only shown if showAndTell is falsy." &&
			output[0] == ""
	},
	
	//Test 5
	
	'Truthy and falsy',
	function(done){
		var templateString = "{{#valueList}}" +
			"{{#value}}Truthy{{/value}}"+
			"{{^value}}Falsy{{/value}}: "+
			"{{{valueType}}} \n"+
		"{{/valueList}}";

		var templateData = {
			valueList:[
				
				//Falsy values
				{valueType: '[]', value: []},
				{valueType: '{}', value: {}},
				{valueType: '""', value: ""},
				{valueType: 'false', value: false},
				{valueType: 'null', value: null},
				{valueType: 'undefined', value: undefined},
				{valueType: 'Number.NaN', value: Number.NaN},
				{valueType: 'function(){return false}', value: function(){return false}},
				
				//Truthy values
				{valueType: 'true', value: true},
				{valueType: 'function(){return 1}', value: function(){return 1}},
				{valueType: '0', value: 0},
				{valueType: '"0"', value: "0"},
				{valueType: '"string"', value: "string"},
				{valueType: '{key: "value"}', value: {key: "value"}},
				{valueType: 'Infinity', value: Infinity}
			]
		};

		var renderedString = musty(templateString)(templateData);
//console.log(renderedString);		
		done(renderedString);
	},
	'Falsy: [] \n'+
	'Falsy: {} \n'+
	'Falsy: "" \n'+
	'Falsy: false \n'+
	'Falsy: null \n'+
	'Falsy: undefined \n'+
	'Falsy: Number.NaN \n'+
	'Falsy: function(){return false} \n'+
	'Truthy: true \n'+
	'Truthy: function(){return 1} \n'+
	'Truthy: 0 \n'+
	'Truthy: "0" \n'+
	'Truthy: "string" \n'+
	'Truthy: {key: "value"} \n'+
	'Truthy: Infinity \n',
	
	//Test 6
	
	'Enumerable sections',
	function(done){
		var templateString = '<ul>'+
			'{{#list}}'+
				'<li>{{item}}</li>'+
			'{{/list}}</ul>';

		var templateData = {
			list: [
				{item: 'red'},
				{item: 'green'},
				{item: 'blue'}
			]
		};
			
		var renderedString = musty(templateString)(templateData);
//console.log(renderedString);		
		done(renderedString);
	},
	'<ul><li>red</li><li>green</li><li>blue</li></ul>',
	
	'Dot syntax',
	function(done){
		var templateString = '<ul>'+
			'{{#list}}'+
				'<li>{{.}}</li>'+
			'{{/list}}</ul>';

		var templateData = {
			list: ['red', 'green', 'blue']
		};
			
		var renderedString = musty(templateString)(templateData);
//console.log(renderedString);		
		done(renderedString);
	},
	'<ul><li>red</li><li>green</li><li>blue</li></ul>',
	
	'Dot syntax 2',
	function(done){
		var templateString = '<ul>'+
			'{{#.}}'+
				'<li>{{.}}</li>'+
			'{{/.}}</ul>';

		var templateData = ['red', 'green', 'blue'];
			
		var renderedString = musty(templateString)(templateData);
		
		done(renderedString);
	},
	'<ul><li>red</li><li>green</li><li>blue</li></ul>',
	
	'Custom functions',
	function(done){
		var templateString = 'The color {{color@upper}} is {{color@rgb}} in rgb. '+
		'The number pi is about {{pi@fixed@2}}.';

		var templateData = {
			color: '#c9d2a5',
			pi: 3.141592653589793
		};
		
		var functions = {
			upper: function(str){
				return ('' + str).toUpperCase();
			},
			rgb: function(hex){
				return [
					+ ('0x' + hex.slice(1,3)),
					+ ('0x' + hex.slice(3,5)),
					+ ('0x' + hex.slice(5,7))
				].join(', ')
			},
			fixed: function(num, digits){
				//NOTE: parameters are passed as strings
				return (+num).toFixed(+digits);
			}
		}
			
		var renderedString = musty(templateString, functions)(templateData);
//console.log(renderedString);	
		done(renderedString);
	},
	'The color #C9D2A5 is 201, 210, 165 in rgb. The number pi is about 3.14.',
	
	'Partials and lambdas',
	function(done){
		var templateString = '{{#users}}'+
			'{{{.@userTemplate}}} '+
		'{{/users}}';
		
		var userTemplateString = '<b>{{name}}</b>';
		
		var functions = {
			userTemplate: musty(userTemplateString)
		}
		
		var templateData = {
			users: [
				{name: 'Jane'},
				{name: 'Bob '},
				{name: 'John'}
			]
		};
			
		var renderedString = musty(templateString, functions)(templateData);
//console.log(renderedString);	
		done(renderedString);
	},
	'<b>Jane</b> <b>Bob </b> <b>John</b> '

];
