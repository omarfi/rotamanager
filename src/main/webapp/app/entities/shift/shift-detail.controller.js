(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .controller('ShiftDetailController', ShiftDetailController);

    ShiftDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Shift', 'Rota', 'Employee'];

    function ShiftDetailController($scope, $rootScope, $stateParams, entity, Shift, Rota, Employee) {
        var vm = this;
        vm.shift = entity;
        vm.load = function (id) {
            Shift.get({id: id}, function(result) {
                vm.shift = result;
            });
        };
        var unsubscribe = $rootScope.$on('rotamanagerApp:shiftUpdate', function(event, result) {
            vm.shift = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
