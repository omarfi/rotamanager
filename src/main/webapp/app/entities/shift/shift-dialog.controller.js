(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .controller('ShiftDialogController', ShiftDialogController);

    ShiftDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Shift', 'Rota', 'Employee'];

    function ShiftDialogController ($scope, $stateParams, $uibModalInstance, entity, Shift, Rota, Employee) {
        var vm = this;
        vm.shift = entity;
        vm.rotas = Rota.query();
        vm.employees = Employee.query();
        vm.load = function(id) {
            Shift.get({id : id}, function(result) {
                vm.shift = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('rotamanagerApp:shiftUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.shift.id !== null) {
                Shift.update(vm.shift, onSaveSuccess, onSaveError);
            } else {
                Shift.save(vm.shift, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.start = false;
        vm.datePickerOpenStatus.end = false;

        vm.openCalendar = function(date) {
            vm.datePickerOpenStatus[date] = true;
        };
    }
})();
