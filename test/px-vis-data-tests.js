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
          "url":"/bower_components/px-demo-data/demo-data/aviation/delta-egt-cruise.json"
        },{
          "url":"/bower_components/px-demo-data/demo-data/aviation/hpt-acc-position-cruise.json",
        }
      ];

      document.addEventListener('px-vis-data-updated',function(evt){
        eventObj = evt.detail;
      });

      appendAjax.set('requestData',d);

      setTimeout(function(){
        ironAjax = appendAjax.querySelectorAll('iron-ajax');
        done()
      },100);
      // done();
    });

    test('appendAjax fixture is created', function() {
      assert.isTrue(appendAjax !== null);
    });
    test('appendAjax iron-ajaxes created', function() {
      assert.equal(ironAjax.length, 2);
    });

    test('appendAjax iron-ajax 1 url', function() {
      assert.equal(ironAjax[0].url, "/bower_components/px-demo-data/demo-data/aviation/delta-egt-cruise.json");
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
      assert.equal(ironAjax[1].url, "/bower_components/px-demo-data/demo-data/aviation/hpt-acc-position-cruise.json");
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
      console.warn(eventObj.data[0])
      assert.equal(eventObj.data[0]['axis'], 'axis1');
    });
    test('event data 1 series is array', function() {
      assert.isTrue(Array.isArray(eventObj.data[0].series));
    });
    test('event data 1 series length', function() {
      assert.equal(eventObj.data[0].series.length,646);
    });
    test('event data 1 series length', function() {
      assert.equal(JSON.stringify(eventObj.data[0].series[0]),'[1397102460000,11.4403]');
    });


  });
} //runTests
