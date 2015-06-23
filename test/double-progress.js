describe('Directive: double-progress', function() {
	var element, $compile, $rootScope;

	beforeEach(module('double-progress.directive'));

	beforeEach(inject(function(_$compile_, _$rootScope_){
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));

	element = angular.element('<double-progress-arc data-width="200" expected="expected" actual="actual" />');

	it('Should throw error when missing expected or actual', function() {
		var scope = $rootScope.$new();
		scope.actual = 0.5;
		var compileDirective = function() {
			return $compile(element)(scope);
		}
		expect(compileDirective).toThrow(new Error('Invalid Progress Data'));

		var scope = $rootScope.$new();
		scope.expected = 0.5;
		var compileDirective = function() {
			return $compile(element)(scope);
		}
		expect(compileDirective).toThrow(new Error('Invalid Progress Data'));
	});

	it('Should throw error when expected not in range', function() {
		var scope = $rootScope.$new();
		scope.expected = 0.0;
		scope.actual = 0.5;
		var compileDirective = function() {
			return $compile(element)(scope);
		}
		expect(compileDirective).toThrow(new Error('Invalid Progress Data'));

		scope.expected = 1.1;
		var compileDirective = function() {
			return $compile(element)(scope);
		}
		expect(compileDirective).toThrow(new Error('Invalid Progress Data'));

		scope.expected = -0.5;
		var compileDirective = function() {
			return $compile(element)(scope);
		}
		expect(compileDirective).toThrow(new Error('Invalid Progress Data'));
	});

	it('Should throw error when actual not in range', function() {
		var scope = $rootScope.$new();
		scope.expected = 0.5;
		scope.actual = -0.1;
		var compileDirective = function() {
			return $compile(element)(scope);
		}
		expect(compileDirective).toThrow(new Error('Invalid Progress Data'));

		scope.expected = 1.1;
		var compileDirective = function() {
			return $compile(element)(scope);
		}
		expect(compileDirective).toThrow(new Error('Invalid Progress Data'));
	});

	it('Should draw widget with basic properties', inject(function($timeout, d3) {
		var scope = $rootScope.$new();
		scope.expected = 0.598;
		scope.actual = 0.15;
		element = $compile(element)(scope);
		scope.$digest();
		
		expect(element.isolateScope().expected).toBe(0.60);
		expect(element.isolateScope().actual).toBe(0.15);
		
		$timeout.flush();

		expect(element.find('svg').attr('width')).toBe('200');
		expect(element.find('svg').attr('height')).toBe('200');

		expect(element.find('circle').css('fill')).toBe('#eeeeee');
		expect(element.find('circle').attr('r')).toBe('50');
		expect(d3.select(element[0]).select('.percentage').text()).toBe('15%');
		expect(d3.select(element[0]).select('.label').text()).toBe('Progress');
		// have to get style in this way
		expect(d3.select(element[0]).select('.expected').attr('style')).toContain('fill: #7fff00');
		expect(d3.select(element[0]).select('.expected').attr('style')).toContain('opacity: 0.8');
		expect(d3.select(element[0]).select('.actual').attr('style')).toContain('fill: #ff0000');
		expect(d3.select(element[0]).select('.actual').attr('style')).toContain('opacity: 1');

		// should change to orange
		scope.actual = 0.4;
		element = $compile(element)(scope);
		scope.$digest();
		$timeout.flush();

		expect(d3.select(element[0]).select('.actual').attr('style')).toContain('fill: #ffa500');

		// should change to green
		scope.actual = 0.5;
		element = $compile(element)(scope);
		scope.$digest();
		$timeout.flush();

		expect(d3.select(element[0]).select('.actual').attr('style')).toContain('fill: #7fff00');
	}));
});