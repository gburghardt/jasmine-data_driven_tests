# Jasmine Data Driven Tests

This plugin for Jasmine 2.x allows you to easily create data driven tests.

Features include:

- Automatically creates a Suite for each data driven test, making it easy to run
  all variants of a test in the test runner.
- Automatically creates one spec for each variant of the test, making it easy to
  run a single variant of a test in the test runner.
- The dataset for the test is just a hard coded Array, making the data easy to
  create and maintain.
- One or more arguments can be passed to the test function
- Asynchronous Jasmine specs are supported
- The `this` variable works the same as it does for regular Jasmine specs
- The dataset is inspected before creating the tests to ensure your specs do not
  act wonky because you expect 3 arguments, but one of your variants only has 2.
- If the dataset is not well formed, informative errors are thrown to make
  fixing issues with writing data driven tests easier to debug.

## Acquiring Jasmine Data Driven Tests

There are two ways to get Jasmine Data Driven Tests:

### Using Bower

If you are using Bower to manage your JavaScript dependencies, just add this
repository to your `bower.json` file:

```javascript
{
    "devDependencies": {
        "jasmine": "~2.0",
        "jasmine-data_driven_tests": "~1.0"
    }
}
```

Then a quick `bower install` is all you need.

### Manual Installation

Just download the latest or clone this repository:

- Download: https://github.com/gburghardt/jasmine-data_driven_tests/archive/master.zip
- Clone: `git clone https://github.com/gburghardt/jasmine-data_driven_tests.git`

## Getting Started

Simply include `src/all.js` after the source files for Jasmine. Now, you have
two global functions available to you:

Data Driven Tests:

```javascript
all(description, dataset, callback);
using(description, dataset, callback);
```

Data Driven Tests, marked as pending:

```javascript
xall(description, dataset, callback);
xusing(description, dataset, callback);
```

### Data Driven Test Basics

Data Driven Tests have three basic components:

1. The description
2. The dataset, which is an array of arguments passed to the spec function
3. The spec function

A quick example:

```javascript
all("blank values are invalid",
    [
        "",
        null,
        undefined
    ],
    function(value) {
        expect(isEmpty(value)).toBe(true);
    }
);
```

The call to `all` above is equivalent to these native Jasmine method calls:

```javascript
describe("blank values are invalid", function() {

    it('blank values are invalid (Variant #0 <"">)', function() {
        expect(isEmpty("")).toBe(true);
    });

    it('blank values are invalid (Variant #1 <null>)', function() {
        expect(isEmpty(null)).toBe(true);
    });

    it('blank values are invalid (Variant #2 <undefined>)', function() {
        expect(isEmpty(undefined)).toBe(true);
    });

});
```

In the Jasmine test runner, you'll see the following output:

```
blank values are invalid

    blank values are invalid (Variant #0 <"">)
    blank values are invalid (Variant #1 <null>)
    blank values are invalid (Variant #2 <undefined>)
```

Since they are just regular `describe`'s and `it`'s, you can click on
__blank values are invalid__ to run every test case, or click on an individual
variant to just run that one case.

While the `all` method expands to the jasmine `it` method, the `using` method expands to the `describe` method.
The `using` method is used to create more complex data driven tests.

```javascript
using("customer object initialization",
    [
        "fred",
        "barney"
    ],
    function(name) {
        var customer;

        beforeEach(function() {
            customer = new Customer(name);
        });

        it('should have active status', function () {
            expect(customer.isActive).toBe(true);
        });

        it('should have upper case name', function () {
            expect(isUpperCase(customer.name)).toBe(true);
        });
    }
);
```

The call to `using` above is equivalent to these native Jasmine method calls:

```javascript
describe("customer object initialization", function() {

    describe('customer object initiation (Variant #0, <"fred">)', function() {
        var customer;

        beforeEach(function() {
            customer = new Customer("fred");
        });

        it('should have active status', function () {
            expect(customer.isActive).toBe(true);
        });

        it('should have upper case name', function () {
            expect(isUpperCase(customer.name)).toBe(true);
        });
    });

    describe('customer object initiation (Variant #1, <"barney">)', function() {
        var customer;

        beforeEach(function() {
            customer = new Customer("barney");
        });

        it('should have active status', function () {
            expect(customer.isActive).toBe(true);
        });

        it('should have upper case name', function () {
            expect(isUpperCase(customer.name)).toBe(true);
        });
    });

});
```

