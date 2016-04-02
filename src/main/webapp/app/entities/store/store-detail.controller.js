(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .controller('StoreDetailController', StoreDetailController);

    StoreDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Store', 'Rota', 'Employee'];

    function StoreDetailController($scope, $rootScope, $stateParams, entity, Store, Rota, Employee) {
        var vm = this;
        vm.store = entity;
        vm.load = function (id) {
            Store.get({id: id}, function(result) {
                vm.store = result;
            });
        };
        var unsubscribe = $rootScope.$on('rotamanagerApp:storeUpdate', function(event, result) {
            vm.store = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
