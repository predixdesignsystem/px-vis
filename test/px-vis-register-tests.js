document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests() {
// ############################################################################
// ############################################################################
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

// ############################################################################
// ############################################################################
  basicTests('verticalSeries','vertical');

// ############################################################################
// ############################################################################
  basicTests('horizontalSeries','horizontal');

// ############################################################################
// ############################################################################

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

// ############################################################################
// ############################################################################

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

    test('tooltips are created (or not)', function(done) {
      let truncateSeries = Polymer.dom(truncate.root).querySelectorAll('px-vis-register-item')[0];
      let truncateShortSeries = Polymer.dom(truncateShort.root).querySelectorAll('px-vis-register-item')[0];
      let noTruncateSeries = Polymer.dom(noTruncate.root).querySelectorAll('px-vis-register-item')[0];

      let truncateSeriesName = Polymer.dom(truncateSeries.root).querySelector('#seriesName');
      let truncateShortSeriesName = Polymer.dom(truncateShortSeries.root).querySelector('#seriesName');
      let noTruncateSeriesName = Polymer.dom(noTruncateSeries.root).querySelector('#seriesName');

      let truncateDone = false,
          truncateShortDone = false,
          noTruncateFired = false,
          truncateEvt,
          truncateShortEvt;

      let allDone = function() {
        if(truncateDone && truncateShortDone) {

          assert.equal(truncateEvt.detail.data[0].text, 'this_is_a_long_name0');
          assert.equal(truncateEvt.detail.origin, truncateSeries);
          assert.equal(truncateEvt.detail.element, truncateSeriesName);

          assert.equal(truncateShortEvt.detail.data[0].text, 'this_is_a_long_name0');
          assert.equal(truncateShortEvt.detail.origin, truncateShortSeries);
          assert.equal(truncateShortEvt.detail.element, truncateShortSeriesName);

          assert.isFalse(noTruncateFired);

          done();
        }
      }

      truncate.addEventListener('central-tooltip-display-request', (evt) => {
        truncateDone = true;
        truncateEvt = evt;
        allDone();
      });

      truncateShort.addEventListener('central-tooltip-display-request', (evt) => {
        truncateShortDone = true;
        truncateShortEvt = evt;
        allDone();
      });

      noTruncate.addEventListener('central-tooltip-display-request', () => {
        noTruncateFired = true;
        allDone();
      });

      noTruncateSeriesName.dispatchEvent(new MouseEvent("mouseenter", {
        bubbles: true,
        cancelable: true,
        view: window
      }));

      truncateSeriesName.dispatchEvent(new MouseEvent("mouseenter", {
        bubbles: true,
        cancelable: true,
        view: window
      }));

      truncateShortSeriesName.dispatchEvent(new MouseEvent("mouseenter", {
        bubbles: true,
        cancelable: true,
        view: window
      }));


    });
  });

// ############################################################################
// ############################################################################

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

// ############################################################################
// ############################################################################

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
      var series = Polymer.dom(numberFormat.root).querySelector('px-vis-register-item');

      assert.equal(series._displayedData, '1015.20000 yUnit');
    });
  });

// ############################################################################
// ############################################################################

  suite('px-vis-register formats language units', function() {
    var numberFormatCulture;

    suiteSetup(function(done) {
      numberFormatCulture = document.getElementById('numberFormatCulture');
      var data = generateDataValues( generateEmptyData(2) );
      setData(numberFormatCulture, data,done);
    });

    test('numberFormatCulture fixtures are created', function() {
      assert.isTrue(numberFormatCulture !== null);
    });

    test('numberFormatCulture formated', function() {
      var series = Polymer.dom(numberFormatCulture.root).querySelector('px-vis-register-item');
      assert.equal(series._displayedData, '1.015,20 yUnit');
    });
  });

// ############################################################################
// ############################################################################

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
      var series = Polymer.dom(register.root).querySelector('px-vis-register-item');
      assert.equal(series._displayedData, '1,419,064,667,000.00 xUnit / 1,015.20 yUnit');
    });
  });

// ############################################################################
// ############################################################################

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
      var series = Polymer.dom(register.root).querySelector('px-vis-register-item');
      assert.equal(series._displayedData, 'StringyString xUnit / 1,015.20 yUnit');
    });
  });

// ############################################################################
// ############################################################################

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
      var series = Polymer.dom(register.root).querySelector('px-vis-register-item');
      assert.equal(series._displayedData, '1,419,064,667,000.00 xUnit / 1,015.20 yUnit');
    });
  });


// ############################################################################
// ############################################################################

