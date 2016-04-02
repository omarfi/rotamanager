(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .controller('EmployeeDialogController', EmployeeDialogController);

    EmployeeDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'DataUtils', 'entity', 'Employee', 'Shift', 'Store'];

    function EmployeeDialogController ($scope, $stateParams, $uibModalInstance, DataUtils, entity, Employee, Shift, Store) {
        var vm = this;
        vm.employee = entity;
        vm.shifts = Shift.query();
        vm.stores = Store.query();
        vm.load = function(id) {
            Employee.get({id : id}, function(result) {
                vm.employee = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('rotamanagerApp:employeeUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.employee.id !== null) {
                Employee.update(vm.employee, onSaveSuccess, onSaveError);
            } else {
                Employee.save(vm.employee, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        vm.datePickerOpenStatus = {};

        vm.setPicture = function ($file, employee) {
            if ($file && $file.$error === 'pattern') {
                return;
            }
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        employee.picture = base64Data;
                        employee.pictureContentType = $file.type;
                    });
                });
            }
        };
        vm.datePickerOpenStatus.hiredDate = false;

        vm.openFile = DataUtils.openFile;
        vm.byteSize = DataUtils.byteSize;

        vm.openCalendar = function(date) {
            vm.datePickerOpenStatus[date] = true;
        };
    }
})();
