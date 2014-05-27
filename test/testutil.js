
/** Add jasmine matchers */
beforeEach(function() {
  function copyHtml(element) {
    return angular.element('<p>').append(angular.element(element).clone());
  }

  this.addMatchers({
    toBeEmpty: function () {
      var actual = this.actual;
      var notText = this.isNot ? ' not' : '';
      this.message = function () {
        return 'Expected ' + actual + notText + ' to be empty';
      };
      return actual.length === 0;
    },
    toHaveHtml: function(expected) {
      var actual = this.actual;
      var notText = this.isNot ? ' not' : '';
      var html = angular.element(actual).html();
      this.message = function() {
        return 'Expected html ' + html + notText + ' to equal ' + expected;
      };
      return html === expected;
    },
    toHaveOuterHtml: function(expected) {
      var actual = this.actual;
      var notText = this.isNot ? ' not' : '';
      var html = copyHtml(actual).html();
      this.message = function() {
        return 'Expected html ' + html + notText + ' to equal ' + expected;
      };
      return html === expected;
    }
  });
});