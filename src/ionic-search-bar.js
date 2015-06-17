/*jslint white: true */
/*global angular */

(function () { // To stop JSHint/JSLint whing
"use strict";

angular.module("ionic-search-bar", ["ionic"])

.directive('searchBar', [function () {
  return {
    scope: {
      ngModel: '=',
      autoReset: "=",
      onSearchCallback: '&onSearch'
    },
    require: ['?ngModel'],
    restrict: 'E',
    replace: true,
    template: '<div class="searchBar">' +
                '<div class="searchTxt" ng-show="ngModel.show">' +
                  '<div class="bgdiv"></div>' +
                    '<div class="bgtxt item-input-wrapper">' +
                      '<i class="icon placeholder-icon ion-search"></i>' +
                      '<input type="text" placeholder="Search..." ng-model="ngModel.text" ng-keypress="searchKeyPress($event)">' +
                    '</div>' +
                  '</div>' +
                  '<button class="button button-clear icon" ng-class="{\'ion-close-round\': ngModel.show, \'ion-search\': !ngModel.show}" ng-click="searchClick($event)"></button>' +
                '</div>' +
              '</div>',

    compile: function (element, attrs) {
      var icon = attrs.icon
          || (ionic.Platform.isAndroid() && 'ion-android-search')
          || (ionic.Platform.isIOS()     && 'ion-ios-search')
          || 'ion-search';
      angular.element(element[0].querySelector('.icon')).addClass(icon);
      
      var placeholder = attrs.placeholder || 'Search...';
      angular.element(element[0].querySelector('input')).attr('placeholder', placeholder);
      
      return function($scope, $element, $attrs, ctrls) {
        $scope.rootElement = $element;
      };
    },
    
    controller: ['$scope','$ionicNavBarDelegate', "$timeout", function($scope, $ionicNavBarDelegate, $timeout){
      var title;
      
      $scope.searchClick = function(e) {
        if ($scope.ngModel.show) {
          $scope.ngModel.text = "";
          $scope.onSearchCallback();
          
        } else {
          if ($scope.autoReset)
            $scope.ngModel.text = "";
          
          $timeout(function() {
            angular.element($scope.rootElement[0].querySelector('input'))[0].focus();
          });
        }
        $scope.ngModel.show = !$scope.ngModel.show;
      };
      
      $scope.searchKeyPress = function(e) {
        if (e.keyCode === 13)
          $scope.onSearchCallback();
      };
      
      $scope.$watch('ngModel.show', function(showing, oldVal, $scope) {
        if(showing !== oldVal) {
          if(showing) {
            title = $ionicNavBarDelegate.title();
            $ionicNavBarDelegate.title('');
          } else {
            $ionicNavBarDelegate.title(title);
          }
        } else if (!title) {
          title = $ionicNavBarDelegate.title();
        }
      });
    }]
  };
}])

;
}());

