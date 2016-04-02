(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .factory('RotaSearch', RotaSearch);

    RotaSearch.$inject = ['$resource'];

    function RotaSearch($resource) {
        var resourceUrl =  'api/_search/rotas/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
