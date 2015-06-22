module.exports = angular.module('double-progress.directive', [require('../d3/d3.service.js').name])
	.directive('doubleProgressArc', ['d3', '$window', '$timeout', function(d3, $window, $timeout){
		"use strict";
		return {
			restrict: 'AE',
			scope: {
				expected: '=',
				actual: '='
			},
			link: function(scope, element, attrs) {
				var THRESHOLD = {
					RED: 0.5,
					ORANGE: 0.25
				};

				var COLOR = {
					RED: attrs.red || 'red',
					GREEN: attrs.green || 'chartreuse',
					ORANGE: attrs.orange || 'orange'
				};

				function render() {
					d3.select(element[0]).select("svg").remove();

					var width = element.parent()[0].clientWidth || attrs.width || 300,
						τ = 2 * Math.PI,
						innerDifference = width / 30,
						outerDifference = width / 80,
						circleRadius = width / 4,
						defaultCornerRadius = 5,
						expectedArcInnerRadius = circleRadius + innerDifference,
						expectedArcOuterRadius = expectedArcInnerRadius + outerDifference,
						actualArcInnerRadius = expectedArcOuterRadius + outerDifference,
						actualArcOuterRadius = actualArcInnerRadius + innerDifference,
						defaultStartAngle = 0.0,
						textOffset = width / 20;


					var svg = d3.select(element[0]).append("svg")
					    .attr("width", width)
					    .attr("height", width)
					    .append("g")
					    .attr("transform", "translate(" + width / 2 + "," + width / 2 + ")")

				
					var center = svg.append("circle")
							.attr("r", circleRadius)
					    	.style("fill", "#eeeeee");

					var percentage = createText(-textOffset, scope.actual * 100, 'percentage');
					percentage.append("tspan").text('%');
					createText(textOffset, 'Progress', 'label');

					center.attr("r", circleRadius);

					createArc(expectedArcInnerRadius, 
						expectedArcOuterRadius,
						τ * scope.expected,
						'chartreuse',
						0.8);

					var actualColor = 'chartreuse';

					if (scope.actual < scope.expected) {
						var diff = scope.expected - scope.actual;
						if ((diff / scope.expected) < THRESHOLD.RED && (diff / scope.expected) >= THRESHOLD.ORANGE) {
							actualColor = 'orange';
						} else if ((diff / scope.expected) >= THRESHOLD.RED) {
							actualColor = 'red';
						}
					}

					createArc(actualArcInnerRadius, 
						actualArcOuterRadius, 
						τ * scope.actual,
						actualColor,
						1.0);
				

					function createText(yOffset, text, className) {
						return svg.append("text")
							.attr("x", 0)
							.attr("y", yOffset)
							.attr("dy", ".35em")
							.attr("text-anchor", "middle")
							.attr("class", className)
							.text(function(){return text})

					}

					function createArc(innerRadius, outerRadius, endAngle, color, opacity) {
						if (endAngle === 0) return;
						var arc = d3.svg.arc()
					    		.innerRadius(innerRadius)
					    		.outerRadius(outerRadius)
					    		.startAngle(defaultStartAngle);

						svg.append("path")
					    	.datum({endAngle: 0})
					    	.style("fill", color)
					    	.style("opacity", opacity)
					    	.attr("d", arc)
					    	.transition()
					    	.duration(1000)
					    	.attrTween("d", function(d) {
					    		var interpolate = d3.interpolate(d.endAngle, endAngle);
							    return function(t) {
							      	d.endAngle = interpolate(t);
							      	return arc(d);
							    };
					    	});
					    if (endAngle !== τ) arc.cornerRadius(defaultCornerRadius);
					}
				}

				// validate scope data
				if (0.0 <= scope.expected && 1.0 >= scope.expected && 0.0 <= scope.actual && 1.0 >= scope.actual) { 
					$timeout(render);
					angular.element($window).bind('resize', render);
				}
		}
	}
}]);