suite('Horizontal px-vis-register pagnation works', function() {
  var register;

  suiteSetup(function(done) {
    register = document.getElementById('pagnation1');
    var data = generateDataValues( generateEmptyData(2) );
    register.set('currentPage', 2);
    register.set('totalPages', 250);
    setData(register, data);
    window.setTimeout(function() {
      done();
    }, 150);
  });

  test('pagnation fixtures are created', function() {
    assert.isTrue(register !== null);
  });

  test('pagnation displays page counts', function() {
    var pages = Polymer.dom(register.root).querySelectorAll('.textInfo');
    assert.isFalse(pages[0].parentNode.classList.contains('hide'));
    assert.equal(pages[0].textContent.trim(), '2 of 250');
  });

  test('pagnation displays page arrows', function() {
    var pages = Polymer.dom(register.root).querySelectorAll('.paginateButton');
    assert.isFalse(pages[0].firstElementChild.classList.contains('hide'));
    assert.isFalse(pages[1].firstElementChild.classList.contains('hide'));
  });
});

// ############################################################################
// ############################################################################

suite('Vertical px-vis-register pagnation works', function() {
  var register;

  suiteSetup(function(done) {
    register = document.getElementById('pagnation2');
    var data = generateDataValues( generateEmptyData(2) );
    register.set('currentPage', 2);
    register.set('totalPages', 250);
    setData(register, data);
    window.setTimeout(function() {
      done();
    }, 150);
  });

  test('pagnation fixtures are created', function() {
    assert.isTrue(register !== null);
  });

  test('pagnation displays page counts', function() {
    var pages = Polymer.dom(register.root).querySelectorAll('.textInfo');
    assert.isFalse(pages[2].parentNode.classList.contains('hide'));
    assert.equal(pages[2].textContent.trim(), '2 of 250');
  });

  test('pagnation displays page arrows', function() {
      const pages = Polymer.dom(register.root).querySelector('#verticalPagnation');
      assert.isFalse(pages.classList.contains('hide'));
  });
});

// ############################################################################
// ############################################################################

suite('px-vis-register sorting menu is shown', function() {
  var register;

  suiteSetup(function(done) {
    register = document.getElementById('sorting');
    var data = generateDataValues( generateEmptyData(2) );
    register.set("sortConfig", {
      "default": {
        "name": "default",
        "sortFunction": "default",
        "selected": "true"
      },
      "combined": {
        "name": "Combined",
        "sortFunction": ["nameIgnoreCase", "muted"]
      },
      "muted": {
        "name": "Muted",
        "sortFunction": "muted"
      }
    });
    setData(register, data);
    window.setTimeout(function() {
      done();
    }, 150);
  });

  test('sorting fixtures are created', function() {
    assert.isTrue(register !== null);
  });

  test('sorting is shown', function() {
    var set = Polymer.dom(register.root).querySelector('#sortingContainer');
    assert.isFalse(set.classList.contains('hide'));
  });

  // TODO Add tests for sorting
});

// ############################################################################
// ############################################################################

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
      var series = Polymer.dom(register.root).querySelector('px-vis-register-item');

      var value = getPieValues(register);

      assert.equal(value.value,'1015.2');
      assert.equal(value.unit,'xUnit');
    });

    test('pie formated with percentage', function(done) {

      register.usePercentage = true;

      flush(function(){
        var value = getPieValues(register);

        assert.equal(value.value,'12');
        assert.equal(value.unit,'%');
        done();
      });
    });
  });

// ############################################################################
// ############################################################################

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
      let series = Polymer.dom(dashPattern.root).querySelectorAll('px-vis-register-item'),

          color0 = getColor(0),
          color1 = getColor(1),

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

// ############################################################################
// ############################################################################

  suite('px-vis-register displays only y', function() {
    var register;

    suiteSetup(function(done) {
      register = document.getElementById('yOnly');
      var data = generateOrdinalDataValues( generateEmptyData(2) );
      register.setProperties({
        displayYValuesOnly: true,
        displayOrdinalValue: true
      });
      setData(register, data);
      window.setTimeout(function() {
        done();
      }, 150);
    });

    test('onlyY fixtures are created', function() {
      assert.isTrue(register !== null);
    });

    test('onlyY doesnt show date', function() {
      assert.isNull(Polymer.dom(register.root).querySelector('px-vis-register-datetime'));
    });

    test('onlyY formated', function() {
      var series = Polymer.dom(register.root).querySelector('px-vis-register-item');
      assert.equal(series._displayedData, '1,015.20 yUnit');
    });

    test('onlyY displays ordinal set', function() {
      var set = Polymer.dom(register.root).querySelector('#ordinalSet');
      assert.equal(set.textContent.trim(), 'StringyString');
      assert.isFalse(set.classList.contains('hide'));
    });
  });

  suite('px-vis-register displays bi-color bar when negativeColor is defined', function() {
    var register;

    suiteSetup(function(done) {
      register = document.getElementById('negative');
      var data = generateOrdinalDataValues( generateEmptyData(2) );

      data.completeSeriesConfig.series_0.negativeColor = 'rgb(255,0,0)';

      setData(register, data);
      window.setTimeout(function() {
        done();
      }, 150);
    });

    test('onlyY fixtures are created', function() {
      assert.isTrue(register !== null);
    });

    test('bi-color is correct', function() {
      var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item');

      assert.equal(Polymer.dom(series[0].root).querySelector('.seriesMarkerIcon').getAttribute('style').split(' ').join('').split(';')[0], 'background:linear-gradient(rgb(0,0,0)50%,rgb(255,0,0)50%)');
      assert.equal(Polymer.dom(series[1].root).querySelector('.seriesMarkerIcon').getAttribute('style').split(' ').join('').split(';')[0], 'background-color:' + getColor(1));
    });
  });
}

