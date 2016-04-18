(function () {
    'use strict';

    angular
        .module('rotamanagerApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('authenticated', {
            abstract: true,
            parent: 'app',
            views: {
                'navbar@': {
                    templateUrl: 'app/layouts/navbar/navbar.html',
                    controller: 'NavbarController',
                    controllerAs: 'vm'
                },
                'layout@': {
                    templateUrl: 'app/layouts/authenticated/authenticated.html'
                }
            }

        });
    }
})();
