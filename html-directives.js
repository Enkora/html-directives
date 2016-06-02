'format global';
/* global define */
'deps angular';

(function() {
  'use strict';

  function htmlDirectives(angular) {
    return angular.module('htmlDirectives', [])

    .provider('htmlDirectives', function() {
      // contains templates
      var templateUrls = [];

      // bool, true when all directive html files have been loaded and compiled
      var isCompiled = false;

      // reference to $compileProvider
      var _compiler = null;

      // set template url, replaces existing
      this.setTemplateUrl = function(templateUrl) {
        templateUrls = [templateUrl];
      };

      // add new template url in addition to existing ones
      this.addTemplateUrl = function(templateUrl) {
        templateUrls.push(templateUrl);
      };

      // set reference to _compiler, done automatically in .config
      this._setCompiler = function(c) {
        _compiler = c;
      };

      this.$get = function() {
        return {
          templateUrls: templateUrls,
          isCompiled: isCompiled,
          _compiler: _compiler
        };
      };
    })

    .config(['$compileProvider', 'htmlDirectivesProvider',
      function($compileProvider, htmlDirectivesProvider) {
        htmlDirectivesProvider._setCompiler($compileProvider);
      }
    ])

    .run(['htmlDirectives', '$http', '$log',
      function(htmlDirectives, $http, $log) {
        // transforms name, example: "some-test-name" => "someTestName"
        var transformName = function(nodeName) {
          var directiveName = '';

          angular.forEach(nodeName.toLowerCase().split('-'), function(part, index) {
            directiveName += index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1);
          });

          return directiveName;
        };

        // parses a directive attribute
        var parseAttribute = function(attr, directiveName, directive) {
          /* jshint maxcomplexity:20 */
          var tname = transformName(attr.name);

          var warningMsg = 'Html-Directive (' + directiveName + ') attribute (' + tname + ') is reserved and contains a wrong value (' + attr.value + '). Allowed values are: ';

          switch (tname) {
            case 'replace':
              if (attr.value !== 'true' && attr.value !== 'false') {
                $log.error(warningMsg + ' true, false');
                break;
              }

              directive.replace = attr.value;
              break;

            case 'restrict':
              if (!attr.value || !attr.value.match(/^[AEC]{1,3}$/)) {
                $log.error(warningMsg + ' A, E, C or any combination of these (AE, AEC, CE)');
                break;
              }

              directive.restrict = attr.value.toUpperCase();
              break;

            case 'transclude':
              if (attr.value !== 'true' && attr.value !== 'false') {
                $log.error(warningMsg + ' true, false');
                break;
              }

              directive.transclude = attr.value;
              break;

            case 'scope':
              $log.error('Html-Directive (' + directiveName + ') attribute (' + tname + ') is reserved. See HTML-directives docs for defining scope variables.');
              break;

            // do not require implementation
            case 'template':
            case 'templateUrl':

            // TBD
            case 'require':
              $log.error('Html-Directive (' + directiveName + ') attribute (' + tname + ') is reserved. However, provided by this attribute has not been yet implemented.');
              break;

            case 'link':
            case 'compile':
            case 'controller':
              $log.error('Html-Directive (' + directiveName + ') attribute (' + tname + ') should contain a javascript function. It is defined within separate <script> block inside directive. See docs.');
              break;

            default:
              // scope variable
              if (attr.value && !attr.value.match(/^[\@\=\&]$/)) {
                $log.error('Html-Directive (' + directiveName + ') attribute (' + tname + ') contains wrong value. You can have either "@", "=" or "&". Default is "=". See docs for meaning of these.');
                break;
              }

              directive.scope[tname] = attr.value ? attr.value : '=';
          }
        };

        // parses functions defined in string script into directive
        var parseScript = function(script, directive) {
          var possibleFunctions = ['link', 'compile', 'controller'];
          var i;

          // define scope
          var scriptScope = {};
          for (i in possibleFunctions) {
            scriptScope[possibleFunctions[i]] = null;
          }

          // run <script> block inside context of scriptScope
          /* jshint -W054 */
          (new Function('with(this) {' + script + '}')).call(scriptScope);

          // link back functions to directive
          for (i in possibleFunctions) {
            var funcName = possibleFunctions[i];
            if (typeof(scriptScope[funcName]) === 'function') {
              directive[funcName] = scriptScope[funcName];
            }
          }

          if (typeof(scriptScope.link) === 'function') {
            directive.link = scriptScope.link;
          }
        };

        var parseElement = function(childElem) {
          var child = angular.element(childElem);
          var nodeName = child[0].nodeName;
          var directiveName = transformName(nodeName);

          var directive = {
            restrict: 'EA',
            template: child.html(),
            scope: {}
          };

          angular.forEach(child[0].attributes, function(attr) {
            parseAttribute(attr, directiveName, directive);
          });

          // if scope is empty, delete it
          var scopeCount = 0;
          for (var i in directive.scope) {
            scopeCount += 1;
          }

          if (scopeCount <= 0) {
            delete directive.scope;
          }

          // handle functions
          var script = child.find('script');
          if (script[0] && script[0].innerHTML) {
            parseScript(script[0].innerhTML, directive);
          }

          // compile directive
          htmlDirectives._compiler.directive.apply(null, [
            directiveName,
            function() {
              return directive;
            }
          ]);
        };

        var fileCount = htmlDirectives.templateUrls.length;
        var processedFiles = 0;
        var setCompiled = function() {
          processedFiles++;

          if (processedFiles >= fileCount) {
            htmlDirectives.isCompiled = true;
          }
        };

        if (fileCount === 0) {
          htmlDirectives.isCompiled = true;
        }

        angular.forEach(htmlDirectives.templateUrls, function(url) {
          $http.get(url).then(function(ret) {
            var div = document.createElement('div');
            div.innerHTML = ret.data;
            var elem = angular.element(div);

            angular.forEach(elem.children(), parseElement);

            setCompiled();
          }, function(err) {
            $log.error('Could not load HTML Directives from file ' + url + ' (' + err.status + ', ' + err.statusText + ')');
            setCompiled();
          });
        });
      }
    ])


    .directive('htmlDirectives', ['htmlDirectives', '$compile', '$animate',
      function(htmlDirectives, $compile, $animate) {
        return {
          restrict: 'A',
          terminal: true,
          priority: 1000,
          compile: function compile(element) {
            var content = element[0].innerHTML;
            element.html('');

            return function($scope, $element) {
              $scope.$watch(function() {
                return htmlDirectives.isCompiled;
              }, function(isLoaded) {
                if (isLoaded) {
                  $animate.enter($compile(content)($scope), $element);
                }
              }, true);
            };
          }
        };
      }
    ]);

  }

  if (typeof define === 'function' && define.amd) {
    define(['angular'], htmlDirectives);
  } else if (typeof module !== 'undefined' && module && module.exports) {
    htmlDirectives(angular);
    module.exports = 'htmlDirectives';
  } else {
    htmlDirectives(angular);
  }
})();
