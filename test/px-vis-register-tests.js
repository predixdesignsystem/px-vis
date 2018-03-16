document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function getRegisterXYValues(register, subitemName, xOrdinal) {
  var subName = subitemName ? subitemName : 'px-vis-register-item',
      series = Polymer.dom(register.root).querySelectorAll(subName),
      seriesData,
      valueX,
      valueY,
      unit = '';

  seriesData = Polymer.dom(series[0].root).querySelector('.seriesData');

  var child = seriesData.firstChild,
      curr = '';

  while(child) {
      if (child.nodeType === 3) { // nodeType === Node.TEXT_NODE
        curr = child.nodeValue.trim();
        unit += curr;
      }

      child = child.nextSibling;
  }

  var index = 0;
  if(xOrdinal) {
    valueX = Polymer.dom(seriesData.querySelector('#xSpan')).textContent.trim();
  } else {
    valueX = Polymer.dom(seriesData.querySelectorAll('px-number-formatter')[0].root).querySelector('span').textContent;
    index++;
  }

  valueY = Polymer.dom(seriesData.querySelectorAll('px-number-formatter')[index].root).querySelector('span').textContent;

  return {
    'x': valueX,
    'y': valueY,
    'unit': unit
  }
}

function getRegisterSingleValues(register, subitemName, isPie) {
  var subName = subitemName ? subitemName : 'px-vis-register-item',
      series = Polymer.dom(register.root).querySelectorAll(subName),
      seriesData,
      valueX,
      valueY,
      unit = '';

  seriesData = Polymer.dom(series[0].root).querySelector('.seriesData');

  var child = seriesData.firstChild,
      curr = '';

  while(child) {
      if (child.nodeType === 3) { // nodeType === Node.TEXT_NODE
        curr = child.nodeValue.trim();
        unit += curr;
      }

      child = child.nextSibling;
  }

  if(isPie) {
    value = seriesData.querySelector('span').textContent.trim();
  } else {
    value = Polymer.dom(seriesData.querySelectorAll('px-number-formatter')[0].root).querySelector('span').textContent.trim();
  }


  return {
    'value': value,
    'unit': unit
  }
}

