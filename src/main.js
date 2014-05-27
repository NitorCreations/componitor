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

 <div class="clearfix" ng-controller="DemoCtrl as ctrl">
 <h1>There should be a two boxes below with different contents</h1>
 Title: <input type="text" ng-model="ctrl.title" />
 Body: <input type="text" ng-model="ctrl.body" />


 <my-box>
 <my-box-title>{{ctrl.title}}</my-box-title>
 <my-box-body>{{ctrl.body}}</my-box-body>
 </my-box>

 <my-box>
 <my-box-title>My title is: {{ctrl.title}}</my-box-title>
 <my-box-body>And the body: {{ctrl.body}}</my-box-body>
 <!-- This will be ignored -->
 <my-box-body>This should never be shown</my-box-body>
 </my-box>

 </div>
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
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    float: left;
    width: 150px;
    height: 150px;
    border: 1px solid #333;
    margin-left: 10px;
  }
 .clearfix:after {
   content: ' ';
   display: block;
   clear: both;
 }
 </file>
 </example>
 */
/**
 * @ngdoc directive
 * @name componitor.directive:componitorTemplate
 * @module componitor
 * @restrict E
 *
 * @param {String} name an AngularJs-style camelCased representation of the created directive's name. Use two part names containing a dash to avoid future problems.
 *
 * @description
 * Registers a new html template directive with the given `name`. The componitor-template is
 * automatically hidden from view by settings `style="display:none;"`.
 *
 * NOTE: Not a real directive. The contents of the `<componitor-template />` elements are parsed in the `.config`
 * method. I.e., the tags must be present when the angular application is bootstrapped.
 */
/**
 * @ngdoc directive
 * @name componitor.directive:content
 * @module componitor
 * @restrict E
 *
 * @param {string} selector the selector the find the content with
 *
 * @description
 * This element is replaced with the content found by the `selector` attribute when
 * rendering the final markup.
 *
 * Uses `querySelector` to find the corresponding content. Use only the selectors
 * natively supported by the browsers you need to support.
 *
 * NOTE: Not a real directive. The contents of the `<componitor-template />` elements are parsed in the `.config`
 * method. I.e., the tags must be present when the angular application is bootstrapped.
 *
 * @example
 *
 <example module="componitor">
 <file name="example.html">
 <my-box>
 <span class="the-heading">The heading</span>
 <div the-content>
 <img src="http://upload.wikimedia.org/wikipedia/commons/f/f3/Youngkitten.JPG" width="200" />
 </div>
 </my-box>

 <componitor-template name="myBox">
 <div class="my-box">
 <h1 class="my-box-heading">
 <content selector=".the-heading" />
 </h1>
 <div class="my-box-content">
 <content selector="[the-content]" />
 </div>
 </div>
 </componitor-template>
 </file>
 </example>
 */
var componitorModule = angular.module('componitor', ['componitor.service'])
    .run(['$document', 'Componitor', function ($document, Componitor) {
      Componitor.process(angular.element(document.body));
    }])
    .directive('componitorTemplate', [function () {
      /** Prevent <componitor-template/> contents from being compiled */
      return {
        restrict: 'E',
        priority: 1000,
        terminal: true
      };
    }])
  ;
