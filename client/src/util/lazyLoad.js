'use strict';

exports.lazyLoadModule = function(module){
  var resolver = {
    'lazyLoad': ['$q', '$ocLazyLoad', function($q, $ocLazyLoad){
      var deferred = $q.defer();
      require.ensure([], function (require) {
        var mod = require('../modules/' + module + '.js');
        $ocLazyLoad.load({
          name: mod.name,
        });
        deferred.resolve();
      });
      return deferred.promise;
    }]
  }
  return resolver;
}
