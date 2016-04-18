(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .config(loginConfig);

    loginConfig.$inject = ['$stateProvider'];

    function loginConfig($stateProvider) {
        $stateProvider.state('login', {
            parent: 'unauthenticated',
            url: '/login',
            data: {
                authorities: [],
                pageTitle: 'Login'
            },
            views: {
                'content@unauthenticated': {
                    templateUrl: 'app/account/login/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();
