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
      assert.isNull(Polymer.dom(emptyRegister.root).querySelector('#dateTime'));
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
    suiteSetup(function(done) {
      data = generateDataValues( generateEmptyData(5) );
      setData(doesItMute, data);
      setMutedSeries(doesItMute, data.data.series[1].name, done);
    });

    test('doesItMute fixture is created', function() {
      assert.isTrue(doesItMute !== null);
    });

    test('doesItMute series has muted class', function() {
      var ms = doesItMute.mutedSeries;
      var series = Polymer.dom(doesItMute.root).querySelectorAll('px-vis-register-item'),
          regWithoutMenu = series[1].querySelector('#regWithoutMenu');

      assert.isTrue(ms[data.data.series[1].name]);
      assert.isTrue(regWithoutMenu.classList.contains('muted'));
    });

  });

  suite('px-vis-register truncates names correctly', function() {
    var truncate = document.getElementById('truncate'),
        truncateShort = document.getElementById('truncateShort'),
        noTruncate = document.getElementById('noTruncate');

    suiteSetup(function(done) {
      var str = 'this_is_a_long_name';
      var data = generateDataValues( generateEmptyData(2,str) );
      // truncateShort.set('truncationLength',5)
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
      var series = Polymer.dom(truncate.root).querySelectorAll('px-vis-register-item');

      assert.equal(series[0].querySelector('.seriesName').firstChild.textContent.trim(),'this_...name0');
      assert.equal(series[1].querySelector('.seriesName').firstChild.textContent.trim(),'this_...name1');
    });

    test('truncateShort is correct', function() {
      var series = Polymer.dom(truncateShort.root).querySelectorAll('px-vis-register-item');

      assert.equal(series[0].querySelector('.seriesName').firstChild.textContent.trim(),'thi...e0');
      assert.equal(series[1].querySelector('.seriesName').firstChild.textContent.trim(),'thi...e1');
    });

    test('noTruncate is correct', function() {
      var series = Polymer.dom(noTruncate.root).querySelectorAll('px-vis-register-item');

      assert.equal(series[0].querySelector('.seriesName').firstChild.textContent.trim(),'this_is_a_long_name0');
      assert.equal(series[1].querySelector('.seriesName').firstChild.textContent.trim(),'this_is_a_long_name1');
    });

    test('tooltips are created (or not)', function() {
      var truncateSeries = Polymer.dom(truncate.root).querySelectorAll('px-vis-register-item');
      var truncateTT = truncateSeries[0].querySelector('.seriesName').querySelector('px-tooltip');

      var truncateShortSeries = Polymer.dom(truncateShort.root).querySelectorAll('px-vis-register-item');
      var truncateShortTT = truncateShortSeries[0].querySelector('.seriesName').querySelector('px-tooltip');

      var noTruncateSeries = Polymer.dom(noTruncate.root).querySelectorAll('px-vis-register-item');
      var noTruncateTT = noTruncateSeries[0].querySelector('.seriesName').querySelector('px-tooltip');

      assert.isTrue(truncateTT !== null);
      assert.isTrue(truncateShortTT !== null);
      assert.isTrue(noTruncateTT === null);
    });
  });

  suite('px-vis-register formats time correctly', function() {
    var datetimeFormat = document.getElementById('datetimeFormat');

    suiteSetup(function(done) {
      var data = generateDataValues( generateEmptyData(2) );
      setData(datetimeFormat, data,done);
    });

    test('datetimeFormat fixtures are created', function() {
      assert.isTrue(datetimeFormat !== null);
    });

    test('datetimeFormat is correct', function() {
      var series = Polymer.dom(datetimeFormat.root).querySelector('px-vis-register-datetime').querySelector('#dateTime');

      assert.equal(series.textContent.trim(),'December 20th, 2014 @ 8:37:47AM');
    });
  });

  suite('px-vis-register formats units', function() {
    var numberFormat = document.getElementById('numberFormat');

    suiteSetup(function(done) {
      var data = generateDataValues( generateEmptyData(2) );
      setData(numberFormat, data,done);
    });

    test('numberFormat fixtures are created', function() {
      assert.isTrue(numberFormat !== null);
    });

    test('numberFormat formated', function() {
      var series = Polymer.dom(numberFormat.root).querySelectorAll('px-vis-register-item');

      assert.equal(series[0].querySelector('.seriesData').textContent.trim().replace(/\r?\n|\r/g, "").split(' ').join(''),'1015.20000'  + String.fromCharCode(160) +  'yUnit');
    });
  });

  suite('px-vis-register formats language units', function() {
    var numberFormatCulture = document.getElementById('numberFormatCulture');

    suiteSetup(function(done) {
      var data = generateDataValues( generateEmptyData(2) );
      setData(numberFormatCulture, data,done);
    });

    test('numberFormatCulture fixtures are created', function() {
      assert.isTrue(numberFormatCulture !== null);
    });

    test('numberFormatCulture formated', function() {
      var series = Polymer.dom(numberFormatCulture.root).querySelectorAll('px-vis-register-item');
      assert.equal(series[0].querySelector('.seriesData').textContent.trim().replace(/\r?\n|\r/g, "").split(' ').join(''),'1.015,20'  + String.fromCharCode(160) +  'yUnit');
    });
  });

  suite('px-vis-register shows both values if x axis is not time based', function() {
    var register = document.getElementById('nonTime');

    suiteSetup(function(done) {
      var data = generateDataValues( generateEmptyData(2) );
      setData(register, data,done);
    });

    test('nonTime fixtures are created', function() {
      assert.isTrue(register !== null);
    });

    test('nonTime doesnt show date', function() {
      assert.isNull(Polymer.dom(register.root).querySelector('px-vis-register-datetime'));
    });

    test('nonTime formated', function() {
      var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item'),
          texts = series[0].querySelector('.seriesData').textContent.trim().replace(/\r?\n|\r/g, "").split(' ').join('').split('/');

      assert.equal(texts[0].trim(),'1,419,064,667,000.00'  + String.fromCharCode(160) +  'xUnit');
      assert.equal(texts[1].trim(),'1,015.20'  + String.fromCharCode(160) +  'yUnit');
    });
  });

  suite('px-vis-register shows both values if x axis is ordinal', function() {
    var register = document.getElementById('ordinal');

    suiteSetup(function(done) {
      var data = generateOrdinalDataValues( generateEmptyData(2) );
      setData(register, data,done);
    });

    test('ordinal fixtures are created', function() {
      assert.isTrue(register !== null);
    });

    test('ordinal doesnt show date', function() {
      assert.isNull(Polymer.dom(register.root).querySelector('px-vis-register-datetime'));
    });

    test('ordinal formated', function() {
      var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item'),
          texts = series[0].querySelector('.seriesData').textContent.trim().replace(/\r?\n|\r/g, "").split(' ').join('').split('/');

      assert.equal(texts[0].trim(),'StringyString'  + String.fromCharCode(160) +  'xUnit');
      assert.equal(texts[1].trim(),'1,015.20'  + String.fromCharCode(160) +  'yUnit');
    });
  });

  suite('px-vis-register non time based by default', function() {
    var register = document.getElementById('nonTimeDefault');

    suiteSetup(function(done) {
      var data = generateDataValues( generateEmptyData(2) );
      setData(register, data,done);
    });

    test('nonTime fixtures are created', function() {
      assert.isTrue(register !== null);
    });

    test('nonTime doesnt show date', function() {
      assert.isNull(Polymer.dom(register.root).querySelector('px-vis-register-datetime'));
    });

    test('nonTime formated', function() {
      var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item'),
          texts = series[0].querySelector('.seriesData').textContent.trim().replace(/\r?\n|\r/g, "").split(' ').join('').split('/');

      assert.equal(texts[0].trim(),'1,419,064,667,000.00'  + String.fromCharCode(160) +  'xUnit');
      assert.equal(texts[1].trim(),'1,015.20'  + String.fromCharCode(160) +  'yUnit');
    });
  });

  suite('px-vis-register for pie', function() {
    var register = document.getElementById('pie');

    suiteSetup(function(done) {
      var data = generatePieDataValues( generateEmptyData(2) );
      setData(register, data,done);
    });

    test('pie doesnt show date', function() {
      assert.isNull(Polymer.dom(register.root).querySelector('px-vis-register-datetime'));
    });

    test('pie formated with unit', function() {
      var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item-pie'),
          texts = series[0].querySelector('.seriesData').textContent.trim().replace(/\r?\n|\r/g, "").split(' ').join('').split('/');

      assert.equal(texts,'1015.2xUnit');
    });

    test('pie formated with percentage', function(done) {

      register.usePercentage = true;

      flush(function(){
        var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item-pie'),
            texts = series[0].querySelector('.seriesData').textContent.trim().replace(/\r?\n|\r/g, "").split(' ').join('').split('/');

        assert.equal(texts,'12%');
        done();
      });
    });
  });
}

