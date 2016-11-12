(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('admin.jhi-metrics', {
            url: '/metrics',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'Application Metrics'
            },
            views: {
                'content@authenticated': {
                    templateUrl: 'app/admin/metrics/metrics.html',
                    controller: 'JhiMetricsMonitoringController',
                    controllerAs: 'vm'
                }
            },
            title: 'Metrics',
            sidebarMeta: {
                icon: 'glyphicon glyphicon-dashboard',
                order: 1
            }
        });
    }
})();
