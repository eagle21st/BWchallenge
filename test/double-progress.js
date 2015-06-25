describe('Directive: double-progress', function() {
	var element, $compile, $rootScope;

	beforeEach(module('double-progress.directive'));

	beforeEach(inject(function(_$compile_, _$rootScope_){
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));

	element = angular.element('<double-progress-arc data-width="200" expected="expected" actual="actual" />');

	it('Should log error when expected is missing or not in range', inject(function($log) {
		var scope = $rootScope.$new();
		scope.actual = 0.5;
		$compile(element)(scope);
		scope.$digest();
		expect($log.error.logs[0][0]).toBe('Invalid Progress Data[expected]');

		scope.expected = -0.1;
		scope.$digest();
		expect($log.error.logs[1][0]).toBe('Invalid Progress Data[expected]');

		scope.expected = 1.1;
		scope.$digest();
		expect($log.error.logs[2][0]).toBe('Invalid Progress Data[expected]');

		scope.expected = 'RandomStuff';
		scope.$digest();
		expect($log.error.logs[3][0]).toBe('Invalid Progress Data[expected]');

		scope.expected = NaN;
		scope.$digest();
		expect($log.error.logs[4][0]).toBe('Invalid Progress Data[expected]');

		scope.expected = null;
		scope.$digest();
		expect($log.error.logs[5][0]).toBe('Invalid Progress Data[expected]');

		scope.expected = {};
		scope.$digest();
		expect($log.error.logs[6][0]).toBe('Invalid Progress Data[expected]');
	}));

	it('Should log error when actual is missing or not in range', inject(function($log) {
		var scope = $rootScope.$new();
		scope.expected = 0.5;
		$compile(element)(scope);
		scope.$digest();
		expect($log.error.logs[0][0]).toBe('Invalid Progress Data[actual]');

		scope.actual = -0.1;
		scope.$digest();
		expect($log.error.logs[1][0]).toBe('Invalid Progress Data[actual]');

		scope.actual = 1.1;
		scope.$digest();
		expect($log.error.logs[2][0]).toBe('Invalid Progress Data[actual]');

		scope.actual = 'RandomStuff';
		scope.$digest();
		expect($log.error.logs[3][0]).toBe('Invalid Progress Data[actual]');

		scope.actual = NaN;
		scope.$digest();
		expect($log.error.logs[4][0]).toBe('Invalid Progress Data[actual]');

		scope.actual = null;
		scope.$digest();
		expect($log.error.logs[5][0]).toBe('Invalid Progress Data[actual]');

		scope.actual = {};
		scope.$digest();
		expect($log.error.logs[6][0]).toBe('Invalid Progress Data[actual]');
	}));


	it('Should draw widget with basic properties', function() {
		var scope = $rootScope.$new();
		scope.expected = 0.598;
		scope.actual = 0.15;
		element = $compile(element)(scope);
		scope.$digest();
		
		expect(element.isolateScope().expected).toBe(0.598);
		expect(element.isolateScope().actual).toBe(0.15);
		

		expect(element.find('svg').attr('width')).toBe('200');
		expect(element.find('svg').attr('height')).toBe('200');

		expect(element.find('circle').attr('r')).toBe('50');
		expect(element.find('h1').text()).toBe('15%');
		expect(element.find('h2').text()).toBe('Progress');
		// have to get style in this way
		function flushAllD3Transitions() {
		    var now = Date.now;
		    Date.now = function() { return Infinity; };
		    d3.timer.flush();
		    Date.now = now;
		}
		flushAllD3Transitions();
		expect(d3.select(element[0]).select('path.expected')[0][0].__data__.endAngle).toBe(scope.expected * 2 * Math.PI);
		expect(d3.select(element[0]).select('path.expected').attr('style')).toContain('fill: #78c000;');
		expect(d3.select(element[0]).select('path.actual')[0][0].__data__.endAngle).toBe(scope.actual * 2 * Math.PI);
		// should be red
		expect(d3.select(element[0]).select('path.actual').attr('style')).toContain('fill: #ff0000;');
		
		// update
		scope.expected = 0.8;
		scope.actual = 0.6;
		scope.$digest();

		flushAllD3Transitions();
		expect(d3.select(element[0]).select('path.expected')[0][0].__data__.endAngle).toBe(scope.expected * 2 * Math.PI);
		expect(d3.select(element[0]).select('path.expected').attr('style')).toContain('fill: #78c000;');
		expect(d3.select(element[0]).select('path.actual')[0][0].__data__.endAngle).toBe(scope.actual * 2 * Math.PI);
		// should be orange
		expect(d3.select(element[0]).select('path.actual').attr('style')).toContain('fill: #ffa500;');

		// update
		scope.expected = 0.8;
		scope.actual = 1.0;
		scope.$digest();

		flushAllD3Transitions();
		expect(d3.select(element[0]).select('path.expected')[0][0].__data__.endAngle).toBe(scope.expected * 2 * Math.PI);
		expect(d3.select(element[0]).select('path.expected').attr('style')).toContain('fill: #78c000;');
		expect(d3.select(element[0]).select('path.actual')[0][0].__data__.endAngle).toBe(scope.actual * 2 * Math.PI);
		// should be green
		expect(d3.select(element[0]).select('path.actual').attr('style')).toContain('fill: #78c000;');
	});
});