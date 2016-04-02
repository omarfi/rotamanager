(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .controller('RotaDialogController', RotaDialogController);

    RotaDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Rota', 'Shift', 'Store'];

    function RotaDialogController ($scope, $stateParams, $uibModalInstance, entity, Rota, Shift, Store) {
        var vm = this;
        vm.rota = entity;
        vm.shifts = Shift.query();
        vm.stores = Store.query();
        vm.load = function(id) {
            Rota.get({id : id}, function(result) {
                vm.rota = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('rotamanagerApp:rotaUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.rota.id !== null) {
                Rota.update(vm.rota, onSaveSuccess, onSaveError);
            } else {
                Rota.save(vm.rota, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
