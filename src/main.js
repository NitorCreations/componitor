/**
 * @ngdoc overview
 * @name componitor
 * @module componitor
 *
 * @description
 * Generate simple HTML template -like directives on the fly.
 * Currently, the templates need the present on application bootstrap to be correctly loaded.
 *
 * @example
<example module="componitor">
 <file name="index.html">

  <div ng-controller="DemoCtrl as ctrl">
  <h1>There should be a box below</h1>
  Title: <input type="text" ng-model="ctrl.title" />
  Body: <input type="text" ng-model="ctrl.body" />
  </div>

  <my-box>
    <my-box-title>{{ctrl.title}}</my-box-title>
    <my-box-content>{{ctrl.body}}</my-box-content>
  </my-box>

  <h2>And another box with extended contents</h2>
  <my-box>
    <my-box-title>My title is: {{ctrl.title}}</my-box-title>
    <my-box-body>And the body: {{ctrl.body}}</my-box-body>
    <!-- This will be ignored -->
    <my-box-body>This should never be shown</my-box-body>
  </my-box>


  <!-- Uses the same camelCase style as angularjs directives -->
  <componitor-template name="myBox">
    <!-- The template goes here -->
    <div class="my-box">
      <h3><content selector="my-box-title" /></h3>
      <p><content selector="my-box-body" /></h3>
    </div>
  </componitor-template>

 </file>
 <file name="script.js">
  function DemoCtrl() {
    this.title = "Title";
    this.body = "Lorem ipsum...";
  }
 </file>
 <file name="style.css">
  .my-box {
    display: inline-block;
    width: 150px;
    height: 150px;
    float: left;
    border: 1px solid #333;
  }
 </file>
</example>
 */
/**
 * @ngdoc directive
 * @name componitor.directive:componitorTemplate
 * @module componitor
 * @restrict AE
 *
 * @param {String} name an AngularJs-style camelCased representation of the created directive's name. Use two part names containing a dash to avoid future problems.
 *
 * @description
 * Registers a new html template directive with the given `name`. The componitor-template is
 * automatically hidden from view by settings `style="display:none;"`.
 *
 * NOTE: Not a real directive. The contents of the `<componitor-template />` elements are parsed in the `.config`
 * method. I.e., the tags must be present when the angular application is bootstrapped.
 *
 */
var componitor = angular.module('componitor', [])
  .config(['$compileProvider', function($compileProvider) {
    function createDirective(name, templateHtml) {

      $compileProvider.directive(name, ['$compile', function($compile) {
        return {
          scope: true,
          restrict: 'E',
          terminal: true,
          link: function(s,realElem) {
            realElem.addClass('componitor-component');
            realElem.addClass('componitor-component-' + name);

            var template = angular.element('<p>').append(angular.element(templateHtml).clone());
            // Find the content elements to be replaced by their selectors
            var contents = template.find('content');
            angular.forEach(contents, function(c) {
              // Replace each of the <content /> elements with their selector
              var contentTag = angular.element(c);
              var selector = contentTag.attr('selector');
              var realContent = realElem.find(selector).html();

              contentTag.replaceWith(realContent);
            });

            // Replace with the populated template and $compile
            realElem.html(template.html());
            $compile(realElem.contents())(s);
          }
        };
      }]);
    }

    var templates = angular.element(document.body).find('componitor-template');
    angular.forEach(templates, function(t) {
      var templateElement = angular.element(t);
      templateElement.css({display: 'none'});
      var name = templateElement.attr('name');
      if (!name) {
        throw '<componitor-template /> name should be the camelCased name of the created directive';
      }
      createDirective(name, templateElement.html());
    });

  }]);
