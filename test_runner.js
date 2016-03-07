function run_tests() {
  "use strict";
  document.write('<pre>');
  document.write('Starting tests\n');

  // Get functions name
  var funcs = [];
  for (var l in window){
    if (window.hasOwnProperty(l) &&
        window[l] instanceof Function &&
        !/funcs/i.test(l)){
      funcs.push(l);
    }
  }

  // Iterate over tests
  var test_result = funcs
    .filter(function(fname){return fname.startsWith('test_')})
    .map(function(fname){
      var pass = window[fname]();
      if (pass === undefined) return false;
      else if (pass.length == 0) document.write('Pass: ' + fname + '\n');
      else document.write('Fail: ' + fname + '\n\t' + pass + '\n');
      return pass.length == 0;
    })
    .reduce(function(acc, x){return acc && x}, true);

  document.write('\n');
  if (test_result) document.write('SUCCESS: All test passed\n');
  else document.write('FAILED: Some test failed\n');
  document.write('</pre>');
}
