var emptyRegister,
    verticalSeries;

document.addEventListener("WebComponentsReady", function() {
  emptyRegister = document.getElementById('emptyRegister');
  runTests();
});

function runTests(){
  suite('px-vis-register base test', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-register emptyRegister', function() {
    test('emptyRegister fixture is created', function() {
      assert.isTrue(emptyRegister !== null);
    });

    test('emptyRegister has default properties', function() {
      assert.equal(emptyRegister.type, 'vertical');
      assert.equal(emptyRegister.querySelector('#dateTime').textContent.trim(), '');
    });

    test('emptyRegister has no series', function() {
      assert.isTrue(emptyRegister.querySelector('.series') === null);
    });
  });

  basicTests('verticalSeries');
  basicTests('horizontalSeries');


}

function basicTests(registerID){
  var register = document.getElementById(registerID);

  suite('px-vis-register ' + registerID + ' with 5 series -- simulating basic creation', function() {
    var data;
    setup(function(done) {
      data = generateEmptyData(5);
      setData(register, data, done);
    });

    test(registerID + ' fixture is created', function() {
      assert.isTrue(register !== null);
    });

    test(registerID + ' has default properties', function() {
      assert.equal(register.type, 'vertical');
      assert.equal(register.querySelector('#dateTime').textContent.trim(), '');
    });

    test(registerID + ' has 5 series', function() {
      assert.equal(register.querySelectorAll('.series').length, 5);
    });

    test(registerID + ' names match', function() {
      var series = register.querySelectorAll('.seriesName');
      for(var i = 0; i < series.length; i++){
        assert.equal(series[i].textContent, data.series[i]['name']);
      }
    });

    test(registerID + ' colors are correct', function() {
      var colorOrder = commonColors.properties.seriesColorOrder.value;
      var colorSet = commonColors.properties.dataVisColors.value;
      var series = register.querySelectorAll('.seriesMarker');
      for(var i = 0; i < series.length; i++){
        assert.equal(series[i].getAttribute('style'), 'background-color:' + colorSet[ colorOrder[i] ] + ';');
      }
    });

  });

  suite('px-vis-register ' + registerID + ' update data on series  -- simulating on-chart-hover', function() {
    var data;
    setup(function(done) {
      data = generateDataValues( generateEmptyData(5) );
      setData(register, data, done);
    });

    test(registerID + ' still has 5 series', function() {
      assert.equal(register.querySelectorAll('.series').length, 5);
    });

    test(registerID + ' shows time', function() {
      var displayTime = register.querySelector('#dateTime').textContent.trim();
      assert.equal(displayTime, '12:37:47 -0800 | 20 Dec 2014');
    });

    test(registerID + ' still names match', function() {
      var series = register.querySelectorAll('.seriesName');
      for(var i = 0; i < series.length; i++){
        assert.equal(series[i].textContent, data.series[i]['name']);
      }
    });

    test(registerID + ' values match', function() {
      var series = register.querySelectorAll('.seriesData');
      for(var i = 0; i < series.length; i++){
        assert.equal(series[i].textContent, data.series[i]['value']);
      }
    });
  });

  suite('px-vis-register ' + registerID + ' remove data -- simulating off-chart-hover', function() {
    var data;
    setup(function(done) {
      data = generateEmptyData(5);
      setData(register, data, done);
    });

    test(registerID + ' still has 5 series', function() {
      assert.equal(register.querySelectorAll('.series').length, 5);
    });

    test(registerID + ' does not show time', function() {
      var displayTime = register.querySelector('#dateTime').textContent.trim();
      assert.equal(displayTime, '');
    });

    test(registerID + ' still names match', function() {
      var series = register.querySelectorAll('.seriesName');
      for(var i = 0; i < series.length; i++){
        assert.equal(series[i].textContent, data.series[i]['name']);
      }
    });

    test(registerID + ' values are blank', function() {
      var series = register.querySelectorAll('.seriesData');
      for(var i = 0; i < series.length; i++){
        assert.equal(series[i].textContent, '');
      }
    });
  });

  suite('px-vis-register ' + registerID + ' clicking on series', function() {
    var data,
        series,
        seriesName;
    setup(function(done) {
      data = generateEmptyData(5);
      setData(register, data, done);
    });

    test(registerID + ' series added to mutedSeries', function() {
      series = register.querySelectorAll('.series')[1];
      seriesName = series.querySelector('.seriesName');
      seriesName.click();

      var ms = Object.getOwnPropertyNames(register.mutedSeries);
      assert.equal(ms.length, 1);
      assert.equal(ms[0], seriesName.getAttribute('name'));
      assert.equal(ms[0], data.series[1]['name']);
      assert.equal(register.mutedSeries[ms[0]], true);
      assert.isTrue(series.classList.contains('muted'));
    });

    test(registerID + ' mutedSeries change to false', function() {
      seriesName.click();

      var ms = Object.getOwnPropertyNames(register.mutedSeries);
      assert.equal(ms.length, 1);
      assert.equal(ms[0], seriesName.getAttribute('name'));
      assert.equal(ms[0], data.series[1]['name']);
      assert.equal(register.mutedSeries[ms[0]], false);
      assert.isTrue(!series.classList.contains('muted'));
    });

    test(registerID + ' mutedSeries change back to true', function() {
      seriesName.click();

      var ms = Object.getOwnPropertyNames(register.mutedSeries);
      assert.equal(ms.length, 1);
      assert.equal(ms[0], seriesName.getAttribute('name'));
      assert.equal(ms[0], data.series[1]['name']);
      assert.equal(register.mutedSeries[ms[0]], true);
      assert.isTrue(series.classList.contains('muted'));
    });
  });

}

function generateEmptyData(num){
  var dataObj = {
    'time': null,
    'series': []
  };
  for(var i = 0; i < num; i++){
    var name = "series_" + i;
    dataObj.series.push({'name':name,'value': null });
  }

  return dataObj;
}

function generateDataValues(data){
  data.time = new Date('Sat Dec 20 2014 00:37:47 GMT-0800 (PST)');

  for(var i = 0; i < data.series.length; i++){
    data.series[i]['value'] = 15.2;
  }
  return data;
}

function setData(series, data, done){
  series.set('tooltipData',{});
  series.set('tooltipData',data);

  // pause and let the dom repeate chug away
  setTimeout(function(){
    done();
  },10);
}
