(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .controller('StoreDialogController', StoreDialogController);

    StoreDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Store', 'Rota', 'Employee'];

    function StoreDialogController ($scope, $stateParams, $uibModalInstance, entity, Store, Rota, Employee) {
        var vm = this;
        vm.store = entity;
        vm.rotas = Rota.query();
        vm.employees = Employee.query();
        vm.load = function(id) {
            Store.get({id : id}, function(result) {
                vm.store = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('rotamanagerApp:storeUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.store.id !== null) {
                Store.update(vm.store, onSaveSuccess, onSaveError);
            } else {
                Store.save(vm.store, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
