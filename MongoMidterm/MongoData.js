/**
 * @author Charlie Calvert
 */


angular.module('elvenApp', ['pres'])
.controller('MyController', function($scope, $http, presidents) {
    $scope.hint = "<p>Start with <strong>node server.js</strong> to retrieve JSON from Server</p>";
    
    // $scope.presidents = presidents;
    $scope.presidents = presidents.query({}, function(users) {
      $scope.presidentsLength = $scope.presidents.length;
      console.log($scope.presidentsLength);
    });
	
	var getDataJson = $http.get('data.json');

	getDataJson.success(function(data, status, headers, config)  {
		$scope.data = data;
	});
	
	getDataJson.error(function(data, status, headers, config) {
		throw new Error('Oh no! An Error!');
	});

});

angular.module('pres', ['ngResource'])
.factory('presidents', function($resource) {
	console.log('Presidents factory called');
        //mongodb://<dbuser>:<dbpassword>@ds053838.mongolab.com:53838/prog270
//	var Presidents = $resource('https://api.mongolab.com/api/1/databases/elvenlab01/collections/Presidents/:id', {
	var Presidents = $resource('https://api.mongolab.com/api/1/databases/prog270/collections/Events/:id', {
      // apiKey:'4fb51e55e4b02e56a67b0b66',
      //apiKey:'qfSxFoUGHBA1EuUlqhux_op2fy6oF_wy',
      apiKey:'Z_3R0QHWI5tPTYDwKhu7gaFJWu_TtNS2',
      id:'@_id.$oid'
    });

    Presidents.prototype.getPresidentName = function() {
      return this.title;
    };
    
    Presidents.prototype.getTermStart = function() {
    	return this.content;
    };
    
    Presidents.prototype.getTermEnd = function() {
    	return this.content;
    };

    return Presidents;    
	 
	// return { a: 2 };		
});
