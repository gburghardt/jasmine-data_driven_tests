describe("all", function() {

	it("returns a suite", function() {
		var suite = all("just testing", [1,2], function(x) {});

		expect(suite instanceof jasmine.Suite).toBe(true);
		expect(suite.description).toBe("just testing");
		expect(suite.children.length).toBe(2);
	});

	function isEmpty(x) {
		if (x === null || x === undefined || x === "" || x === NaN || x === false)
			return true;

		var type = typeof(x);

		if (type === "number" && (isNaN(x) || x <= 0))
			return true;
		else if (type === "object")
			if (Object.prototype.toString.call(x) === "[object Array]")
				return x.length === 0;
			else {
				for (var key in x)
					if (x.hasOwnProperty(key))
						return false;

				return true;
			}

		return false;
	}

	all("Blank values are empty, for example",
		[
			"",
			null,
			undefined,
			0,
			-1,
			[[]],
			NaN,
			{}
		],
		function(x) {
			expect(isEmpty(x)).toBe(true);
		}
	);

	all("Complex arguments are supported",
		[
			{ name: "Aaa" },
			{ name: "Zab"},
			{ name: "Koala" }
		],
		function(a) {
			expect(a.name.length > 10).toBe(false);
		}
	);

	all("Asynchronous specs are supported",
		[
			1,
			2,
			3,
			4,
			5,
			6,
			7
		],
		function(x, done) {
			setTimeout(function() {
				expect(x > 10).toBe(false);
				done();
			}, 50);
		}
	);

	all("Multiple arguments are supported",
		[
			[ 2, 4 ],
			[ 1, 8 ],
			[ 4, 4 ]
		],
		function(x, y) {
			expect(x + y > 10).toBe(false);
		}
	);

	all("Asynchronous, multiple arguments are supported",
		[
			[ 2, 4 ],
			[ 1, 8 ],
			[ 4, 4 ]
		],
		function(x, y, done) {
			setTimeout(function() {
				expect(x + y > 10).toBe(false);
				done();
			}, 50);
		}
	);

	xall("These are pending",
		[
			1,
			2,
			3,
			4
		],
		function(x) {
			expect(x > 10).toBe(true);
		}
	);
});

describe("error handling", function() {

	describe("datasets", function() {

		it("must contain the same number of arguments", function() {
			var error = new Error("Expected 2 argument(s). Found 1 at index 1 (bad dataset)");
			error.name = "Jasmine.ArgumentCountMismatchError";

			expect(function() {
				all("bad dataset",
					[
						[1, 2],
						[1   ]
					],
					function(a, b) {
						throw new Error("This shouldn't execute");
					});
			}).toThrow(error);
		});

		it("must be an array", function() {
			var error = new Error("No arguments for a data-driven test were provided (bad dataset)");
			error.name = "Jasmine.ArgumentsMissingError";

			expect(function() {
				all("bad dataset", {}, function () {});
			}).toThrow(error);
		});

	});

	describe("spec callback functions", function() {

		it("must not contain more than n + 1 arguments", function() {
			var error = new Error("Expecting data driven spec to accept 2 arguments, but 4 arguments are specified in the callback function (bad dataset)");
			error.name = "Jasmine.ArgumentCountMismatchError";

			expect(function() {
				all("bad dataset", [ [1,2], [3,6] ], 	function(a, b, c, d) {});
			}).toThrow(error);
		});

	});

});