/*
################################################################################
######## BASIC TESTS ###########################################################
################################################################################
*/


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
      var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item');
      for(var i = 0; i < series.length; i++){
        assert.equal(Polymer.dom(series[i].root).querySelector('.seriesMarkerIcon').getAttribute('style').split(' ').join('').split(';')[0], 'background-color:' + getColor(i));
      }
    });

    test(registerID + ' doesnt show sorting container', function() {
      var set = Polymer.dom(register.root).querySelector('#sortingContainer');
      assert.isTrue(set.classList.contains('hide'));
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
      var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item');

      for(var i = 0; i < series.length; i++) {
        assert.equal(series[i]._displayedData, '1,015.20 yUnit');
      }
    });

    test(registerID + ' doesnt displays ordinal set', function() {
      var set = Polymer.dom(register.root).querySelector('#ordinalSet');
      assert.isTrue(set.classList.contains('hide'));
    });

    test(registerID + ' doesnt display page counts', function() {
      var pages = Polymer.dom(register.root).querySelectorAll('.textInfo');
      assert.isTrue(pages[0].parentNode.classList.contains('hide'));
      assert.isTrue(pages[2].parentNode.classList.contains('hide'));
    });

    test(registerID + ' doesnt display page arrows', function() {
      if(dir === 'vertical') {
        const pages = Polymer.dom(register.root).querySelector('#verticalPagnation');

        assert.isTrue(pages.classList.contains('hide'));
      } else {
        var pages = Polymer.dom(register.root).querySelectorAll('.paginateButton');
        assert.isTrue(pages[0].firstElementChild.classList.contains('hide'));
        assert.isTrue(pages[1].firstElementChild.classList.contains('hide'));

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
      var series = Polymer.dom(register.root).querySelector('px-vis-register-item');

      assert.equal(series._displayedData, '0 xUnit / 0 yUnit');
    });
  });
}

function generateEmptyData(num,str){
  var str = str || 'series_';
  var chartData = [];
  var dataObj = {
    time: null,
    series: [],
    seriesObj: {}
  };
  var seriesConfig = {};
  for(var i = 0; i < num; i++){
    var name = str + i;
    seriesConfig[name] = {
      name: name,
      color: getColor(i),
      x: 'x',
      y: 'y',
      xAxisUnit: 'xUnit',
      yAxisUnit: 'yUnit'
    };

    dataObj.series[i] = {
      name: name,
      value: null
    };
  }

  return { 'data':dataObj,'completeSeriesConfig':seriesConfig };
}

function generateDataValues(data) {
  data.data.time = new Date('Sat Dec 20 2014 00:37:47 GMT-0800 (PST)');

  for(var i = 0; i < data.data.series.length; i++) {
    const n = data.data.series[i]['name'];
    const v = {
      x: Number(data.data.time),
      y: 1015.2
    };

    data.data.series[i]['value'] = v;
    data.data.seriesObj[n] = { value: v};
  }
  return data;
}

function generateOrdinalDataValues(data) {
  let v = {
    x: 'StringyString',
    y: 1015.2
  };
  data.data.ordinalSet = 'StringyString';
  for(var i = 0; i < data.data.series.length; i++) {
    const n = data.data.series[i]['name'];
    data.data.series[i]['value'] = v;
    data.data.seriesObj[n] = { value: v};
  }
  return data;
}

function generatePieDataValues(data) {
  let v = {
    x:  1015.2,
    y: 'somestring',
    percentage: 12
  };

  for(var i = 0; i < data.data.series.length; i++){
    const n = data.data.series[i]['name'];
    data.data.series[i] = v;
    data.data.seriesObj[n] = { value: v};
  }
  return data;
}

function setData(series, data, done){
  series.set('completeSeriesConfig',data.completeSeriesConfig);
  series.set('tooltipData',data.data);
  series.set('chartData',data.data.series);

  // pause and let the dom repeate chug away
  window.setTimeout(function() {
    if(done) { done(); }
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

function getColor(i) {
  const colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
  let l = colorSet.length,
      index = _calcIndex(i,l);

  return colorSet[ index ];
}

function _calcIndex(i, l) {
  return i < l ? i : this._calcIndex(i - l,l);
}

function getPieValues(register) {
  var series = Polymer.dom(register.root).querySelectorAll('px-vis-register-item-pie'),
      seriesData,
      value,
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

  value = seriesData.querySelector('span').textContent.trim();


  return {
    'value': value,
    'unit': unit
  }
}