function basicTests(registerID,dir){
  var register = document.getElementById(registerID);

  suite('px-vis-register ' + registerID + ' with 5 series -- simulating basic creation', function() {
    var data;
    suiteSetup(function(done) {
      data = generateEmptyData(5);
      setData(register, data, done);
    });

    test(registerID + ' fixture is created', function() {
      assert.isTrue(register !== null);
    });

    test(registerID + ' has default properties', function() {
      var dt = register.$$('px-vis-register-datetime');
      assert.equal(register.type, dir);
      assert.equal(Polymer.dom(dt.root).querySelector('#dateTime').textContent.trim(), '');
    });

    test(registerID + ' has 5 series', function() {
      assert.equal(Polymer.dom(register.root).querySelectorAll('px-vis-register-item').length, 5);
    });

    test(registerID + ' names match', function() {
      var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item');
      for(var i = 0; i < series.length; i++){
        assert.equal(series[i].querySelector('.seriesName').firstChild.textContent.trim(), data.completeSeriesConfig['series_'+i]['name']);
      }
    });

    test(registerID + ' colors are correct', function() {
      var colorOrder = dataVisColors.properties.seriesColorOrder.value;
      var colorSet = dataVisColors.properties.dataVisColors.value;
      var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item');
      for(var i = 0; i < series.length; i++){
        assert.equal(series[i].querySelector('.seriesMarker').getAttribute('style').split(' ').join('').split(';')[0], 'background-color:' + colorSet[ colorOrder[i] ]);
      }
    });

  });

  suite('px-vis-register ' + registerID + ' update data on series  -- simulating on-chart-hover', function() {
    var data;
    suiteSetup(function(done) {
      data = generateDataValues( generateEmptyData(5) );
      setData(register, data, done);
    });

    test(registerID + ' still has 5 series', function() {
      assert.equal(Polymer.dom(register.root).querySelectorAll('px-vis-register-item').length, 5);
    });

    test(registerID + ' shows time', function() {
      var dt = register.$$('px-vis-register-datetime');
      var displayTime = Polymer.dom(dt.root).querySelector('#dateTime').textContent.trim();
      assert.equal(displayTime, '08:37:47 +0000 | 20 Dec 2014');
    });

    test(registerID + ' still names match', function() {
      var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item');
      for(var i = 0; i < series.length; i++){
        assert.equal(series[i].querySelector('.seriesName').firstChild.textContent.trim(), data.completeSeriesConfig['series_'+i]['name']);
      }
    });

    test(registerID + ' values match', function() {
      var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item');
      for(var i = 0; i < series.length; i++){
        //we have a non breaking space, char 160, instead of a space
        assert.equal(series[i].querySelector('.seriesData').textContent.replace(/\r?\n|\r/g, "").split(' ').join('').trim(), '1,015.20' + String.fromCharCode(160) + 'yUnit');
      }
    });
  });

  suite('px-vis-register ' + registerID + ' remove data -- simulating off-chart-hover', function() {
    var data;
    suiteSetup(function(done) {
      data = generateEmptyData(5);
      setData(register, data, done);
    });

    test(registerID + ' still has 5 series', function() {
      assert.equal(Polymer.dom(register.root).querySelectorAll('px-vis-register-item').length, 5);
    });

    test(registerID + ' does not show time', function() {
      var dt = register.$$('px-vis-register-datetime');
      var displayTime = Polymer.dom(dt.root).querySelector('#dateTime').textContent.trim();
      assert.equal(displayTime, '');
    });

    test(registerID + ' still names match', function() {
      var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item');
      for(var i = 0; i < series.length; i++){
        assert.equal(series[i].querySelector('.seriesName').firstChild.textContent.trim(), data.completeSeriesConfig['series_'+i]['name']);
      }
    });

    test(registerID + ' values are blank', function() {
      var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item'),
          numForm;
      for(var i = 0; i < series.length; i++){
        numForm = series[i].querySelector('.seriesData').querySelector('px-number-formatter');
        assert.equal(numForm.style["display"], "none");
      }
    });
  });

  suite('px-vis-register ' + registerID + ' clicking on series', function() {
    var data,
        regItem,
        series,
        seriesName,
        regWithoutMenu,
        eventObj;
    suiteSetup(function(done) {
      data = generateEmptyData(5);
      document.addEventListener('px-vis-muted-series-updated',function(evt){
        eventObj = evt.detail;
      });
      setData(register, data, done);
    });

    test(registerID + ' series added to mutedSeries', function() {
      regItem = Polymer.dom(register.root).querySelectorAll('px-vis-register-item')[1];
      series = regItem.querySelector('.series');
      seriesName = series.querySelector('.seriesName');
      regWithoutMenu = series.querySelector('#regWithoutMenu');
      regWithoutMenu.click();

      var ms = Object.keys(register.mutedSeries);
      assert.equal(ms.length, 1);
      assert.equal(ms[0], seriesName.getAttribute('name').substr(1));
      assert.equal(ms[0], Object.keys(register.completeSeriesConfig)[1]);
      assert.equal(register.mutedSeries[ms[0]], true);
      assert.isTrue(regWithoutMenu.classList.contains('muted'));
    });

    test(registerID + ' muted-series-updated event fired', function() {
      assert.isDefined(eventObj);
    });

    test(registerID + ' mutedSeries change to false', function() {
      regWithoutMenu.click();

      var ms = Object.keys(register.mutedSeries);
      assert.equal(ms.length, 1);
      assert.equal(ms[0], seriesName.getAttribute('name').substr(1));
      assert.equal(ms[0], Object.keys(register.completeSeriesConfig)[1]);
      assert.equal(register.mutedSeries[ms[0]], false);
      assert.isTrue(!regWithoutMenu.classList.contains('muted'));
    });

    test(registerID + ' mutedSeries change back to true', function() {
      seriesName.click();

      var ms = Object.keys(register.mutedSeries);
      assert.equal(ms.length, 1);
      assert.equal(ms[0], seriesName.getAttribute('name').substr(1));
      assert.equal(ms[0], Object.keys(register.completeSeriesConfig)[1]);
      assert.equal(register.mutedSeries[ms[0]], true);
      assert.isTrue(regWithoutMenu.classList.contains('muted'));
    });
  });

  suite('px-vis-register shows zero values ', function() {
    var register = document.getElementById('checkZero');

    suiteSetup(function(done) {
      var data = generateDataValues( generateEmptyData(2) );

      data.data.series[0]['value']['x'] = 0;
      data.data.series[0]['value']['y'] = 0;
      setData(register, data,done);
    });

    test('showZero fixtures are created', function() {
      assert.isTrue(register !== null);
    });

    test('showZero doesnt show date', function() {
      assert.isNull(Polymer.dom(register.root).querySelector('px-vis-register-datetime'));
    });

    test('showZero formated', function() {
      var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item'),
          texts = series[0].querySelector('.seriesData').textContent.trim().replace(/\r?\n|\r/g, "").split(' ').join('').split('/');

      assert.equal(texts[0].trim(),'0' + String.fromCharCode(160) + 'xUnit');
      assert.equal(texts[1].trim(),'0' + String.fromCharCode(160) + 'yUnit');
    });
  });

}