And for the icing on the cake? A `using` block can contain one or more `all`'s:

```javascript
using("numbers greater than zero",
    [
        1,
        2
    ],
    function(n`) {
        all("negative numbers are less",
            [
                -1,
                -2
            ],
            function(n2) {
                expect(n2 < n1).toBe(true);
            }
        );
    }
);
```

Intermingling `using` with `all` produces these native Jasmine calls:

```javascript
describe("numbers greater than zero", function() {

    describe("numbers greater than zero (Variant #0 <1>)", function() {

        describe("negative numbers are less", function() {
            it("negative numbers are less (Variant #0 <-1>)", function() {
                expect(-1 < 1).toBe(true);
            });

            it("negative numbers are less (Variant #1 <-2>)", function() {
                expect(-2 < 1).toBe(true);
            });
        });

    });

    describe("numbers greater than zero (Variant #1 <2>)", function() {

        describe("negative numbers are less", function() {
            it("negative numbers are less (Variant #0 <-1>)", function() {
                expect(-1 < 2).toBe(true);
            });

            it("negative numbers are less (Variant #1 <-2>)", function() {
                expect(-2 < 2).toBe(true);
            });
        });

    });

});
```

### Unlimited Numbers of Arguments

You can pass as many arguments to your spec function as you want:

```javascript
all("values are greater than 0",
    [
        [ 3, 1 ],
        [ 5, 2 ]
    ],
    function(a, b) {
        expect(a - b > 0).toBe(true);
    }
);
```

You'll see this in the test runner:

```
values are greater than 0

    values are greater than 0 (Variant #0 <3, 1>)
    values are greater than 0 (Variant #1 <5, 2>)
```

The same holds true for the `using` function as well.

### Support for Asynchronous Specs

Asynchronous specs are also supported as long as your callback function accepts
one more argument than your dataset provides.

In the following example, the dataset provides two arguments, and the callback
function accepts three. The third argument is the `done` callback in Jasmine,
which when called will complete the current spec and advance the test runner to
the next one.

```javascript
all("values are greater than 5",
    [
        [ 3, 1 ],
        [ 5, 2 ]
    ],
    function(a, b, done) {
        setTimeout(function() {
            expect(a - b > 0).toBe(true);
            done();
        }, 50);
    }
);
```

The `all` and `xall` functions are really just wrappers for `describe`, `it`,
and `xit`. Data Driven Specs are supported anywhere Jasmine is supported.

### Using `this` In Your Data Driven Tests

You can use the `this` keyword in your data driven tests just like you can with
regular `it` specs:

```javascript
beforeEach(function() {
    this.a = 5;
});

all("references to 'this' work",
    [ 1, 2, 3 ],
    function(b) {
        expect(this.a - b > 0).toBe(true);
    }
);
```

## When To Use Data Driven Tests

You can really clean up your repetitive specs, but you should follow some
guidelines to ensure accurate and readable tests.

- Expectations should be the same for each variant. Logic changing expectations
  should be avoided.
- Only the input to your test cases change. The expected output does not.
- The numbers of arguments passed to the spec function should be the same for
  each variant of the test.
- Try to use primative data types in all of your dataset arguments. If you need
  to use Objects or Array's consider breaking your test cases down even further
  so that you can use primative data types, though this is not a steadfast rule.
- Avoid custom logic when creating the dataset. Just simple, hard coded values
  will work best and avoid [Code Smells](http://www.codinghorror.com/blog/2006/05/code-smells.html).

## Feature Requests and Bug Reports

No further feature enhancements are planned, however suggestions are always
welcome. Just open a new [Issue on GitHub](issues) explaining the feature
request, and the use case for it.

Bug reports should also be managed at GitHub in the [Issue Tracker](issues) for
this repository.

[issues]: https://github.com/gburghardt/jasmine-data_driven_tests/issues
