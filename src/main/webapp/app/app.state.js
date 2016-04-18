(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('app', {
            abstract: true,
            views: {
                "unauthenticated@": {
                    templateUrl: 'app/layouts/unauthenticated/unauthenticated.html'
                },
                "authenticated@": {
                    templateUrl: 'app/layouts/authenticated/authenticated.html'
                }
            },
            resolve: {
                authorize: ['Auth',
                    function (Auth) {
                        return Auth.authorize();
                    }
                ]
            }
        });
    }
})();
