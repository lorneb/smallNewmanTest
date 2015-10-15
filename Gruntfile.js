//grunt --verbose --build=dev --target=C:/Code/WFKioskAPIServerDeploymentUAT
//grunt --verbose devcommit newmantest
//grunt --verbose newmantest 
//Grunt --verbose newmantest --collection=test/PostmanCollections/UnitTest.collection.json --environment=test/PostmanEnvironments/dev.postman_environment.json
//Grunt --verbose newmantest --collection=test/PostmanCollections/RegistrationTest.collection.json --environment=test/PostmanEnvironments/dev.postman_environment.json



//callback = (typeof callback === 'function') ? callback : function() {};


var Newman = require('newman'),
	fs = require('fs'),
	path = require('path'),
	JSON5 = require('json5');


module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-version-bump');

	
	// Project configuration.
	grunt.initConfig({

		version_bump: {
			files: ['./package.json'],
			versionStructure: [
				{
					name: "major",
					prefix: "",
					order: 1,
					priority: 1,
					resettable: false,
					resetTo: 0
                },
				{
					name: "minor",
					prefix: ".",
					order: 2,
					priority: 2,
					resettable: true,
					resetTo: 0
                },
				{
					name: "build",
					prefix: ".",
					order: 3,
					priority: 3,
					resettable: true,
					resetTo: 0
                }
            ]
		}
	});



	// Run newman test
	grunt.registerTask('newmantest', 'run newtest', function () {
		var done = this.async();
		var newmantest = {};
	
		var environmentJSONPath = path.join(__dirname, 'postman_environment.json');

		if (fs.existsSync(environmentJSONPath)) {
			// Do something
			grunt.option('environment', environmentJSONPath);
		} else {
			grunt.fail.fatal('no command line option for --environment supplied when running newman tests this is required');
		}

		
		var collectionJSONPath = path.join(__dirname, 'unitTest.collection.json');

		if (fs.existsSync(collectionJSONPath)) {
			// Do something
			grunt.option('collection', collectionJSONPath);
		} else {
			grunt.fail.fatal('no command line option for --collection supplied when running newman tests this is required');
		}



		newmantest.options = {
			collection : grunt.option('collection'),
			envJson : grunt.option('environment'),
			stopOnError : true,
			asLibrary : true,
			responseHandler : 'TestResponseHandler',
			exitCode : true
		};




		if (newmantest.options.envJson) {
			newmantest.options.envJson = JSON5.parse(fs.readFileSync(newmantest.options.envJson, 'utf8'));
		}
		
		
		if (newmantest.options.collection) {
			var requestJSON = JSON5.parse(fs.readFileSync(newmantest.options.collection, 'utf8'));
			
			Newman.execute(requestJSON, newmantest.options, function (exitCode) {
				
				console.log('exitCode:', exitCode);
				
				done(exitCode === 0);
			});
		} else {
			grunt.fail.fatal('Newman colleciton option not defined. ');
		}
		
		
	});

	// The default task
	grunt.registerTask('default', 'do some stuff.', [
		'newmantest',
        'version_bump:build',
    ]);



	grunt.registerTask('bump', 'bump it', [
        'version_bump:build',
    ]);





};
