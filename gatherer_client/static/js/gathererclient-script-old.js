var app = angular.module('gathererClient',  ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']);

// Define Angular JS provider syboml
app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

filesList_ = {}
entry_ = []
//gatherer cliente controller
app.controller('gathererClientCtrl', function($scope, $http, $filter) {
	$scope.response = [];	
 	$scope.template = template;
	$scope.titles = tab_titles;

	$scope.main_tab = $scope.template.table_files;
	$scope.tab_title = $scope.titles.table_files;

	$scope.sortType     = 'title'; // set the default sort type
	$scope.sortReverse  = false;  // set the default sort order
	$scope.searchKeyword   = '';     // set the default search/filter term


	$scope.entry = {author: "", org: "", uploader: "", periodStart: new Date(), periodEnd: new Date()};
	entry_ = $scope.entry;

	$scope.filesList = [];

	$scope.addFile = function(){
      		var f = document.getElementById('file').files[0],
			r = new FileReader();
			r.onloadend = function(e){
        		$scope.file = e.target.result;
      		}
      		r.readAsBinaryString(f);
			console.log(r);
    }

	// Load data from server
	$scope.updateData = function(){
		$http.get('entry').
		success(function(response) {
		    $scope.response =response;	
		});
	}

	$scope.updateData();

	$scope.debug = function(){
		console.log("debug...");
	}

	// Load files content on upload tab
	$scope.loadFilesContent = function() {
		var j = 0, k = $scope.filesList.length;
	         for (var i = 0; i < k; i++) {
		 var reader = new FileReader();
		 reader.onloadend = function (evt) {
		     if (evt.target.readyState == FileReader.DONE) {
			 console.log(evt.target.result);
			file =  $scope.filesList[j];
			 file.content = evt.target.result;
			file.entry = $scope.entry;
			console.log(file);
			//$scope.uploadFile(file);

			 j++;
			 if (j == k){
			     alert('All files read');
			 }
		     }
		 };
		 reader.readAsBinaryString( $scope.filesList[i]);
	     }
	}

	// Load info of files on upload tab
	$scope.fileNameChanged = function (elem) {
	  var files = elem.files;
	  var l = files.length;

	  for (var i = 0; i < l; i++) {
		file = files[i]
		
		//console.log(files[i]);
		$scope.filesList.push(file)
		filesList_ = $scope.filesList;
		//console.log(file);


	  }
	 $scope.loadFilesContent();
	}

	$scope.uploadFilesList = function(){
		for (i=0; i< $scope.filesList.length; i++){
			$scope.uploadFile($scope.filesList[i]);
		}
	
		$scope.updateData();

		$scope.main_tab = $scope.template.table_files;
		$scope.tab_title = $scope.titles.table_files
		$scope.searchKeyword = $scope.entry.org;
	}
	$scope.uploadFile = function(file) {
	 	// HTTP POST
		
		//formating data entry to post
		file_data = {}
		file_data.title = file.name;
		file_data.author = file.entry.author;
		file_data.org = file.entry.org;
		file_data.uploader = file.entry.uploader;
		file_data.period_start = $filter('date') (file.entry.periodStart, 'dd-MM-yyyy');
		file_data.period_end = $filter('date') (file.entry.periodEnd, 'dd-MM-yyyy');
		file_data.datafile = file.content;

		console.log(file_data);
		console.log('POST..');

		$http.post('create_entry', file_data).
			success(function(data, status, headers, config) {
			console.log("Sucess...");
			console.log(data);
			console.log(status);
	      	}).
			error(function(data, status, headers, config) {
			console.log("Error...");
			console.log(data);
			console.log(status);
	      	});

	}

	console.log("Angular Running");


});
var app = angular.module('gathererClient', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']);

// Define Angular JS provider syboml
app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

filesList_ = {}
entry_ = []
    //gatherer cliente controller
app.controller('gathererClientCtrl', function($scope, $http, $filter) {
    $scope.response = [];
    $scope.template = template;
    $scope.titles = tab_titles;

    $scope.main_tab = $scope.template.table_files;
    $scope.tab_title = $scope.titles.table_files;

    $scope.sortType = 'title'; // set the default sort type
    $scope.sortReverse = false; // set the default sort order
    $scope.searchKeyword = ''; // set the default search/filter term


    $scope.entry = {
        author: "",
        org: "",
        uploader: "",
        periodStart: new Date(),
        periodEnd: new Date()
    };
    entry_ = $scope.entry;

    $scope.filesList = [];

    $scope.addFile = function() {
        var f = document.getElementById('file').files[0],
            r = new FileReader();
        r.onloadend = function(e) {
            $scope.file = e.target.result;
        }
        r.readAsBinaryString(f);
        console.log(r);
    }

    // Load data from server
    $scope.updateData = function() {
        $http.get('entry').
        success(function(response) {
            $scope.response = response;
        });
    }

    $scope.updateData();

    $scope.debug = function() {
        console.log("debug...");
    }

    // Load files content on upload tab
    $scope.loadFilesContent = function() {
        var j = 0,
            k = $scope.filesList.length;
        for (var i = 0; i < k; i++) {
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                if (evt.target.readyState == FileReader.DONE) {
                    console.log(evt.target.result);
                    file = $scope.filesList[j];
                    file.content = evt.target.result;
                    file.entry = $scope.entry;
                    console.log(file);
                    //$scope.uploadFile(file);

                    j++;
                    if (j == k) {
                        alert('All files read');
                    }
                }
            };
            reader.readAsBinaryString($scope.filesList[i]);
        }
    }

    // Load info of files on upload tab
    $scope.fileNameChanged = function(elem) {
        var files = elem.files;
        var l = files.length;

        for (var i = 0; i < l; i++) {
            file = files[i]

            //console.log(files[i]);
            $scope.filesList.push(file)
            filesList_ = $scope.filesList;
            //console.log(file);


        }
        $scope.loadFilesContent();
    }

    $scope.uploadFilesList = function() {
        for (i = 0; i < $scope.filesList.length; i++) {
            $scope.uploadFile($scope.filesList[i]);
        }

        $scope.updateData();

        $scope.main_tab = $scope.template.table_files;
        $scope.tab_title = $scope.titles.table_files
        $scope.searchKeyword = $scope.entry.org;
    }
    $scope.uploadFile = function(file) {
        // HTTP POST

        //formating data entry to post
        file_data = {}
        file_data.title = file.name;
        file_data.author = file.entry.author;
        file_data.org = file.entry.org;
        file_data.uploader = file.entry.uploader;
        file_data.period_start = $filter('date')(file.entry.periodStart, 'dd-MM-yyyy');
        file_data.period_end = $filter('date')(file.entry.periodEnd, 'dd-MM-yyyy');
        file_data.datafile = file.content;

        console.log(file_data);
        console.log('POST..');

	var url_request = 'create_entry_file?title=' + file_data.title + '&author=' + file_data.author + '&org=' + file_data.org + '&uploader=' + file_data.uploader + '&period_start=' + file_data.period_start + '&period_end=' + file_data.period_end
	console.log(url_request);
	console.log(file_data.datafile);
	$http({
	    method: 'POST',
	    url: url_request,
	    data: $.param({datafile: file_data.datafile}),
	    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).
        success(function(data, status, headers, config) {
            console.log("Sucess...");
            console.log(data);
            console.log(status);
        }).
        error(function(data, status, headers, config) {
            console.log("Error...");
            console.log(data);
            console.log(status);
        });

   }

    console.log("Angular Running");


});
