module.exports = angular.module('double-progress.directive', [require('../d3/d3.service.js').name])
	.directive('doubleProgressArc', ['d3', '$window', '$log', function(d3, $window, $log){
		"use strict";
		return {
			restrict: 'AE',
			scope: {
				expected: '=',
				actual: '='
			},
			template: '<div class="center"><h1 class="percentage">{{actual * 100}}<span>%</span></h1><h2>Progress</h2></div>',
			link: function(scope, element, attrs) {
				var THRESHOLD = {
					RED: 0.5,
					ORANGE: 0.25
				};

				var COLOR = {
					RED: attrs.red || 'red',
					GREEN: attrs.green || '#78c000',
					ORANGE: attrs.orange || 'orange'
				};
				
				var rendered = false;

				function render() {
					d3.select(element[0]).select("svg").remove();

					var width = attrs.width || element.parent()[0].clientWidth || 300,
						τ = 2 * Math.PI,
						innerDifference = width / 30,
						outerDifference = width / 80,
						circleRadius = width / 4,
						defaultCornerRadius = 5,
						expectedArcInnerRadius = circleRadius + innerDifference,
						expectedArcOuterRadius = expectedArcInnerRadius + outerDifference,
						actualArcInnerRadius = expectedArcOuterRadius + outerDifference,
						actualArcOuterRadius = actualArcInnerRadius + innerDifference,
						defaultStartAngle = 0.0;

					var svg = d3.select(element[0]).append("svg")
					    .attr("width", width)
					    .attr("height", width)
					    .append("g")
					    .attr("transform", "translate(" + width / 2 + "," + width / 2 + ")");

					// create center circle
					svg.append("circle").attr("r", circleRadius);
					// create inner arc
					createArc(expectedArcInnerRadius, expectedArcOuterRadius, 'expected');
					// create outer arc
					createArc(actualArcInnerRadius, actualArcOuterRadius, 'actual');
					
					rendered = true;

					function createText(yOffset, text, className) {
						return svg.append("text")
							.attr("x", 0)
							.attr("y", yOffset)
							.attr("dy", ".35em")
							.attr("text-anchor", "middle")
							.attr("class", className)
							.text(function(){return text});
					}

					function createArc(innerRadius, outerRadius, className) {
						var arc = d3.svg.arc()
					    		.innerRadius(innerRadius)
					    		.outerRadius(outerRadius)
					    		.startAngle(defaultStartAngle);

						var path = svg.append("path")
					    	.datum({endAngle: 0})
					    	.attr("class", className)
					    	.attr("d", arc);

					    function arcTween(path, arc, endAngle) {
					    	if (endAngle === 0) return;

					    	var color = COLOR.GREEN;

							if (className === 'actual' && scope.actual < scope.expected) {
								var diff = scope.expected - scope.actual;
								if (scope.expected === 0) {
									color = COLOR.GREEN;
								} else if ((diff / scope.expected) < THRESHOLD.RED && (diff / scope.expected) >= THRESHOLD.ORANGE) {
									color = COLOR.ORANGE;
								} else if ((diff / scope.expected) >= THRESHOLD.RED) {
									color = COLOR.RED;
								}
							}

					    	path
					    		.transition()
					    		.duration(750)
					    		.style('fill', color)
					    		.attrTween("d", function(d) {
					    			var interpolate = d3.interpolate(d.endAngle, endAngle);
							    	return function(t) {
							      		d.endAngle = interpolate(t);
							      		return arc(d);
							    	};
					    		})
					    	if (endAngle !== τ) arc.cornerRadius(defaultCornerRadius);
					    }

					    // validate scope data
						function validateAndFormatInput(name) {
							function logError() {
								$log.error('Invalid Progress Data[' + name + ']');
								return false;
							}

							if (!scope[name]) return logError();

							if (typeof(scope[name]) === 'string') {
								try {
									scope[name] = parseFloat(scope[name]);
								} catch (e) {
									return logError();
								}
							}

							// format input
							scope[name] = parseFloat(scope[name].toFixed(2));

							if (name === 'expected') {
								if (scope[name] > 0 && scope[name] <= 1) return true;
							} else if (name === 'actual') {
								if (scope[name] >= 0 && scope[name] <= 1) return true;
							}
							return logError();
						}

					    if (validateAndFormatInput(className)) {
				    		arcTween(path, arc, scope[className] * τ);
				    	}

				    	if (!rendered) {
				    		// only register watch once
						    scope.$watch(className, function(newVal, oldVal) {
						    	if (newVal !== oldVal && validateAndFormatInput(className)) {
						    		arcTween(path, arc, newVal * τ);
						    	}
						    });
						}
					}
				}

				render();

				angular.element($window).bind('resize', render);
				
				element.on('$destroy', function() {
					angular.element($window).unbind('resize', render);
			    });
		}
	}
}]);