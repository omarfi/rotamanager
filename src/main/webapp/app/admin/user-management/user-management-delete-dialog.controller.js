(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .controller('UserManagementDeleteController', UserManagementDeleteController);

    UserManagementDeleteController.$inject = ['$uibModalInstance', 'entity', 'User'];

    function UserManagementDeleteController ($uibModalInstance, entity, User) {
        var vm = this;

        vm.user = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (username) {
            User.delete({username: username},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
