describe("using", function() {

	function Point(x, y) {
		this.x = x;
		this.y = y;
	}

	Point.prototype.isAbove = function(point) {
		return this.y > point.y;
	};

	Point.prototype.isBelow = function(point) {
		return this.y < point.y;
	};

	it("returns a suite", function() {
		var suite = using("just testing", [1,2], function(x) {});

		expect(suite instanceof jasmine.Suite).toBe(true);
		expect(suite.description).toBe("just testing");
		expect(suite.children.length).toBe(2);
	});

	using("Complex arguments",
		[
			{ name: "Aaa" },
			{ name: "Zab"},
			{ name: "Koala" }
		],
		function(data) {
			it("are supported", function() {
				expect(data.name.toLowerCase()).not.toBe(data.name);
			});
		}
	);

	using("Arrays as arguments",
		[
			[1, 2, 4, 5],
			[6, 7, 8, 9]
		],
		function(x1, y1, x2, y2) {
			var p1, p2;

			beforeEach(function() {
				p1 = new Point(x1, y1);
				p2 = new Point(x2, y2);
			});

			it("p2 is above p1", function() {
				expect(p2.isAbove(p1)).toBe(true);
			});

			it("p1 is below p2", function() {
				expect(p1.isBelow(p2)).toBe(true);
			});
		}
	);

	using("using supported",
		[
			1,
			2,
			3,
			4
		],
		function (value) {
			var x;

			beforeEach(function () {
				x = value;
			});

			it("Should be true", function () {
				expect(x < 10).toBe(true);
			});
		}
	);

	using("using, it and all can be intermingled",
		[
			[1, 2],
			[3, 4]
		],
		function(x1, y1) {

			var p1;

			beforeEach(function() {
				p1 = new Point(x1, y1);
			});

			it("is not above itself", function() {
				expect(p1.isAbove(p1)).toBe(false);
			});

			it("is not below itself", function() {
				expect(p1.isBelow(p1)).toBe(false);
			});

			it("is not below itself (asynchronously)", function(done) {
				setTimeout(function() {
					expect(p1.isBelow(p1)).toBe(false);
					done();
				}, 200);
			});

			all("p2 points are above p1 points",
				[
					[5, 6],
					[7, 8]
				],
				function(x2, y2) {
					var p2 = new Point(x2, y2);

					expect(p2.isAbove(p1)).toBe(true);
				}
			);

			all("p2 points are above p1 points (asynchronously)",
				[
					[5, 6],
					[7, 8]
				],
				function(x2, y2, done) {
					var p2 = new Point(x2, y2);

					setTimeout(function() {
						expect(p2.isAbove(p1)).toBe(true);
						done();
					}, 200);
				}
			);
		}
	);

	xusing("xusing supported",
		[
			1,
			2,
			3,
			4
		],
		function (value) {
			var x;

			beforeEach(function () {
				x = value;
			});

			it("Should not be called", function () {
				expect(x < 10).toBe(false);
			});
		}
	);

	describe("using doesn't allow callback functions", function() {

		it("must not contain more than n arguments", function() {
			var error = new Error("Expecting data driven spec to accept 2 arguments, but 3 arguments are specified in the callback function (bad dataset)");
			error.name = "Jasmine.ArgumentCountMismatchError";

			expect(function() {
				using("bad dataset", [ [1,2], [3,6] ], 	function(a, b, c) {});
			}).toThrow(error);
		});

	});

});
