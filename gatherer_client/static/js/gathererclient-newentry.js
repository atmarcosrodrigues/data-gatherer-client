// Gatherer Client App
var app = angular.module('gathererClient');

// Gatherer Client from New Entry Tab Option
app.controller('gathererClientNewEntry', function($scope, $http, $filter, $mdDialog, $mdMedia, entry) {

    $scope.entry = entry;
    $scope.errorMessage = "";
    $scope.readFileStatus = "No one file loaded.";
    $scope.invalidField = false;
    $scope.filesList = [];
    $scope.currentFileEntry = {};

    $scope.checkEntry = function() {
        console.log($scope.entry);
        if ($scope.entry.author == "") {
            $scope.errorMessage = "The author can not be empty!";
            $scope.invalidField = true;

        } else if ($scope.entry.org == "") {
            $scope.errorMessage = "The org can not be empty!";
            $scope.invalidField = true;

        } else if ($scope.entry.uploader == "") {
            $scope.errorMessage = "The uploader can not be empty!";
            $scope.invalidField = true;

        } else if ($scope.entry.title == "") {
            $scope.errorMessage = "The entry title can not be empty!";
            $scope.invalidField = true;

        } else {
            $scope.errorMessage = "";
            $scope.invalidField = false;
        }
    }

    //formating data entry to post
    $scope.formatEntry = function(file) {
        var file_data = {}
        file_data.title = $scope.entry.title;
        file_data.author = $scope.entry.author;
        file_data.org = $scope.entry.org;
        file_data.uploader = $scope.entry.uploader;
        file_data.period_start = $filter('date')($scope.entry.periodStart, 'dd-MM-yyyy');
        file_data.period_end = $filter('date')($scope.entry.periodEnd, 'dd-MM-yyyy');

        return {    author: file_data.author,
                    org: file_data.org,
                    uploader: file_data.uploader,
                    title: file_data.title,
                    period_start: file_data.period_start,
                    period_end: file_data.period_end,
                    file_name: file.name,
                    file_content: file.content}
    }

    // HTTP POST
    $scope.uploadFile = function(file) {
        console.log($scope.invalidField);
        $scope.checkEntry();
        if ($scope.invalidField)
            return;

        file_data = $scope.formatEntry(file);
        console.log('POST..');

		var url_request = 'create_entry'
        console.log(url_request);
	
		//$http.post(url_request, data_entry).
	    $http({
                method: 'POST',
                url: url_request,
				data: $.param(file_data),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).
            success(function(data, status, headers, config) {
                console.log("Sucess...");
                console.log(data);
                console.log(data.data._id);
				//$scope.uploadEntry(data.data._id, file.content);
                console.log(status);
				$scope.limitEntries = 100;
				$scope.updateData();
                //$scope.cancel();
                //scopeParent.updateData();
    
        }).
	    error(function(data, status, headers, config) {
        	console.log("Error...");
	        console.log(data);
        	console.log(status);
       	});

    }

	$scope.uploadEntry = function(_id, content) {
	        var url_request = "put_entry_file/" + _id
            console.log(url_request);
            console.log(content);
            $http({
                method: 'PUT',
                url: url_request,
                data: $.param({
                    datafile: content
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).
            success(function(data, status, headers, config) {
                console.log("Sucess...");
                console.log(data);
                console.log(status);
                //$scope.cancel();
                //scopeParent.updateData();

            }).
            error(function(data, status, headers, config) {
                console.log("Error...");
                console.log(data);
                console.log(status);
            });

        }



    // Load info of files on upload tab
    $scope.fileNameChanged = function(elem) {
		var file = {};
        var f = elem.files[0];
		file['name'] = f.name;
        r = new FileReader();
        r.onloadend = function(e) {
			if (e.target.readyState == FileReader.DONE) {

       		file.content = e.target.result;
			$scope.readFileStatus = "File loaded!";
			console.log(file);
			$scope.currentFileEntry = file;
			$scope.$apply();
			 alert('Successfully read file!');
			}
			//$scope.filesList.push(file);

        }
	    $scope.readFileStatus = "Reading File...";
    	$scope.$apply();

        r.readAsBinaryString(f);
        console.log(r);
	}

    $scope.uploadFilesList = function() {
        $scope.filesList.push({
            name: "",
            content: ""
        });

        //$scope.uploadFile($scope.filesList[0]);
        $scope.uploadFile($scope.currentFileEntry);

        if (!$scope.invalidField) {
            $scope.updateData();
            $scope.main_tab = $scope.template.table_files;
            $scope.tab_title = $scope.titles.table_files
            $scope.searchKeyword = $scope.entry.org;
        }

    }


});
