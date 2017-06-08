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



    });

    test('dummy', function() {

    });
  }); //suite
} //runTests
