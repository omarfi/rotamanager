(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .factory('ShiftSearch', ShiftSearch);

    ShiftSearch.$inject = ['$resource'];

    function ShiftSearch($resource) {
        var resourceUrl =  'api/_search/shifts/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
