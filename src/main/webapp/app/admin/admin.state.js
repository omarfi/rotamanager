(function () {
    'use strict';

    angular
        .module('rotamanagerApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig ($stateProvider) {
        $stateProvider.state('admin', {
            abstract: true,
            parent: 'authenticated',
            title: 'Administration',
            sidebarMeta: {
                icon: 'glyphicon glyphicon-tower',
                order: 1,
                shouldBeVisible: true
            }
        });
    }
})();