function generateEmptyData(num,str){
  var colorOrder = dataVisColors.properties.seriesColorOrder.value;
  var colorSet = dataVisColors.properties.dataVisColors.value;
  var str = str || 'series_';
  var chartData = [];
  var dataObj = {
    'time': null,
    'series': []
  };
  var seriesConfig = {};
  for(var i = 0; i < num; i++){
    var name = str + i;
    seriesConfig[name] = {
      'name': name,
      'color': colorSet[colorOrder[i]],
      'x': 'x',
      'y': 'y',
      'xAxisUnit': 'xUnit',
      'yAxisUnit': 'yUnit'
    };

    dataObj.series[i] = {
      "name": name,
      "value": null
    };
  }

  return { 'data':dataObj,'completeSeriesConfig':seriesConfig };
}

function generateDataValues(data){
  data.data.time = new Date('Sat Dec 20 2014 00:37:47 GMT-0800 (PST)');

  for(var i = 0; i < data.data.series.length; i++){
    data.data.series[i]['value'] = {
      "x": Number(data.data.time),
      "y": 1015.2
    };
  }
  return data;
}

function generateOrdinalDataValues(data){

  for(var i = 0; i < data.data.series.length; i++){
    data.data.series[i]['value'] = {
      "x": "StringyString",
      "y": 1015.2
    };
  }
  return data;
}

function generatePieDataValues(data){

  for(var i = 0; i < data.data.series.length; i++){
    data.data.series[i] = {
      "x":  1015.2,
      "y": "somestring",
      "percentage": 12
    };
  }
  return data;
}

function setData(series, data, done){
  series.set('tooltipData',{});
  series.set('completeSeriesConfig',data.completeSeriesConfig);
  series.set('tooltipData',data.data);
  series.set('chartData',data.data.series);

  // pause and let the dom repeate chug away
  setTimeout(function() {
    if(done){ done(); }
  }, 10);
}

function setMutedSeries(series, name, done){
  series.set('mutedSeries', {});
  series.set('mutedSeries.' + name, true);

  // pause and let the dom repeate chug away
  setTimeout(function(){
    if(done){ done(); }
  },10);
}
