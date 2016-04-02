(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .controller('EmployeeDetailController', EmployeeDetailController);

    EmployeeDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'DataUtils', 'entity', 'Employee', 'Shift', 'Store'];

    function EmployeeDetailController($scope, $rootScope, $stateParams, DataUtils, entity, Employee, Shift, Store) {
        var vm = this;
        vm.employee = entity;
        vm.load = function (id) {
            Employee.get({id: id}, function(result) {
                vm.employee = result;
            });
        };
        var unsubscribe = $rootScope.$on('rotamanagerApp:employeeUpdate', function(event, result) {
            vm.employee = result;
        });
        $scope.$on('$destroy', unsubscribe);

        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
    }
})();
