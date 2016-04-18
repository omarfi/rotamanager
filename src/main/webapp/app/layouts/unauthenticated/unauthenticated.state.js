(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('unauthenticated', {
            abstract: true,
            parent: 'app',
            views: {
                'layout@': {
                    templateUrl: 'app/layouts/unauthenticated/unauthenticated.html'
                }
            }
        });
    }
})();
