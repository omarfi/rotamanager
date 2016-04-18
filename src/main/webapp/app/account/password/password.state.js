(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('password', {
            parent: 'account',
            url: '/password',
            data: {
                authorities: ['ROLE_STORE'],
                pageTitle: 'Password'
            },
            views: {
                'content@authenticated': {
                    templateUrl: 'app/account/password/password.html',
                    controller: 'PasswordController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();
