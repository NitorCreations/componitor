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

  ddescribe('with isolate="true" on the template', function() {

    beforeEach(function() {
      Componitor.process(
          '<componitor-template name="progress" isolate="true">' +
            '<progress-bar values="{type:\'success\', value: values.success}"></progress-bar>' +
            '<progress-bar values="{type:\'warning\', value: values.warning}"></progress-bar>' +
          '</componitor-template>' +
          '<componitor-template name="progressBar" isolate="true">' +
            '<div class="progress-bar progress-bar-{{values.type}}" style="width: {{values.value}}%"></div>' +
          '</componitor-template>'
      );
      $scope.progress = {
        success: 40,
        warning: 20
      };
      elem = $compile('<progress values="progress"></progress-bar>')($scope);
      $scope.$digest();
    });

    function expectWidths(success, warning) {
      expect(angular.element(elem[0].querySelector('.progress-bar-success')).css('width')).toEqual(success);
      expect(angular.element(elem[0].querySelector('.progress-bar-warning')).css('width')).toEqual(warning);
    }

    it('should make the scope isolated and add two-way binding to \'values\'', function() {
      expectWidths('40%', '20%');
    });

    it('should change the values in the children\'s scopes', function() {
      $scope.progress = {
        success: 10,
        warning: 15
      };
      $scope.$digest();
      expectWidths('10%', '15%');
    });
  });
});