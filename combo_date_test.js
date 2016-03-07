function create_date_form(base) {
  var container = document.createElement("span"),
    year = document.createElement("input"),
    month = document.createElement("select"),
    day = document.createElement("select");

  container.appendChild(year);
  container.appendChild(month);
  container.appendChild(day);

  // set ids
  container.setAttribute('id', base);
  year.setAttribute('id', base + '_year');
  month.setAttribute('id', base + '_month');
  day.setAttribute('id', base + '_day');

  // Prepare year
  year.setAttribute('size', 4);

  // Prepare month
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec'];
  {
    var option = document.createElement("option");
    option.setAttribute('value', '');
    option.setAttribute('disabled', 'disabled');
    option.textContent = '- Month -';
    month.appendChild(option);
  }
  for (var i=0; i<months.length; i++) {
    var option = document.createElement("option");
    option.setAttribute('value', i+1);
    option.textContent = months[i];
    month.appendChild(option);
  }
  month.value = '';

  // Prepare days
  {
    var option = document.createElement("option");
    option.setAttribute('value', '');
    option.setAttribute('disabled', 'disabled');
    option.textContent = '- Day -';
    day.appendChild(option);
  }
  for (var i=0; i<=31; i++) {
    var option = document.createElement("option");
    option.setAttribute('value', i);
    option.textContent = i;
    day.appendChild(option);
  }
  day.value = '';

  return container;
}

function test_essential_daymask(){
  var my_id = 'my_id', form = create_date_form(my_id);
  document.body.appendChild(form);
  var d = new ComboDate(my_id);

  // Set test value
  d.base_year.value = 2016;
  d.base_month.value = 2;
  d.base_month.onchange();

  // Check disable
  var res = [
    d.base_day.querySelector('option[value="29"]').disabled === false
      || 'Does not recognize bissextile years',
    d.base_day.querySelector('option[value="30"]').disabled === true
      || 'Does not disable not valid days',
    d.base_day.querySelector('option[value="4"]').disabled === false
      || 'Disables valid days',
  ].map(function(v, i) {return v === true ? '' : v}).join('');

  document.body.removeChild(form);
  return res;
}

function test_autoreset_day() {
  var my_id = 'my_id', form = create_date_form(my_id);
  document.body.appendChild(form);
  var d = new ComboDate(my_id);

  d.base_year.value = 2016;
  d.base_month.value = 2;
  d.base_month.onchange();
  d.base_day.value = 10;

  var tests = [];
  tests.push(d.base_day.value == 10);
  d.base_month.value = 3;
  d.base_month.onchange();
  tests.push(d.base_day.value == '');

  var res = tests.map(function(v, i) {return v === true ? '' : v}).join('');
  document.body.removeChild(form);
  return res;
}

function test_minmax(){
  var my_id = 'my_id', form = create_date_form(my_id);
  document.body.appendChild(form);
  var d = new ComboDate(my_id);

  // Set constraint
  d.base.dataset.min = "2016-05-07";
  d.base.dataset.max = "2016-09-15";

  // Set test value
  d.base_year.value = 2016;
  d.base_month.value = 2;
  d.base_month.onchange();

  // Checks
  var tests = [];

  // max constraint
  d.base_month.value = 9;
  d.base_month.onchange();
  d.base_day.value = 16;

  tests.push(d.base_day.querySelector('option[value="16"]').disabled === true);
  tests.push(d.isValid() === false || 'Max constraint not respected.');
  tests.push(d.base_day.querySelector('option[value="15"]').disabled === false);

  // test disable on min
  d.base_month.value = 5;
  d.base_month.onchange();
  d.base_day.value = 6;

  tests.push(d.base_day.querySelector('option[value="6"]').disabled === true);
  tests.push(d.isValid() === false || 'Min constraint not respected.');
  tests.push(d.base_day.querySelector('option[value="7"]').disabled === false);


  // test valid
  d.base_month.value = 7;
  d.base_month.onchange();
  d.base_day.value = 8;

  tests.push(d.isValid() === true|| 'Valid date reported as not valid.' + d.error);

  var res = tests.map(function(v, i) {return v === true ? '' : v}).join('');
  document.body.removeChild(form);
  return res;
}
