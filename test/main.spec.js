
describe('component generation', function() {

  var element;

  function createBody(componentBody, templateBody) {
    return '<div id="componitorTest" ng-controller="TestCtrl">' +
      '<my-box>' +
        componentBody +
      '</my-box>' +
      '<componitor-template name="myBox">' +
        templateBody +
      '</componitor-template>' +
    '</div>';
  }

  function template() {
    return element.find('componitor-template').eq(0);
  }

  function realElement() {
    return element.children().eq(0);
  }

  function startWithHtml(html) {
    angular.module('testCtrlModule', [])
      .controller('TestCtrl', function($scope) {
        $scope.title = 'great!';
      });
    beforeEach(function() {
      angular.element(document.body).append(html);
      element = angular.element(document.getElementById('componitorTest'));
      angular.bootstrap(document, ['componitor', 'testCtrlModule']);
    });
    afterEach(function() {
      element.remove();
    });
  }

  function start(componentBody, templateBody) {
    startWithHtml(createBody(componentBody, templateBody));
  }

  describe('simple case', function() {
    start('<my-box-title>The title is {{title}}</my-box-title>', '<h1><content selector="my-box-title" /></h1>');

    it('should hide the <componitor-element />', function() {
      expect(template().css('display')).toBe('none');
    });

    it('should render the contents for the real element', function() {
      expect(realElement().html()).toEqual('<h1 class="ng-scope ng-binding">The title is great!</h1>');
    });

    it('should add the .componitor-component class', function() {
      expect(realElement().attr('class')).toContain('componitor-component');
    });
  });

  describe('multiple substitutions, order agnostic', function() {
    start(
      '<my-box-content>1+2={{1+2}}</my-box-content><my-box-title>Hooray!</my-box-title>',
      '<h2><content selector="my-box-title" /></h2><p><content selector="my-box-content" /></p>'
    );

    it('should render the contents in their respective <content/> locations', function() {
      expect(realElement().find('h2').text()).toEqual('Hooray!');
      expect(realElement().find('p').text()).toEqual('1+2=3');
    });
  });

  describe('nested templates', function() {
    startWithHtml('<div id="componitorTest" ng-controller="TestCtrl">' +
      '<my-box>' +
        '<p>' +
          '<labeled-input>' +
            '<span>The label</span>' +
          '</labeled-input>' +
        '</p>' +
      '</my-box>' +
      // First template
      '<componitor-template name="myBox">' +
        '<div class="my-box">' +
          '<content selector="p" />' +
        '</div>' +
      '</componitor-template>' +
      // Other template
      '<componitor-template name="labeledInput">' +
        '<label>' +
          '<content selector="span" />' +
          '<input type="text" />' +
        '</label>' +
      '</componitor-template>' +
      '</div>');

    it('should render the components inside each other', function() {
      expect(realElement().find('label').text()).toEqual('The label');
      expect(realElement().find('input').length).toBe(1);
    });
  });

});