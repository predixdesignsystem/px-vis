document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-register does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-register emptyRegister has default config', function() {
    var emptyRegister = document.getElementById('emptyRegister');

    test('emptyRegister fixture is created', function() {
      assert.isTrue(emptyRegister !== null);
    });

    test('emptyRegister has default properties', function() {
      assert.equal(emptyRegister.type, 'vertical');
      assert.equal(Polymer.dom(emptyRegister.root).querySelector('#dateTime').textContent.trim(), '');
    });

    test('emptyRegister has no series', function() {
      assert.isTrue(Polymer.dom(emptyRegister.root).querySelector('.series') === null);
    });
  });

  basicTests('verticalSeries','vertical');
  basicTests('horizontalSeries','horizontal');

  suite('px-vis-register passing in a muteSeries applies muted class to the series', function() {
    var doesItMute = document.getElementById('doesItMute');
    var data;
    setup(function(done) {
      data = generateDataValues( generateEmptyData(5) );
      setData(doesItMute, data);
      setMutedSeries(doesItMute, data.series[1].name, done);
    });

    test('doesItMute fixture is created', function() {
      assert.isTrue(doesItMute !== null);
    });

    test('doesItMute series has muted class', function() {
      var ms = doesItMute.mutedSeries;
      var series = Polymer.dom(doesItMute.root).querySelectorAll('.series');

      assert.isTrue(ms[data.series[1].name]);
      assert.isTrue(series[1].classList.contains('muted'));
    });

  });

  suite('px-vis-register truncates names correctly', function() {
    var truncate = document.getElementById('truncate'),
        truncateShort = document.getElementById('truncateShort'),
        noTruncate = document.getElementById('noTruncate');

    setup(function(done) {
      var str = 'this_is_a_long_name';
      var data = generateDataValues( generateEmptyData(2,str) );
      truncateShort.set('truncationLength',5)
      setData(truncate, data);
      setData(truncateShort, data);
      setData(noTruncate, data, done);
    });

    test('truncate fixtures are created', function() {
      assert.isTrue(truncate !== null);
      assert.isTrue(truncateShort !== null);
      assert.isTrue(noTruncate !== null);
    });

    test('truncate is correct', function() {
      var series = Polymer.dom(truncate.root).querySelectorAll('.seriesName');

      assert.equal(series[0].textContent,'this_...name0');
      assert.equal(series[1].textContent,'this_...name1');
    });

    test('truncateShort is correct', function() {
      var series = Polymer.dom(truncateShort.root).querySelectorAll('.seriesName');

      assert.equal(series[0].textContent,'thi...e0');
      assert.equal(series[1].textContent,'thi...e1');
    });

    test('noTruncate is correct', function() {
      var series = Polymer.dom(noTruncate.root).querySelectorAll('.seriesName');

      assert.equal(series[0].textContent,'this_is_a_long_name0');
      assert.equal(series[1].textContent,'this_is_a_long_name1');
    });
  });
}

function basicTests(registerID,dir){
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
      assert.equal(register.type, dir);
      assert.equal(Polymer.dom(register.root).querySelector('#dateTime').textContent.trim(), '');
    });

    test(registerID + ' has 5 series', function() {
      assert.equal(Polymer.dom(register.root).querySelectorAll('.series').length, 5);
    });

    test(registerID + ' names match', function() {
      var series = Polymer.dom(register.root).querySelectorAll('.seriesName');
      for(var i = 0; i < series.length; i++){
        assert.equal(series[i].textContent, data.series[i]['name']);
      }
    });

    test(registerID + ' colors are correct', function() {
      var colorOrder = commonColors.properties.seriesColorOrder.value;
      var colorSet = commonColors.properties.dataVisColors.value;
      var series = Polymer.dom(register.root).querySelectorAll('.seriesMarker');
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
      assert.equal(Polymer.dom(register.root).querySelectorAll('.series').length, 5);
    });

    test(registerID + ' shows time', function() {
      var displayTime = Polymer.dom(register.root).querySelector('#dateTime').textContent.trim();
      assert.equal(displayTime, '12:37:47 -0800 | 20 Dec 2014');
    });

    test(registerID + ' still names match', function() {
      var series = Polymer.dom(register.root).querySelectorAll('.seriesName');
      for(var i = 0; i < series.length; i++){
        assert.equal(series[i].textContent, data.series[i]['name']);
      }
    });

    test(registerID + ' values match', function() {
      var series = Polymer.dom(register.root).querySelectorAll('.seriesData');
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
      assert.equal(Polymer.dom(register.root).querySelectorAll('.series').length, 5);
    });

    test(registerID + ' does not show time', function() {
      var displayTime = Polymer.dom(register.root).querySelector('#dateTime').textContent.trim();
      assert.equal(displayTime, '');
    });

    test(registerID + ' still names match', function() {
      var series = Polymer.dom(register.root).querySelectorAll('.seriesName');
      for(var i = 0; i < series.length; i++){
        assert.equal(series[i].textContent, data.series[i]['name']);
      }
    });

    test(registerID + ' values are blank', function() {
      var series = Polymer.dom(register.root).querySelectorAll('.seriesData');
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
      series = Polymer.dom(register.root).querySelectorAll('.series')[1];
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

function generateEmptyData(num,str){
  var str = str || 'series_';
  var dataObj = {
    'time': null,
    'series': []
  };
  for(var i = 0; i < num; i++){
    var name = str + i;
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
    if(done){ done(); }
  },10);
}

function setMutedSeries(series, name, done){
  series.set('mutedSeries', {});
  series.set('mutedSeries.' + name, true);

  // pause and let the dom repeate chug away
  setTimeout(function(){
    if(done){ done(); }
  },10);
}
