(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .controller('RotaDeleteController',RotaDeleteController);

    RotaDeleteController.$inject = ['$uibModalInstance', 'entity', 'Rota'];

    function RotaDeleteController($uibModalInstance, entity, Rota) {
        var vm = this;
        vm.rota = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Rota.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
