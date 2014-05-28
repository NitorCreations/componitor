describe('Componitor service', function () {

  beforeEach(module('componitor.service'));

  var Componitor;
  var $compile, $scope, elem;
  beforeEach(inject(function (_Componitor_, _$compile_, $rootScope) {
    Componitor = _Componitor_;
    $compile = _$compile_;
    $scope = $rootScope.$new();
  }));

  describe('.process', function () {
    describe('with no templates', function () {
      it('should do nothing', function () {
        Componitor.process('<html></html>');
        expect(Componitor._directiveNames).toBeEmpty();
      });
    });

    describe('with single template', function () {
      it('should register the directive', function () {
        Componitor.process('<componitor-template name="myTemplate"></componitor-template>');
        expect(Componitor._directiveNames).toEqual(['myTemplate']);
      });
    });

    describe('with duplicate names', function () {
      it('should throw Error', function () {
        expect(function () {
          Componitor.process('<componitor-template name="myTemplate"></componitor-template><componitor-template name="myTemplate"></componitor-template>');
        }).toThrow(new Error('Duplicate template name: "myTemplate"'));
      });
    });
  });

  describe('with pre-processed template', function () {
    beforeEach(inject(function() {
      Componitor.process(
          '<componitor-template name="myBox">' +
            '<h1><content selector="my-box-title" /></h1>' +
            '<p><content selector="my-box-body" /></p>' +
          '</componitor-template>'
      );
    }));

    describe('simple case', function() {
      beforeEach(function() {
        $scope.name = 'World';
        elem = $compile(
            '<my-box>' +
            '<my-box-title>Hello {{name}}!</my-box-title>' +
            '<my-box-body>These are my greetings to you.</my-box-body>' +
            '</my-box>'
        )($scope);
        $scope.$digest();
      });
      it('should replace the <content/> tags', function() {
        expect(elem).toHaveOuterHtml(
          '<my-box class="ng-scope componitor-component componitor-component-myBox">' +
            '<h1 class="ng-scope ng-binding">Hello World!</h1>' +
            '<p class="ng-scope">These are my greetings to you.</p>' +
          '</my-box>'
        );
      });
    });
  });

  ddescribe('with variables as arguments to templates', function() {

    beforeEach(function() {
      Componitor.process(
          '<componitor-template name="progressBar">' +
            '<div class="progress-bar" style="width: {{values.barValue}}%"></div>' +
          '</componitor-template>'
      );
    });

    it('should pass the arguments to the scope bound to \'values\'', function() {
      $scope.theValue = 57;
      elem = $compile('<progress-bar values="{barValue: theValue}"></progress-bar>')($scope);
      $scope.$digest();
      expect(elem.children(0).css('width')).toEqual('57%');
    });
  });
});