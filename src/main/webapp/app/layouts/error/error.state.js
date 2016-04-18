(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('error', {
                parent: 'unauthenticated',
                url: '/error',
                data: {
                    authorities: [],
                    pageTitle: 'Error page!'
                },
                views: {
                    'content@unauthenticated': {
                        templateUrl: 'app/layouts/error/error.html'
                    }
                }
            })
            .state('accessdenied', {
                parent: 'unauthenticated',
                url: '/accessdenied',
                data: {
                    authorities: []
                },
                views: {
                    'content@unauthenticated': {
                        templateUrl: 'app/layouts/error/accessdenied.html'
                    }
                }
            });
    }
})();
