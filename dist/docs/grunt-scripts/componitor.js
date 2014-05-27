/** Componitor v. 0.2.0-SNAPSHOT */
(function(exports, global) {
    global["true"] = exports;
    var componitorModule = angular.module("componitor", [ "componitor.service" ]).run([ "$document", "Componitor", function($document, Componitor) {
        Componitor.process(angular.element(document.body));
    } ]).directive("componitorTemplate", [ function() {
        return {
            restrict: "E",
            priority: 1e3,
            terminal: true
        };
    } ]);
    var serviceModule = angular.module("componitor.service", []).config([ "$compileProvider", function($compileProvider) {
        serviceModule._addDirective = $compileProvider.directive;
    } ]).factory("Componitor", [ function() {
        function copyHtml(element) {
            return angular.element("<p>").append(angular.element(element).clone());
        }
        function Componitor() {
            var self = this;
            self._directiveNames = [];
            self._createDirective = function _createDirective(name, templateHtml) {
                if (self._directiveNames.indexOf(name) !== -1) {
                    throw new Error('Duplicate template name: "' + name + '"');
                }
                self._directiveNames.push(name);
                serviceModule._addDirective(name, [ "$compile", function($compile) {
                    return {
                        scope: true,
                        restrict: "AE",
                        terminal: true,
                        link: function(s, realElem) {
                            realElem.addClass("componitor-component");
                            realElem.addClass("componitor-component-" + name);
                            var template = copyHtml(templateHtml);
                            var contents = template.find("content");
                            angular.forEach(contents, function(c) {
                                var contentTag = angular.element(c);
                                var selector = contentTag.attr("selector");
                                var realContent = angular.element(realElem[0].querySelector(selector)).html();
                                contentTag.replaceWith(realContent);
                            });
                            realElem.html(template.html());
                            $compile(realElem.contents())(s);
                        }
                    };
                } ]);
            };
            self._processTemplate = function _processTemplate(t) {
                var templateElement = angular.element(t);
                templateElement.css({
                    display: "none"
                });
                var name = templateElement.attr("name");
                if (!name) {
                    throw "<componitor-template /> name should be the camelCased name of the created directive";
                }
                self._createDirective(name, templateElement.html());
            };
            self.process = function(htmlToProcess) {
                var templates = copyHtml(htmlToProcess).find("componitor-template");
                angular.forEach(templates, function(t) {
                    self._processTemplate(t);
                });
            };
        }
        return new Componitor();
    } ]);
})({}, function() {
    return this;
}());