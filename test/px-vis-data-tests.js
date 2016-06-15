document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-data does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-data appendAjax setup works', function() {
    var appendAjax = document.getElementById('appendAjax');
    var ironAjax = null;
    var eventObj = null;

    suiteSetup(function(done){
      var d = [
        {
          "type":"scatter",
          "name":"blahblah",
          "axis":"axis1",
          "url":"test_data/delta-egt-cruise.json"
        },{
          "url":"test_data/hpt-acc-position-cruise.json",
        }
      ];

      document.addEventListener('px-vis-data-updated',function(evt){
        eventObj = evt.detail;
        // doh...ajax comes in async, so check that it matches the order we expect for our tests
        console.warn(eventObj.data[0].seriesNumber);
        console.warn(typeof(eventObj.data[0].seriesNumber));
        if(eventObj.data[0].seriesNumber !== '0'){
          eventObj.data.reverse();
        }
      });

      appendAjax.set('requestData',d);

      setTimeout(function(){
        ironAjax = appendAjax.querySelectorAll('iron-ajax');
        done()
      },1000);
      // done();
    });

    test('appendAjax fixture is created', function() {
      assert.isTrue(appendAjax !== null);
    });
    test('appendAjax iron-ajaxes created', function() {
      assert.equal(ironAjax.length, 2);
    });

    test('appendAjax iron-ajax 1 url', function() {
      assert.equal(ironAjax[0].url, "test_data/delta-egt-cruise.json");
    });
    test('appendAjax iron-ajax 1 type', function() {
      assert.equal(ironAjax[0].getAttribute('type'), "scatter");
    });
    test('appendAjax iron-ajax 1 name', function() {
      assert.equal(ironAjax[0].getAttribute('name'), "blahblah");
    });
    test('appendAjax iron-ajax 1 axis', function() {
      assert.equal(ironAjax[0].getAttribute('axis'), "axis1");
    });
    test('appendAjax iron-ajax 1 index', function() {
      assert.equal(ironAjax[0].getAttribute('index'), 0);
    });

    test('appendAjax iron-ajax 2 url', function() {
      assert.equal(ironAjax[1].url, "test_data/hpt-acc-position-cruise.json");
    });
    test('appendAjax iron-ajax 2 type', function() {
      assert.equal(ironAjax[1].getAttribute('type'), null);
    });
    test('appendAjax iron-ajax 2 name', function() {
      assert.equal(ironAjax[1].getAttribute('name'), null);
    });
    test('appendAjax iron-ajax 2 axis', function() {
      assert.equal(ironAjax[1].getAttribute('axis'), null);
    });
    test('appendAjax iron-ajax 2 index', function() {
      assert.equal(ironAjax[1].getAttribute('index'), 1);
    });

    test('event fired', function() {
      assert.isTrue(eventObj !== null);
    });
    test('event dataVar', function() {
      assert.equal(eventObj.dataVar, 'appendedDataSet');
    });
    test('event method', function() {
      assert.equal(eventObj.method, 'set');
    });
    test('event data exists and is an array', function() {
      assert.isTrue(Array.isArray(eventObj.data));
    });
    test('event data exists and is the correct length', function() {
      assert.equal(eventObj.data.length,2);
    });

    test('event data 1 name', function() {
      assert.equal(eventObj.data[0].name, 'blahblah');
    });
    test('event data 1 type', function() {
      assert.equal(eventObj.data[0].type, 'scatter');
    });
    test('event data 1 seriesNumber', function() {
      assert.equal(eventObj.data[0].seriesNumber, 0);
    });
    test('event data 1 axis', function() {
      assert.equal(eventObj.data[0]['axis'], 'axis1');
    });
    test('event data 1 series is array', function() {
      assert.isTrue(Array.isArray(eventObj.data[0].series));
    });
    test('event data 1 series length', function() {
      assert.equal(eventObj.data[0].series.length,646);
    });
    test('event data 1 series[0]', function() {
      assert.equal(JSON.stringify(eventObj.data[0].series[0]),'[1397102460000,11.4403]');
    });

    test('event data 2 name is default', function() {
      assert.equal(eventObj.data[1].name, 'hpt-acc-position-cruise');
    });
    test('event data 2 type is default', function() {
      assert.equal(eventObj.data[1].type, 'line');
    });
    test('event data 2 seriesNumber', function() {
      assert.equal(eventObj.data[1].seriesNumber, 1);
    });
    test('event data 2 axis is default', function() {
      assert.equal(eventObj.data[1]['axis'], '');
    });
    test('event data 2 series is array', function() {
      assert.isTrue(Array.isArray(eventObj.data[1].series));
    });
    test('event data 2 series length', function() {
      assert.equal(eventObj.data[1].series.length,694);
    });
    test('event data 2 series[0]', function() {
      assert.equal(JSON.stringify(eventObj.data[1].series[0]),'[1397102460000,96.5]');
    });
  }); //suite

  suite('px-vis-data flatAjax setup works', function() {
    var flatAjax = document.getElementById('flatAjax');
    var ironAjax = null;
    var eventObj = null;

    suiteSetup(function(done){
      var d = [{
        "url":"test_data/delta-egt-cruise-events.json"
      },{
        "url":"test_data/delta-egt-cruise-thresholds.json"
      }];

      document.addEventListener('px-vis-data-updated',function(evt){
        eventObj = evt.detail;
        // doh...ajax comes in async, so check that it matches the order we expect for our tests
        if(eventObj.data[0]['id'] !== '123'){
          eventObj.data.reverse();
        }
      });

      flatAjax.set('requestData',d);

      setTimeout(function(){
        ironAjax = flatAjax.querySelectorAll('iron-ajax');
        done()
      },1000);
      // done();
    });

    test('flatAjax fixture is created', function() {
      assert.isTrue(flatAjax !== null);
    });
    test('flatAjax iron-ajaxes created', function() {
      assert.equal(ironAjax.length, 2);
    });

    test('flatAjax iron-ajax 1 url', function() {
      assert.equal(ironAjax[0].url, "test_data/delta-egt-cruise-events.json");
    });
    test('flatAjax iron-ajax 1 type', function() {
      assert.equal(ironAjax[0].getAttribute('type'), null);
    });
    test('flatAjax iron-ajax 1 name', function() {
      assert.equal(ironAjax[0].getAttribute('name'), null);
    });
    test('flatAjax iron-ajax 1 axis', function() {
      assert.equal(ironAjax[0].getAttribute('axis'), null);
    });
    test('flatAjax iron-ajax 1 index', function() {
      assert.equal(ironAjax[0].getAttribute('index'), 0);
    });

    test('flatAjax iron-ajax 2 url', function() {
      assert.equal(ironAjax[1].url, "test_data/delta-egt-cruise-thresholds.json");
    });
    test('flatAjax iron-ajax 2 type', function() {
      assert.equal(ironAjax[1].getAttribute('type'), null);
    });
    test('flatAjax iron-ajax 2 name', function() {
      assert.equal(ironAjax[1].getAttribute('name'), null);
    });
    test('flatAjax iron-ajax 2 axis', function() {
      assert.equal(ironAjax[1].getAttribute('axis'), null);
    });
    test('flatAjax iron-ajax 2 index', function() {
      assert.equal(ironAjax[1].getAttribute('index'), 1);
    });

    test('event fired', function() {
      assert.isTrue(eventObj !== null);
    });
    test('event dataVar', function() {
      assert.equal(eventObj.dataVar, 'flattenedDataSet');
    });
    test('event method', function() {
      assert.equal(eventObj.method, 'set');
    });
    test('event data exists and is an array', function() {
      assert.isTrue(Array.isArray(eventObj.data));
    });
    test('event data exists and is the correct length', function() {
      assert.equal(eventObj.data.length,8);
    });

    test('event data [0] id', function() {
      assert.equal(eventObj.data[0]['id'],'123');
    });
    test('event data [0] time', function() {
      assert.equal(eventObj.data[0]['time'],1424803620000);
    });
    test('event data [0] time', function() {
      assert.equal(eventObj.data[0]['label'],'Recalibrate');
    });

    test('event data [5] id', function() {
      assert.equal(eventObj.data[5]['id'],'456');
    });
    test('event data [5] time', function() {
      assert.equal(eventObj.data[5]['time'],1415286720000);
    });
    test('event data [5] time', function() {
      assert.equal(eventObj.data[5]['label'],'Fan start');
    });
  }); //suite
} //runTests
