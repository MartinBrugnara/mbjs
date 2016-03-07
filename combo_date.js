/* Expected component's id tree layout:
 * - base
 * + - base_year
 * + - base_month
 * + - base_day
 *
 * If base_day is a <select>, non valid options will be disabled:
 * e.g.: base_month == Feb, base_day.(29,30,31)
 *
 * Supported validation attributes (on base):
 * - min, max (inclusive)
 * - required
 *
 * It fires onchange event on base when the date changes.
 */


function ComboDate(base_id) {
  "use strict";

  // Internal state
  this.error = '';

  // Bind item
  this.base_id = base_id;
  this.base = document.getElementById(this.base_id);
  this.base_year = document.getElementById(this.base_id + '_year');
  this.base_month = document.getElementById(this.base_id + '_month');
  this.base_day = document.getElementById(this.base_id + '_day');

  // Define basic function
  // Return JavaScript Date object
  this.getValue = function() {
    return new Date(
        this.base_year.value + '-' +
        (this.base_month.value < 10 ? '0' : '') + this.base_month.value + '-' +
        (this.base_day.value < 10 ? '0' : '') + this.base_day.value);
  }

  // Set the date, require Date object.
  this.setValue = function(value) {
    this.base_year.value = value.getFullYear();
    this.base_month.value = value.getMonth() + 1;
    this.base_day.value = value.getDate();
  }

  // True if it is a valid Data and respects the constraints.
  // False otherwise.
  //    Set this.error.
  this.isValid = function() {
    // Check if the date it self is valid
    var current = this.getValue();
    if (isNaN(current.getTime())) {
      this.error = 'Not a valid data'
      return false;
    }

    // Check constraint, if any.
    var max = this.getMax();
    if (max !== undefined && !isNaN(max) && current > max) {
        this.error = 'Unacceptable date: too late.';
        return false;
    }

    var min = this.getMin();
    if (min !== undefined && !isNaN(min) && current < min) {
        this.error = 'Unacceptable date: too early.';
        return false;
    }

    this.error = '';
    return true;
  }

  this.getMax = function() {
    var max_str = this.base.dataset.max, max;
    if (max_str !== undefined) {
      max = new Date(max_str);
      if (isNaN(max)) console.error(this.base.attr.id, "Max date is not valid.", max);
    }
    return max;
  }

  this.getMin = function() {
    var min_str = this.base.dataset.min, min;
    if (min_str !== undefined) {
      min = new Date(min_str);
      if (isNaN(min)) console.error(this.base.attr.id, "Min date is not valid.", min);
    }
    return min;
  }

  // Pruning display options
  this.base_pruning = function() {
    var min = this.getMin(), max = this.getMax(), months = [];

    if (min !== undefined && !isNaN(min)) {
      for (var i=0; i < min.getMonth(); i++)
        months.push('option[value="' + (i+1) + '"]');
    }

    if (max !== undefined && !isNaN(max)) {
      for (var i=11; i > max.getMonth(); i--)
        months.push('option[value="' + (i+1) + '"]');
    }

    if (months.length === 0) return;

    var month_options = this.base_month.querySelectorAll(months.join(', '));
    for (var i=0; i<month_options.length; i++) month_options[i].disabled = true;
  }

  this.on_month_change = function() {
    var that = this;
    return function (_) {
      var year = parseInt(that.base_year.value),
        month = parseInt(that.base_month.value);

      // reset:
      {
        var day_options = that.base_day.querySelectorAll('option:not([value=""]');
        for (var i=0; i<day_options.length; i++) day_options[i].disabled = false;
        that.base_day.value = '';
      }

      // Check precondition
      if (isNaN(year) || isNaN(month)) return;

      // Respect constraint
      {
        var hiding_days = [], min = that.getMin(), max = that.getMax();

        // Min
        if (min !== undefined && !isNaN(min) && month == (min.getMonth() + 1)) {
          for (var i=0; i < min.getDate(); i++)
            hiding_days.push('option[value="' + i + '"]');
        }

        // Max & max #days in month
        var dmax = new Date(year, month, 0).getDate(); // max = day_in_month
        if (max !== undefined && !isNaN(max) && month == (max.getMonth() + 1)) {
          dmax = Math.min(dmax, max.getDate());
        }
        for (var i=31; i > dmax; i--)
          hiding_days.push('option[value="' + i + '"]');

        if (hiding_days.length) {
          var hiding_day_options =
            that.base_day.querySelectorAll(hiding_days.join(', '));
          for(var i=0; i<hiding_day_options.length; i++)
            hiding_day_options[i].disabled = true;
        }
      }
    }
  }

  this.init = function() {
    this.base_pruning();
    this.base_year.onchange = this.on_month_change();
    this.base_month.onchange = this.on_month_change();
  }

  this.init();
}
