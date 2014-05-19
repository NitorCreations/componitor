/** Componitor v. 0.1.0 */
(function(exports, global) {
    global["true"] = exports;
    var componitor = angular.module("componitor", []).config([ "$compileProvider", function($compileProvider) {
        function createDirective(name, templateHtml) {
            $compileProvider.directive(name, [ "$compile", function($compile) {
                return {
                    scope: true,
                    restrict: "E",
                    terminal: true,
                    link: function(s, realElem) {
                        realElem.addClass("componitor-component");
                        realElem.addClass("componitor-component-" + name);
                        var template = angular.element("<p>").append(angular.element(templateHtml).clone());
                        var contents = template.find("content");
                        angular.forEach(contents, function(c) {
                            var contentTag = angular.element(c);
                            var selector = contentTag.attr("selector");
                            var realContent = realElem.find(selector).html();
                            contentTag.replaceWith(realContent);
                        });
                        realElem.html(template.html());
                        $compile(realElem.contents())(s);
                    }
                };
            } ]);
        }
        var templates = angular.element(document.body).find("componitor-template");
        angular.forEach(templates, function(t) {
            var templateElement = angular.element(t);
            templateElement.css({
                display: "none"
            });
            var name = templateElement.attr("name");
            if (!name) {
                throw "<componitor-template /> name should be the camelCased name of the created directive";
            }
            createDirective(name, templateElement.html());
        });
    } ]);
})({}, function() {
    return this;
}());