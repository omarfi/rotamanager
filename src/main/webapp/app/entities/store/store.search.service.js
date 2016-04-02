(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .factory('StoreSearch', StoreSearch);

    StoreSearch.$inject = ['$resource'];

    function StoreSearch($resource) {
        var resourceUrl =  'api/_search/stores/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
