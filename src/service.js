/**
 * @ngdoc overview
 * @name componitor.service
 * @module componitor.service
 *
 * @description
 * The module for the template registration service. See the {@link componitor.service.Componitor Componitor} service
 *
 * @see componitor.service.Componitor
 *
 */
var serviceModule = angular.module('componitor.service', [])
  .config(['$compileProvider', function ($compileProvider) {
    // Save the $compileProvider.directive for later use
    serviceModule._addDirective = $compileProvider.directive;
  }])
  .factory('Componitor', [function () {
    /**
     * Clones the outer html of the target element
     * @param element the element whose outer html is copied
     * @returns {*} the copied html
     */
    function copyHtml(element) {
      return angular.element('<p>').append(angular.element(element).clone());
    }

    /**
     * @ngdoc service
     * @module componitor.service
     * @name componitor.service.Componitor
     * @constructor
     * @function
     *
     * @description
     * Parses and registers the directives for the found `<componitor-template />`
     * elements from the given html fragment.
     *
     * Usage: Call `#process` for the html fragment. See example below for more.
     *
     * @see componitor.service.Componitor#process
     *
     * @example
     <example module="demoModule">
     <file name="index.html">
     <hello-box>
      <hello-box-title>Hello from index.html</hello-box-title>
     </hello-box>
     </file>
     <file name="templates.html">
     <componitor-template name="helloBox">
     <h1 class="hello-box-title">
     <content selector="hello-box-title" />
     </h1>
     <p>Hello from templates.html</p>
     </componitor-template>
     </file>
     <file name="script.js">
     angular.module('demoModule', ['componitor'])
     .run(function($templateCache, Componitor) {
      Componitor.process($templateCache.get('templates.html'));
    });
     </file>
     <file name="styles.css">
      hello-box {
        display: block;
        padding: 1em;
        border: 1px solid #333;
      }
     </file>
     </example>
     */
    function Componitor() {
      var self = this;

      self._directiveNames = [];
      /**
       * @ngdoc method
       * @methodOf componitor.service.Componitor
       * @name componitor.service.Componitor#_createDirective
       * @param {string} name the camelCased angularjs-style representation of the directive-to-be's name
       * @param {text/html} templateHtml the contents of the `<componitor-template />` block
       * @protected
       * @function
       *
       * @description
       * *NOT PART OF THE PUBLIC API*
       *
       * Registers a componitor template directive with the `$compileProvider`.
       * This method should be called before the html containing the usages of
       * the templates is `$compile`d.
       *
       * @see {@link componitor.service.Componitor#process}
       *
       */
      self._createDirective = function _createDirective(name, templateHtml) {
        if (self._directiveNames.indexOf(name) !== -1) {
          throw new Error('Duplicate template name: "'+name+'"');
        }
        self._directiveNames.push(name);
        serviceModule._addDirective(name, ['$compile', function ($compile) {
          return {
            scope: true,
            restrict: 'AE',
            terminal: true,
            link: function (s, realElem, attrs) {
              realElem.addClass('componitor-component');
              realElem.addClass('componitor-component-' + name);

              attrs.$observe('values', function(v) {
                s.values = s.$eval(v);
                if (!s.$$phase && !s.$root.$$phase) {
                  s.$apply();
                }
              });

              var template = copyHtml(templateHtml);
              // Find the content elements to be replaced by their selectors
              var contents = template.find('content');
              angular.forEach(contents, function (c) {
                // Replace each of the <content /> elements with their selector
                var contentTag = angular.element(c);
                var selector = contentTag.attr('selector');
                var realContent = angular.element(realElem[0].querySelector(selector)).html();

                contentTag.replaceWith(realContent);
              });

              // Replace with the populated template and $compile
              realElem.html(template.html());
              $compile(realElem.contents())(s);
            }
          };
        }]);
      };

      /**
       * @ngdoc method
       * @name componitor.service.Componitor#_processTemplate
       * @methodOf componitor.service.Componitor
       * @param {text/html} t the element to parse
       * @protected
       * @function
       *
       * @description
       * *NOT PART OF THE PUBLIC API*
       *
       * Parses the target `<componitor-template />` element and registers
       * it with `_createDirective`.
       *
       * @see componitor.service.Componitor#_createDirective
       */
      self._processTemplate = function _processTemplate(t) {
        var templateElement = angular.element(t);
        templateElement.css({display: 'none'});
        var name = templateElement.attr('name');
        if (!name) {
          throw '<componitor-template /> name should be the camelCased name of the created directive';
        }
        self._createDirective(name, templateElement.html());
      };

      /**
       * @ngdoc method
       * @name componitor.service.Componitor#process
       * @methodOf componitor.service.Componitor
       * @param {element} htmlToProcess the html element to find the `componitor-templates` in.
       *
       * @description
       * Processes the given html and registers the `<componitor-template />`s.
       *
       * @see componitor.service.Componitor#_createDirective
       * @see componitor.service.Componitor#_processTemplate
       */
      self.process = function (htmlToProcess) {
        var templates = copyHtml(htmlToProcess).find('componitor-template');
        angular.forEach(templates, function (t) {
          self._processTemplate(t);
        });
      };
    }

    return new Componitor();
  }]);