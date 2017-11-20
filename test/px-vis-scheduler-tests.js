document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){

  suite('before init', function() {

    test('scheduler doesn\'t exist', function() {
      assert.isUndefined(window.Px);
    });
  }); //suite


  suite('init scheduler', function() {

    suiteSetup(function(done) {

      //setup a custom number of workers and point to the file manually
      window.addEventListener('px-vis-worker-init', function() {
        assert.deepEqual(Px.vis, {});
        Px.vis.maxWorkerCount = 3;
        Px.vis.workerUrl = '../px-vis-worker.js';
      });

      //when scheduler loaded initialize some data
      window.addEventListener('px-vis-worker-ready', function() {

        var count = 0,
            callBackCount = function(e) {
              count++;
              if(count === 4) {
                done();
              }
            };

        //register 4 datasets
        Px.vis.scheduler.process({
          'action' : 'updateData',
          'originatorName' : 'aChart',
          'data' : {'chartData': [1,2,3]},
          'chartId': 'chartId1',
          'successCallback': callBackCount});
        Px.vis.scheduler.process({
          'action' : 'updateData',
          'originatorName' : 'aChart',
          'data' : {'chartData': [1,2,3,4]},
          'chartId': 'chartId2',
          'successCallback': callBackCount});
        Px.vis.scheduler.process({
          'action' : 'updateData',
          'originatorName' : 'aChart',
          'data' : {'chartData': [1,2,3,4,5]},
          'chartId': 'chartId3',
          'successCallback': callBackCount});
        Px.vis.scheduler.process({
          'action' : 'updateData',
          'originatorName' : 'aChart',
          'data' : {'chartData': [1,2,3,4,5,6]},
          'chartId': 'chartId4',
          'successCallback': callBackCount});
      });

      //load the scheduler
      Polymer.Base.importHref('../px-vis-scheduler.html');
    });

    test('3 web workers', function() {
      assert.equal(Px.vis.scheduler.workers.length, 3);
    });

    test('chart datas spread on different workers', function() {
      assert.equal(Px.vis.scheduler.chartWorkerMapping['chartId1'], 0);
      assert.equal(Px.vis.scheduler.chartWorkerMapping['chartId2'], 1);
      assert.equal(Px.vis.scheduler.chartWorkerMapping['chartId3'], 2);
      assert.equal(Px.vis.scheduler.chartWorkerMapping['chartId4'], 0);
    });

    test('workers are registered as having data', function() {
      assert.equal(Px.vis.scheduler.hasChartData['chartId1'], true);
      assert.equal(Px.vis.scheduler.hasChartData['chartId2'], true);
      assert.equal(Px.vis.scheduler.hasChartData['chartId3'], true);
      assert.equal(Px.vis.scheduler.hasChartData['chartId4'], true);
    });
  });

   suite('running actions on chart with unregistered data', function() {

    var hasRun = false;

    suiteSetup(function() {

      Px.vis.scheduler.process(
        {
          'action' : 'unexistingAction',
          'originatorName' : 'aChart',
          'data' : {},
          'chartId': 'chartId5',
          'successCallback': function() {
        hasRun = true;
      }});
    });

    test('funciton didn\'t run', function() {

      assert.isFalse(hasRun);
    });

    test('chart has been assigned a ww', function() {
      assert.equal(Px.vis.scheduler.chartWorkerMapping['chartId5'], 1);
      assert.isUndefined(Px.vis.scheduler.hasChartData['chartId5']);
    });

    test('action has been queued', function() {

      assert.equal(Px.vis.scheduler.queue[1].length, 1);
      assert.equal(Px.vis.scheduler.queue[1][0].action, 'unexistingAction');
    });

    test('after registering data the action is processed', function() {

      Px.vis.scheduler.process({
          'action' : 'updateData',
          'originatorName' : 'aChart',
          'data' : {'chartData': [1,2,3,4,5,6,7]},
          'chartId': 'chartId5',
          'successCallback': function() {
            //action has been dequeued
            assert.equal(Px.vis.scheduler.queue[1].length, 0);
          }});
    });

    test('initial action has been run', function(done) {

      window.setTimeout(function() {
        assert.isTrue(hasRun);
        done();
      }, 500);
    });

    test('starting an action fires event', function(done) {

      var handler = function(e) {
        //this should be called before our error callback
        assert.equal(e.detail.action, 'unexistingAction');
        assert.equal(e.detail.originatorName, 'aChart');
        assert.equal(e.detail.chartId, 'chartId5');
        assert.deepEqual(e.detail.data, {});
      };

      window.addEventListener('px-vis-scheduler-work-start', handler);
      Px.vis.scheduler.process({
          'action' : 'unexistingAction',
          'originatorName' : 'aChart',
          'data' : {},
          'chartId': 'chartId5',
          'successCallback': function() {
            window.removeEventListener('px-vis-scheduler-work-start', handler);
            done();
          }});
    });
  });

  suite('Custom scripts', function() {

    suiteSetup(function(done) {

      Px.vis.scheduler.registerCustomScript('test/test-worker.js', function() {
        done();
      });
    });

    // test('load unexisting script', function(done) {
    //   try {
    //     Px.vis.scheduler.registerCustomScript('dummyUrl', null, function() {
    //       done();
    //     });
    //   } catch(e) {

    //     //some browsers
    //     done();
    //   }
    // });

    test('run function on undefined object trigger error event and callback', function(done) {

      var handler = function(e) {
        //this should be called before our error callback
        assert.equal(e.detail.action, 'runCustomFunction');
        assert.equal(e.detail.originatorName, 'aChart');
        assert.equal(e.detail.chartId, 'chartId1');
      };

      window.addEventListener('px-vis-scheduler-work-error', handler);

      Px.vis.scheduler.process({
          'action' : 'runCustomFunction',
          'originatorName' : 'aChart',
          'data' : {'objectName': 'myScriapt', 'functionName': 'dataLength'},
          'chartId': 'chartId1',
          'errorCallback': function() {
            window.removeEventListener('px-vis-scheduler-work-error', handler);
            done();
          }});
    });

    test('run custom function trigger success event and callback', function(done) {

      var handler = function(e) {
        //this should be called before our error callback
        assert.equal(e.detail.action, 'runCustomFunction');
        assert.equal(e.detail.originatorName, 'aChart');
        assert.equal(e.detail.chartId, 'chartId1');
        assert.equal(e.detail.data, 3);
      };

      window.addEventListener('px-vis-scheduler-work-end', handler);

      Px.vis.scheduler.process({
        'action': 'runCustomFunction',
        'originatorName' : 'aChart',
        'data': {'objectName': 'myScript', 'functionName': 'dataLength'},
        'chartId': 'chartId1',
        'successCallback': function() {
          window.removeEventListener('px-vis-scheduler-work-end', handler);
          done();
        }});
    });

    test('run custom function against several datasets', function(done) {

      var counter = 0;
      Px.vis.scheduler.process({
          'action' : 'runCustomFunction',
          'originatorName' : 'aChart',
          'data' : {'objectName': 'myScript', 'functionName': 'dataLength'},
          'chartId': 'chartId1',
          'successCallback': function(e) {
            assert.equal(e.data, 3);
            counter++;
            if(counter === 4) {
              done();
            }
          }});
      Px.vis.scheduler.process({
          'action' : 'runCustomFunction',
          'originatorName' : 'aChart',
          'data' : {'objectName': 'myScript', 'functionName': 'dataLength'},
          'chartId': 'chartId2',
          'successCallback': function(e) {
            assert.equal(e.data, 4);
            counter++;
            if(counter === 4) {
              done();
            }
          }});
      Px.vis.scheduler.process({
          'action' : 'runCustomFunction',
          'originatorName' : 'aChart',
          'data' : {'objectName': 'myScript', 'functionName': 'dataLength'},
          'chartId': 'chartId3',
          'successCallback': function(e) {
            assert.equal(e.data, 5);
            counter++;
            if(counter === 4) {
              done();
            }
          }});
      Px.vis.scheduler.process({
          'action' : 'runCustomFunction',
          'originatorName' : 'aChart',
          'data' : {'objectName': 'myScript', 'functionName': 'dataLength'},
          'chartId': 'chartId4',
          'successCallback': function(e) {
            assert.equal(e.data, 6);
            counter++;
            if(counter === 4) {
              done();
            }
          }});
    });
  });


  suite('Register custom data', function() {

    var data = [{'blah': 'blouh'}, {'zlop': 'glob'}];

    suiteSetup(function() {    });test('update custom data', function(done) {

      Px.vis.scheduler.process({
          'action' : 'updateData',
          'originatorName' : 'aChart',
          'data' : {'chartData': data},
          'chartId': 'custom',
          'successCallback': function() {done()}});
    });

    test('retrieve custom data', function(done) {

      Px.vis.scheduler.process({
          'action' : 'runCustomFunction',
          'originatorName' : 'aChart',
          'data' : {'objectName': 'myScript', 'functionName': 'returnData'},
          'chartId': 'custom',
          'successCallback': function(e) {
            assert.deepEqual(e.data, data);
            done();
          }});
    });

  });

    suite('queueing several same request', function() {

    test('queuing 4 requests, only 2 running', function(done) {

      var counter = 0,
          callback = function(e) {
            counter++;
            if(counter >= 2) {

              //ensure the last result was the last request which asks for
              //length rather than data
              assert.equal(e.data, 2);
              done();
            }
          };

      Px.vis.scheduler.process({
          'action' : 'runCustomFunction',
          'originatorName' : 'aChart',
          'data' : {'objectName': 'myScript', 'functionName': 'returnData'},
          'chartId': 'custom',
          'successCallback': callback});
      Px.vis.scheduler.process({
          'action' : 'runCustomFunction',
          'originatorName' : 'aChart',
          'data' : {'objectName': 'myScript', 'functionName': 'returnData'},
          'chartId': 'custom',
          'successCallback': callback});
      Px.vis.scheduler.process({
          'action' : 'runCustomFunction',
          'originatorName' : 'aChart',
          'data' : {'objectName': 'myScript', 'functionName': 'returnData'},
          'chartId': 'custom',
          'successCallback': callback});
      Px.vis.scheduler.process({
          'action' : 'runCustomFunction',
          'originatorName' : 'aChart',
          'data' : {'objectName': 'myScript', 'functionName': 'dataLength'},
          'chartId': 'custom',
          'successCallback': callback});
    });
  });

//   Px.vis.scheduler.registerCustomScript('test-worker.js', function() {
//   console.log('script loaded');
//   Px.vis.scheduler.process('runCustomFunction', 'dummy', {'objectName': 'myScript', 'functionName': 'test'}, $0.chartId, function(data) {
//     console.log('data length: ' + e.data.data);
//   });
// });
} //runTests
