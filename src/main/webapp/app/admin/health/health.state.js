(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('admin.jhi-health', {
            url: '/health',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'Health Checks'
            },
            views: {
                'content@authenticated': {
                    templateUrl: 'app/admin/health/health.html',
                    controller: 'JhiHealthCheckController',
                    controllerAs: 'vm'
                }
            },
            title: 'Health',
            sidebarMeta: {
                icon: 'glyphicon glyphicon-heart',
                order: 2
            }
        });
    }
})();
