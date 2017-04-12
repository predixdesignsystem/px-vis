





function reply(webWorkerIndex, data) {

  if(data) {
    postMessage({'webWorkerIndex': webWorkerIndex, 'data': data});
  } else {
    postMessage({'webWorkerIndex': webWorkerIndex});
  }
}

onmessage = function(e) {

  switch(e.data.action) {
    case 'dummy':
      reply(e.data.webWorkerIndex);
      break;
  }
}
