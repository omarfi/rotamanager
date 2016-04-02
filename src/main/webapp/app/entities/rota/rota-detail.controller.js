(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .controller('RotaDetailController', RotaDetailController);

    RotaDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Rota', 'Shift', 'Store'];

    function RotaDetailController($scope, $rootScope, $stateParams, entity, Rota, Shift, Store) {
        var vm = this;
        vm.rota = entity;
        vm.load = function (id) {
            Rota.get({id: id}, function(result) {
                vm.rota = result;
            });
        };
        var unsubscribe = $rootScope.$on('rotamanagerApp:rotaUpdate', function(event, result) {
            vm.rota = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
