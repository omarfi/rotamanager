(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .controller('UserManagementDetailController', UserManagementDetailController);

    UserManagementDetailController.$inject = ['$stateParams', 'User'];

    function UserManagementDetailController ($stateParams, User) {
        var vm = this;

        vm.load = load;
        vm.user = {};

        vm.load($stateParams.username);

        function load (username) {
            User.get({username: username}, function(result) {
                vm.user = result;
            });
        }
    }
})();
