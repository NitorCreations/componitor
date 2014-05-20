
describe('component generation', function() {

  var element;

  function createBody(componentBody, templateBody) {
    return '<div ng-controller="TestCtrl">' +
        '<my-box>' +
          componentBody +
        '</my-box>' +
      '</div>' +
      '<componitor-template name="myBox">' +
        templateBody +
      '</componitor-template>';
  }

  function template() {
    return element.find('componitor-template').eq(0);
  }

  function realElement() {
    return angular.element(element[0].querySelector('.componitor-component'));
  }

  function startWithHtml(html) {
    angular.module('testCtrlModule', [])
      .controller('TestCtrl', function($scope) {
        $scope.title = 'great!';
      });
    beforeEach(function() {
      angular.element(document.body).append('<div id="componitorTest">' + html + '</div>');
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

    it('should add the .componitor-component classes', function() {
      expect(realElement().attr('class')).toContain('componitor-component');
      expect(realElement().attr('class')).toContain('componitor-component-myBox');
    });
  });

  describe('multiple substitutions, order agnostic, finds by class name and attribute', function() {
    start(
      '<div class="my-box-content">1+2={{1+2}}</div><div my-box-title>Hooray!</div>',
      '<h2><content selector="[my-box-title]" /></h2><p><content selector=".my-box-content" /></p>'
    );

    it('should render the contents in their respective <content/> locations', function() {
      expect(realElement().find('h2').text()).toEqual('Hooray!');
      expect(realElement().find('p').text()).toEqual('1+2=3');
    });
  });

  describe('bindings in templates', function() {
    startWithHtml(
        '<div ng-controller="TestCtrl">' +
          '<output-value />' +
        '</div>' +
        '<div ng-init="title=\'Foobar\'">' +
          '<componitor-template name="outputValue">' +
            '<span>Value:{{title}}</span>' +
          '</componitor-template>' +
        '</div>'
    );

    it('should get the value from TestCtrl where it is used, not the template\'s scope', function() {
      expect(realElement().find('span').text()).toBe('Value:great!');
    });
  });

  describe('template contents', function() {

    startWithHtml('<div ng-init="value=50"><componitor-template name="tempLate"><span>{{value}}</span></componitor-template></div>');

    it('should not be compiled', function() {
      expect(template().find('span').text()).toEqual('{{value}}');
    });
  });

  describe('nested templates', function() {
    startWithHtml(
      '<div ng-controller="TestCtrl">' +
        '<my-box>' +
          '<p>' +
            '<labeled-input>' +
              '<span>The label</span>' +
            '</labeled-input>' +
          '</p>' +
        '</my-box>' +
      '</div>' +
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
      '</componitor-template>');

    it('should render the components inside each other', function() {
      expect(realElement().find('labeled-input').attr('class')).toContain('componitor-component');
      expect(realElement().find('labeled-input').attr('class')).toContain('componitor-component-labeledInput');
      expect(realElement().find('label').text()).toEqual('The label');
      expect(realElement().find('input').length).toBe(1);
    });
  });

});