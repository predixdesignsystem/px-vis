document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-worker exist?', function() {
    test('worker exists', function() {
      assert.deepEqual(dataMapping, {});
    });
  });

  suite('px-vis-worker setup', function() {

    suiteSetup(function(){
      var w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };


    });

    test('baseZoom fixture is created', function() {
      assert.isTrue(baseZoom !== null);
    });
  }); //suite
} //runTests
