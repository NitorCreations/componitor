describe('Componitor service', function () {

  beforeEach(module('componitor.service'));

  var Componitor;
  beforeEach(inject(function (_Componitor_) {
    Componitor = _Componitor_;
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
          Componitor.process('<componitor-template name="myTemplate"></componitor-template><componitor-template name="myTemplate"></componitor-template>')
        }).toThrow(new Error('Duplicate template name: "myTemplate"'));
      });
    });
  });

  describe('with pre-processed template', function () {
    var $compile, $scope, elem;
    beforeEach(inject(function(_$compile_, $rootScope) {
      $compile = _$compile_;
      $scope = $rootScope.$new();
      Componitor.process(
          '<componitor-template name="myBox">' +
            '<h1><content selector="my-box-title" /></h1>' +
            '<p><content selector="my-box-body" /></p>' +
          '</componitor-template>'
      );
    }));

    describe('simple case', function() {
      it('should replace the <content/> tags', function() {
        $scope.name = 'World';
        elem = $compile(
            '<my-box>' +
              '<my-box-title>Hello {{name}}!</my-box-title>' +
              '<my-box-body>These are my greetings to you.</my-box-body>' +
            '</my-box>'
        )($scope);
        $scope.$digest();

        expect(elem).toHaveOuterHtml(
          '<my-box class="ng-scope componitor-component componitor-component-myBox">' +
            '<h1 class="ng-scope ng-binding">Hello World!</h1>' +
            '<p class="ng-scope">These are my greetings to you.</p>' +
          '</my-box>'
        );
      });
    });


  });
});