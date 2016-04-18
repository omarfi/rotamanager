(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$location', '$state', 'Auth', 'Principal', 'ENV'];

    function NavbarController ($location, $state, Auth, Principal, ENV) {
        var vm = this;

        vm.navCollapsed = true;
        vm.isAuthenticated = Principal.isAuthenticated;
        vm.inProduction = ENV === 'prod';
        vm.login = login;
        vm.logout = logout;
        vm.$state = $state;

        function login () {
            $state.go('login');
        }

        function logout () {
            Auth.logout();
            $state.go('login');
        }
    }
})();
