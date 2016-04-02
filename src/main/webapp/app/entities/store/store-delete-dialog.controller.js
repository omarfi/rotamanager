(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .controller('StoreDeleteController',StoreDeleteController);

    StoreDeleteController.$inject = ['$uibModalInstance', 'entity', 'Store'];

    function StoreDeleteController($uibModalInstance, entity, Store) {
        var vm = this;
        vm.store = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Store.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
