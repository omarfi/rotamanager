(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('audits', {
            parent: 'admin',
            url: '/audits',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'Audits'
            },
            views: {
                'content@authenticated': {
                    templateUrl: 'app/admin/audits/audits.html',
                    controller: 'AuditsController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();
