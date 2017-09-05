document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-behavior-chart does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('dataExtents generated properly without commonAxis', function() {
    var scale = document.getElementById('scale');


    suiteSetup(function() {

      var dimensions = ['axis1', 'axis2', 'axis3', 'axis4'],
          chartData = [ {axis1: 1, axis2: 6, axis3: 11, axis4: 16},
                    {axis1: 2, axis2: 7, axis3: 12, axis4: 17},
                    {axis1: 3, axis2: 8, axis3: 13, axis4: 18},
                    {axis1: 4, axis2: 9, axis3: 14, axis4: 19},
                    {axis1: 5, axis2: 10, axis3: 15, axis4: 20}],
          chartExtents = {axis1: ['dynamic', 'dynamic'], axis2: ['dynamic', 20], axis3: [0, 'dynamic']};

      scale.set('chartData', chartData);
      scale.set('dimensions', dimensions);
      scale.set('chartExtents', chartExtents);
      scale.set('commonAxis', false);

      //fake a call from an external observer
      scale._generateDataExtents();
    });

    test('dataExtents for dynamic/dynamic', function() {
      assert.equal(scale.dataExtents.y['axis1'][0], 1);
      assert.equal(scale.dataExtents.y['axis1'][1], 5);
    });

    test('dataExtents for dynamic/set', function() {
      assert.equal(scale.dataExtents.y['axis2'][0], 6);
      assert.equal(scale.dataExtents.y['axis2'][1], 20);
    });

    test('dataExtents for set/dynamic', function() {
      assert.equal(scale.dataExtents.y['axis3'][0], 0);
      assert.equal(scale.dataExtents.y['axis3'][1], 15);
    });

    test('dataExtents for missing dimension', function() {
      assert.equal(scale.dataExtents.y['axis4'][0], 16);
      assert.equal(scale.dataExtents.y['axis4'][1], 20);
    });
  });

  suite('dataExtents generated properly with commonAxis', function() {
    var scale = document.getElementById('scale');


    suiteSetup(function() {

      var dimensions = ['axis1', 'axis2', 'axis3', 'axis4'],
          chartData = [ {axis1: 1, axis2: 6, axis3: 11, axis4: 16},
                    {axis1: 2, axis2: 7, axis3: 12, axis4: 17},
                    {axis1: 3, axis2: 8, axis3: 13, axis4: 18},
                    {axis1: 4, axis2: 9, axis3: 14, axis4: 19},
                    {axis1: 5, axis2: 10, axis3: 15, axis4: 20}],
          chartExtents = {axis1: ['dynamic', 'dynamic'], axis2: ['dynamic', 20], axis3: [5, 'dynamic']};

      scale.set('chartData', chartData);
      scale.set('dimensions', dimensions);
      scale.set('chartExtents', chartExtents);
      scale.set('commonAxis', true);

      //fake a call from an external observer
      scale._generateDataExtents();
    });

    test('dataExtents for dynamic/dynamic', function() {
      assert.equal(scale.dataExtents.y['axis1'][0], 1);
      assert.equal(scale.dataExtents.y['axis1'][1], 20);
    });

    test('dataExtents for dynamic/set', function() {
      assert.equal(scale.dataExtents.y['axis2'][0], 1);
      assert.equal(scale.dataExtents.y['axis2'][1], 20);
    });

    test('dataExtents for set/dynamic', function() {
      assert.equal(scale.dataExtents.y['axis3'][0], 1);
      assert.equal(scale.dataExtents.y['axis3'][1], 20);
    });

    test('dataExtents for missing dimension', function() {
      assert.equal(scale.dataExtents.y['axis4'][0], 1);
      assert.equal(scale.dataExtents.y['axis4'][1], 20);
    });
  });

  suite('dataExtents generated properly with commonAxis', function() {
    var scale = document.getElementById('scale');


    suiteSetup(function() {

      var dimensions = ['axis1', 'axis2', 'axis3', 'axis4'],
          chartData = [ {axis1: -1, axis2: 6, axis3: 11, axis4: 16},
                    {axis1: 2, axis2: 7, axis3: 12, axis4: 17},
                    {axis1: 3, axis2: 8, axis3: 33, axis4: 18},
                    {axis1: 4, axis2: 9, axis3: 14, axis4: 19},
                    {axis1: 5, axis2: 10, axis3: 15, axis4: 20}],
          chartExtents = {axis1: ['dynamic', 'dynamic'], axis2: ['dynamic', 20], axis3: [0, 'dynamic']};

      scale.set('chartData', chartData);
      scale.set('dimensions', dimensions);
      scale.set('chartExtents', chartExtents);
      scale.set('commonAxis', true);

      //fake a call from an external observer
      scale._generateDataExtents();
    });

    test('dataExtents for dynamic/dynamic', function() {
      assert.equal(scale.dataExtents.y['axis1'][0], -1);
      assert.equal(scale.dataExtents.y['axis1'][1], 33);
    });

    test('dataExtents for dynamic/set', function() {
      assert.equal(scale.dataExtents.y['axis2'][0], -1);
      assert.equal(scale.dataExtents.y['axis2'][1], 33);
    });

    test('dataExtents for set/dynamic', function() {
      assert.equal(scale.dataExtents.y['axis3'][0], -1);
      assert.equal(scale.dataExtents.y['axis3'][1], 33);
    });

    test('dataExtents for missing dimension', function() {
      assert.equal(scale.dataExtents.y['axis4'][0], -1);
      assert.equal(scale.dataExtents.y['axis4'][1], 33);
    });
  });
}