function runTests() {
  suite('px-vis-register does Polymer exist?', function() {

    suiteSetup(function(done) {   window.setTimeout(function() {done();}, 1000); });
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-register emptyRegister has default config', function() {
    var emptyRegister;

    suiteSetup(function() {
      emptyRegister = document.getElementById('emptyRegister');
    });
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
    var doesItMute;
    var data;
    suiteSetup(function(done) {
      doesItMute = document.getElementById('doesItMute');
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
          regWithoutMenu = Polymer.dom(series[1].root).querySelector('#regWithoutMenu');

      assert.isTrue(ms[data.data.series[1].name]);
      assert.isTrue(regWithoutMenu.classList.contains('muted'));
    });

  });

  suite('px-vis-register truncates names correctly', function() {
    var truncate,
        truncateShort,
        noTruncate;

    suiteSetup(function(done) {
      truncate = document.getElementById('truncate');
      truncateShort = document.getElementById('truncateShort');
      noTruncate = document.getElementById('noTruncate');
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

      assert.equal(Polymer.dom(series[0].root).querySelector('.seriesName').firstChild.textContent.trim(),'this_...name0');
      assert.equal(Polymer.dom(series[1].root).querySelector('.seriesName').firstChild.textContent.trim(),'this_...name1');
    });

    test('truncateShort is correct', function() {
      var series = Polymer.dom(truncateShort.root).querySelectorAll('px-vis-register-item');

      assert.equal(Polymer.dom(series[0].root).querySelector('.seriesName').firstChild.textContent.trim(),'thi...e0');
      assert.equal(Polymer.dom(series[1].root).querySelector('.seriesName').firstChild.textContent.trim(),'thi...e1');
    });

    test('noTruncate is correct', function() {
      var series = Polymer.dom(noTruncate.root).querySelectorAll('px-vis-register-item');

      assert.equal(Polymer.dom(series[0].root).querySelector('.seriesName').firstChild.textContent.trim(),'this_is_a_long_name0');
      assert.equal(Polymer.dom(series[1].root).querySelector('.seriesName').firstChild.textContent.trim(),'this_is_a_long_name1');
    });

    test('tooltips are created (or not)', function() {
      var truncateSeries = Polymer.dom(truncate.root).querySelectorAll('px-vis-register-item');
      var truncateTT = Polymer.dom(truncateSeries[0].root).querySelector('.seriesName').querySelector('px-tooltip');

      var truncateShortSeries = Polymer.dom(truncateShort.root).querySelectorAll('px-vis-register-item');
      var truncateShortTT = Polymer.dom(truncateShortSeries[0].root).querySelector('.seriesName').querySelector('px-tooltip');

      var noTruncateSeries = Polymer.dom(noTruncate.root).querySelectorAll('px-vis-register-item');
      var noTruncateTT = Polymer.dom(noTruncateSeries[0].root).querySelector('.seriesName').querySelector('px-tooltip');

      assert.isTrue(truncateTT !== null);
      assert.isTrue(truncateShortTT !== null);
      assert.isTrue(noTruncateTT === null);
    });
  });

  suite('px-vis-register formats time correctly', function() {
    var datetimeFormat;

    suiteSetup(function(done) {
      datetimeFormat = document.getElementById('datetimeFormat');
      var data = generateDataValues( generateEmptyData(2) );
      setData(datetimeFormat, data,done);
    });

    test('datetimeFormat fixtures are created', function() {
      assert.isTrue(datetimeFormat !== null);
    });

    test('datetimeFormat is correct', function() {
      var series = Polymer.dom(Polymer.dom(datetimeFormat.root).querySelector('px-vis-register-datetime').root).querySelector('#dateTime');

      assert.equal(series.textContent.trim(),'December 20th, 2014 @ 8:37:47AM');
    });
  });

  suite('px-vis-register formats units', function() {
    var numberFormat;

    suiteSetup(function(done) {
      numberFormat = document.getElementById('numberFormat');
      var data = generateDataValues( generateEmptyData(2) );
      setData(numberFormat, data);
      window.setTimeout(function() {
        done();
      }, 150);
    });

    test('numberFormat fixtures are created', function() {
      assert.isTrue(numberFormat !== null);
    });

    test('numberFormat formated', function() {
      var value = getRegisterSingleValues(numberFormat);

      assert.equal(value.value,'1015.20000');
      assert.equal(value.unit,'yUnit');
    });
  });

  suite('px-vis-register formats language units', function() {
    var numberFormatCulture;

    suiteSetup(function(done) {
      numberFormatCulture = document.getElementById('numberFormatCulture');
      numberFormatCulture.set('numberFormatCulture' , 'da-DK');
      var data = generateDataValues( generateEmptyData(2) );
      setData(numberFormatCulture, data,done);
    });

    suiteTeardown(function() {
      numbro.culture('en-US');
    });

    test('numberFormatCulture fixtures are created', function() {
      assert.isTrue(numberFormatCulture !== null);
    });

    test('numberFormatCulture formated', function() {

      var value;
      async.until(
        ()=> {
          value = getRegisterSingleValues(numberFormatCulture);
          return value.value === '1.015,20' && value.unit === 'yUnit';
        },
        (callback)=> {
          setTimeout(callback, 1000);
        },
        ()=> {
          assert.isTrue(true);
        }
      )
    });
  });

  suite('px-vis-register shows both values if x axis is not time based', function() {
    var register;

    suiteSetup(function(done) {
      register = document.getElementById('nonTime');
      var data = generateDataValues( generateEmptyData(2) );
      setData(register, data);
      window.setTimeout(function() {
        done();
      }, 150);
    });

    test('nonTime fixtures are created', function() {
      assert.isTrue(register !== null);
    });

    test('nonTime doesnt show date', function() {
      assert.isNull(Polymer.dom(register.root).querySelector('px-vis-register-datetime'));
    });

    test('nonTime formated', function() {

      var values = getRegisterXYValues(register);
      var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item'),
          texts = Polymer.dom(series[0].root).querySelector('.seriesData').textContent.trim().replace(/\r?\n|\r/g, "").split(' ').join('').split('/');

      assert.equal(values.x,'1,419,064,667,000.00');
      assert.equal(values.y,'1,015.20');
      assert.equal(values.unit, 'xUnit /yUnit')
    });
  });

  suite('px-vis-register shows both values if x axis is ordinal', function() {
    var register;

    suiteSetup(function(done) {
      register = document.getElementById('ordinal');
      var data = generateOrdinalDataValues( generateEmptyData(2) );
      setData(register, data);
      window.setTimeout(function() {
        done();
      }, 150);
    });

    test('ordinal fixtures are created', function() {
      assert.isTrue(register !== null);
    });

    test('ordinal doesnt show date', function() {
      assert.isNull(Polymer.dom(register.root).querySelector('px-vis-register-datetime'));
    });

    test('ordinal formated', function() {
      var values = getRegisterXYValues(register, 'px-vis-register-item' , true);

      assert.equal(values.x,'StringyString');
      assert.equal(values.y,'1,015.20');
      assert.equal(values.unit, 'xUnit /yUnit');
    });
  });

  suite('px-vis-register non time based by default', function() {
    var register;

    suiteSetup(function(done) {
      register = document.getElementById('nonTimeDefault');
      var data = generateDataValues( generateEmptyData(2) );
      setData(register, data);
      window.setTimeout(function() {
        done();
      }, 150);
    });

    test('nonTime fixtures are created', function() {
      assert.isTrue(register !== null);
    });

    test('nonTime doesnt show date', function() {
      assert.isNull(Polymer.dom(register.root).querySelector('px-vis-register-datetime'));
    });

    test('nonTime formated', function() {
      var values = getRegisterXYValues(register);

      assert.equal(values.x,'1,419,064,667,000.00');
      assert.equal(values.y,'1,015.20');
      assert.equal(values.unit, 'xUnit /yUnit');
    });
  });

  suite('px-vis-register for pie', function() {
    var register;

    suiteSetup(function(done) {
      register = document.getElementById('pie');
      var data = generatePieDataValues( generateEmptyData(2) );
      setData(register, data);
      window.setTimeout(function() {
        done();
      }, 150);
    });

    test('pie doesnt show date', function() {
      assert.isNull(Polymer.dom(register.root).querySelector('px-vis-register-datetime'));
    });

    test('pie formated with unit', function() {
      var value = getRegisterSingleValues(register, 'px-vis-register-item-pie', true);

      assert.equal(value.value,'1015.2');
      assert.equal(value.unit,'xUnit');
    });

    test('pie formated with percentage', function(done) {

      register.usePercentage = true;

      flush(function(){
        var value = getRegisterSingleValues(register, 'px-vis-register-item-pie', true);

        assert.equal(value.value,'12');
        assert.equal(value.unit,'%');
        done();
      });
    });
  });


  suite('px-vis-register with dashPattern', function() {
    var dashPattern;

    suiteSetup(function(done) {
      dashPattern = document.getElementById('dashPattern');
      var data = generateDataValues( generateEmptyData(2) );
      data.completeSeriesConfig["series_0"]["dashPattern"] = "5,2";
      data.completeSeriesConfig["series_1"]["dashPattern"] = "10,5";
      setData(dashPattern, data, done);
    });

    test('dashPattern fixtures are created', function() {
      assert.isTrue(dashPattern !== null);
    });

    test('dashPattern is correct', function() {
      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value,
          series = Polymer.dom(dashPattern.root).querySelectorAll('px-vis-register-item'),

          color0 = colorSet[0],
          color1 = colorSet[1],

          pattern0 = Polymer.dom(series[0].root).querySelector('.seriesMarkerIcon').getAttribute('style'),
          pattern1 = Polymer.dom(series[1].root).querySelector('.seriesMarkerIcon').getAttribute('style'),

          // "background:linear-gradient(to bottom, rgb(93,165,218) 0px, rgb(93,165,218) 5px, transparent 5px, transparent 7px, rgb(93,165,218) 7px, rgb(93,165,218) 12px, transparent 12px, transparent 14px, rgb(93,165,218) 14px, rgb(93,165,218) 19px, transparent 19px, transparent 21px, rgb(93,165,218) 21px, rgb(93,165,218) 26px, transparent 26px, transparent 28px); border-bottom: 1px solid rgb(93,165,218);"
          re0 = new RegExp([
            'background:\\s?linear-gradient\\((?:to bottom,)?\\s?',
            '(rgb\\(\\d+,\\s?\\d+,\\s?\\d+\\))\\s?(\\d+)px,\\s?(rgb\\(\\d+,\\s?\\d+,\\s?\\d+\\))\\s?(\\d+)px,\\s?',
            'transparent\\s?(\\d+)px,\\s?transparent\\s?(\\d+)px,\\s?',
            '(rgb\\(\\d+,\\s?\\d+,\\s?\\d+\\))\\s?(\\d+)px,\\s?(rgb\\(\\d+,\\s?\\d+,\\s?\\d+\\))\\s?(\\d+)px,\\s?',
            'transparent\\s?(\\d+)px,\\s?transparent\\s?(\\d+)px,\\s?',
            '(rgb\\(\\d+,\\s?\\d+,\\s?\\d+\\))\\s?(\\d+)px,\\s?(rgb\\(\\d+,\\s?\\d+,\\s?\\d+\\))\\s?(\\d+)px,\\s?',
            'transparent\\s?(\\d+)px,\\s?transparent\\s?(\\d+)px,\\s?',
            '(rgb\\(\\d+,\\s?\\d+,\\s?\\d+\\))\\s?(\\d+)px,\\s?(rgb\\(\\d+,\\s?\\d+,\\s?\\d+\\))\\s?(\\d+)px,\\s?',
            'transparent\\s?(\\d+)px,\\s?transparent\\s?(\\d+)px\\);'
          ].join('')),

          // "background:linear-gradient(to bottom, rgb(250,164,58) 0px, rgb(250,164,58) 10px, transparent 10px, transparent 15px, rgb(250,164,58) 15px, rgb(250,164,58) 25px, transparent 25px, transparent 30px); border-bottom: 1px solid rgb(250,164,58);"
          re1 = new RegExp([
            'background:\\s?linear-gradient\\((?:to bottom,)?\\s?',
            '(rgb\\(\\d+,\\s?\\d+,\\s?\\d+\\))\\s?(\\d+)px,\\s?(rgb\\(\\d+,\\s?\\d+,\\s?\\d+\\))\\s?(\\d+)px,\\s?',
            'transparent\\s?(\\d+)px,\\s?transparent\\s?(\\d+)px,\\s?',
            '(rgb\\(\\d+,\\s?\\d+,\\s?\\d+\\))\\s?(\\d+)px,\\s?(rgb\\(\\d+,\\s?\\d+,\\s?\\d+\\))\\s?(\\d+)px,\\s?',
            'transparent\\s?(\\d+)px,\\s?transparent\\s?(\\d+)px\\);'
          ].join('')),
          matches0 = re0.exec(pattern0),
          matches1 = re1.exec(pattern1);

      assert.equal(matches0[1].split(' ').join(''), color0.split(' ').join(''));
      assert.equal(matches0[2], 0);
      assert.equal(matches0[4], 5);
      assert.equal(matches0[5], 5);
      assert.equal(matches0[6], 7);

      assert.equal(matches1[1].split(' ').join(''), color1.split(' ').join(''));
      assert.equal(matches1[2], 0);
      assert.equal(matches1[4], 10);
      assert.equal(matches1[5], 10);
      assert.equal(matches1[6], 15);

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
        assert.equal(Polymer.dom(series[i].root).querySelector('.seriesName').firstChild.textContent.trim(), data.completeSeriesConfig['series_'+i]['name']);
      }
    });

    test(registerID + ' colors are correct', function() {

      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item');
      for(var i = 0; i < series.length-1; i++){
        assert.equal(Polymer.dom(series[i].root).querySelector('.seriesMarkerIcon').getAttribute('style').split(' ').join('').split(';')[0], 'background-color:' + colorSet[i]);
      }

      assert.equal(Polymer.dom(series[series.length-1].root).querySelector('.seriesMarkerIcon').getAttribute('style').split(' ').join('').split(';')[0], 'background-color:transparent');
    });

  });

  suite('px-vis-register ' + registerID + ' update data on series  -- simulating on-chart-hover', function() {
    var data;
    suiteSetup(function(done) {
      data = generateDataValues( generateEmptyData(5) );
      setData(register, data);
      window.setTimeout(function() {
        done();
      }, 200);
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
        assert.equal(Polymer.dom(series[i].root).querySelector('.seriesName').firstChild.textContent.trim(), data.completeSeriesConfig['series_'+i]['name']);
      }
    });

    test(registerID + ' values match', function() {
      var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item'),
          seriesData,
          value,
          unit;
      for(var i = 0; i < series.length; i++){
        seriesData = Polymer.dom(series[i].root).querySelector('.seriesData');
        unit = seriesData.lastChild.textContent.trim();
        value = Polymer.dom(seriesData.querySelector('px-number-formatter').root).querySelector('span').innerText;
        assert.equal(value, '1,015.20');
        assert.equal(unit, 'yUnit');
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
        assert.equal(Polymer.dom(series[i].root).querySelector('.seriesName').firstChild.textContent.trim(), data.completeSeriesConfig['series_'+i]['name']);
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
      series = Polymer.dom(regItem.root).querySelector('.series');
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
    var register;

    suiteSetup(function(done) {
      register = document.getElementById('checkZero');
      var data = generateDataValues( generateEmptyData(2) );

      data.data.series[0]['value']['x'] = 0;
      data.data.series[0]['value']['y'] = 0;
      setData(register, data);
      window.setTimeout(function() {
        done();
      }, 150);
    });

    test('showZero fixtures are created', function() {
      assert.isTrue(register !== null);
    });

    test('showZero doesnt show date', function() {
      assert.isNull(Polymer.dom(register.root).querySelector('px-vis-register-datetime'));
    });

    test('showZero formated', function() {
      var values = getRegisterXYValues(register);

      assert.equal(values.x, '0');
      assert.equal(values.y, '0');
      assert.equal(values.unit, 'xUnit /yUnit');
    });
  });
}

function generateEmptyData(num,str){

  var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
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
      'color': colorSet[i],
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
  window.setTimeout(function() {
    if(done){ done(); }
  }, 50);
}

function setMutedSeries(series, name, done){
  series.set('mutedSeries', {});
  series.set('mutedSeries.' + name, true);

  // pause and let the dom repeate chug away
  window.setTimeout(function(){
    if(done){ done(); }
  },50);
}
