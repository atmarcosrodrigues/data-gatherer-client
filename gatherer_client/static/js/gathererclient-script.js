// Gatherer Client App
var app = angular.module('gathererClient');

// Gatherer Cliente Controller
app.controller('gathererClientCtrl', function($scope, $http, $filter, $mdDialog, $mdMedia, entry) {

    $scope.response = [];
    $scope.template = template;
    $scope.titles = tab_titles;
	$scope.entry = entry;

    $scope.main_tab = $scope.template.table_files;
    $scope.tab_title = $scope.titles.table_files;

    $scope.sortType = 'title'; // set the default sort type
    $scope.sortReverse = false; // set the default sort order
    $scope.searchKeyword = ''; // set the default search/filter term

	$scope.limitEntries = 10;
	$scope.totalEntries = 100;
	$scope.currentPage = 0;
    
	$scope.getPagination = function() {
		var pags = Math.ceil($scope.totalEntries/$scope.limitEntries);
		return new Array(pags);        
	}

    $scope.addFile = function() {
        var f = document.getElementById('file').files[0],
            r = new FileReader();
        r.onloadend = function(e) {
            $scope.file = e.target.result;
        }
        r.readAsBinaryString(f);
        console.log(r);
    }

	$scope.loadPage = function(numPage){
		console.log(numPage);
		$scope.currentPage = numPage;
		$scope.search(false);
	}

	$scope.updateLimitEntries = function(){
		//$scope.currentPage = 0;
		//$scope.updateData();
		$scope.search(default_page=false);
	}


	$scope.search = function(default_page=true) {
		if (default_page)
			$scope.currentPage = 0
        var limit = document.getElementById('limit_entries');
	
		var search_start = $filter('date')($scope.entry.searchPeriodStart, 'dd-MM-yyyy');
		var search_end = $filter('date')($scope.entry.searchPeriodEnd, 'dd-MM-yyyy');
	
        $scope.limitEntries = limit.value;
        console.log($scope.limitEntries);
        var get_url = "search?page=" + ($scope.currentPage) + "&limit=" + $scope.limitEntries;
		
		if ($scope.entry.searchAuthor != "")
			get_url+= "&author=" + $scope.entry.searchAuthor
		if ($scope.entry.searchTitle != "")
			get_url+= "&title=" + $scope.entry.searchTitle
		if ($scope.entry.searchUploader != "")
			get_url+= "&uploader=" + $scope.entry.searchUploader
		if ($scope.entry.searchOrg != "")
			get_url+= "&org=" + $scope.entry.searchOrg
		if (search_start != undefined)
			get_url+= "&period_start=" + search_start
		if (search_end != undefined)
			get_url+= "&period_end=" + search_end

        console.log($scope.entry.searchAuthor+ "(" + search_start + ", "+ search_end+")");
        console.log(get_url);
        $http.get(get_url).
        success(function(response) {
            $scope.response = response;
            $scope.totalEntries = response.data.count;
            console.log('search data...');
        });
		
	}    


    // Load data from server
    $scope.updateData = function() {
		$scope.entry.searchAuthor = ""; 
		$scope.entry.searchTitle = ""; 
		$scope.entry.searchUploader = ""; 
		$scope.entry.searchOrg = ""; 

		$scope.entry.searchPeriodStart = undefined;
		$scope.entry.searchPeriodEnd = undefined;
		$scope.search(false);
    }

    $scope.updateData();

    $scope.debug = function() {
        console.log("debug...");
        console.log($scope.currentFile);
    }

    $scope.status = "";
    $scope.showConfirm = function(ev, id) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Do you want to delete this file?')
            .textContent('This action will remove it from our storage servers!')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Yes!')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
            $scope.status = 'You decided to keep with the file removal.';
            console.log($scope.status);
            $scope.deleteFile(id);
        }, function() {
            $scope.status = 'You decided to cancel this action.';
        });
    };

    $scope.currentFile = {};

    $scope.showAdvanced = function(ev, file) {
        $scope.currentFile = file;
        console.log($scope.currentFile);
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
                controller: DialogController,
                $scope: $scope.$new(),
                locals: {
                    currentFile: $scope.currentFile,
                    scopeParent: $scope
                },
                templateUrl: '/static/templates/edit.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };


    function DialogController($scope, $mdDialog, currentFile, scopeParent) {
        $scope.currentFile = angular.copy(currentFile)
        var date_start = currentFile.period_start.split('-');
        var date_end = currentFile.period_end.split('-');
        $scope.currentFile.periodStart = new Date(date_start[1] + "-" + date_start[0] + "-" + date_start[2]);
        $scope.currentFile.periodEnd = new Date(date_end[1] + "-" + date_end[0] + "-" + date_end[2]);

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

        $scope.sendFile = function() {
            var url_request = "put_entry_file/" + $scope.currentFile._id
            console.log(url_request);
            console.log($scope.currentFile.content);
            $http({
                method: 'PUT',
                url: url_request,
                data: $.param({
                    datafile: $scope.currentFile.content
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).
            success(function(data, status, headers, config) {
                console.log("Sucess...");
                console.log(data);
                console.log(status);
                $scope.cancel();
                scopeParent.updateData();

            }).
            error(function(data, status, headers, config) {
                console.log("Error...");
                console.log(data);
                console.log(status);
            });

        }

        $scope.newFileEntry = function(elem) {
            var file = elem.files[0];
            r = new FileReader();
            r.onloadend = function(e) {
                $scope.currentFile.content = e.target.result;
                console.log($scope.currentFile);

            }
            r.readAsBinaryString(file);
            console.log(file);
        }

        $scope.updateFile = function() {
            console.log($scope.currentFile);
            var file_data = {}
            file_data.title = $scope.currentFile.title;
            file_data.author = $scope.currentFile.author;
            file_data.org = $scope.currentFile.org;
            file_data.uploader = $scope.currentFile.uploader;
            file_data.period_start = $filter('date')($scope.currentFile.periodStart, 'dd-MM-yyyy');
            file_data.period_end = $filter('date')($scope.currentFile.periodEnd, 'dd-MM-yyyy');

            var data_entry = JSON.stringify(file_data);
            console.log(file_data);
            $http.put('entry/' + $scope.currentFile._id, data_entry).
            success(function(data, status, headers, config) {
                console.log("Sucess...");
                console.log(data);
                console.log(status);
                $scope.cancel();
                scopeParent.updateData();

            }).
            error(function(data, status, headers, config) {
                console.log("Error...");
                console.log(data);
                console.log(status);
            });

        }
    }

    $scope.deleteFile = function(id) {
        console.log(id);
        $http.delete('entry/' + id).
        success(function(data, status, headers, config) {
            console.log("Sucess...");
            console.log(data);
            console.log(status);
            $scope.updateData();
        }).
        error(function(data, status, headers, config) {
            console.log("Error...");
            console.log(data);
            console.log(status);
        });

    }

    console.log("Angular Running");

});
