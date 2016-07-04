(function() {
  var contributorFormEl = document.getElementById('contributor-form');
  var debetorsListEl = document.getElementById('debetors-list');
  var contributorsListEl = document.getElementById('contributors-list');
  var contributorNameFieldEl = document.getElementById('contributor-name-field');
  var contributorValueFieldEl = document.getElementById('contributor-value-field');
  var $contributorForm = $(contributorFormEl);
  var $debetorsList = $(debetorsListEl);
  var $contributorsList = $(contributorsListEl);
  var $contributorNameField = $(contributorNameFieldEl);
  var $contributorValueField = $(contributorValueFieldEl);
  
  $contributorForm.on('submit', handleContributorFormSubmit);

  if (location.hash.indexOf('#') !== -1) {
    var hash = location.hash.substring(1);
    try {
      contributors.update(JSON.parse(_b64DecodeUnicode(hash)));
      redraw();
    } catch (e) {
      console.warn('Can\'t parse location hash.');
    }
  }

  function _round (value, exp) {
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math.round(value);
    }
    value = +value;
    exp = +exp;
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  function _b64EncodeUnicode (str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
  }

  function _b64DecodeUnicode (str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  function renderContributors () {
    var contributors = window.contributors.getAll();
    var html = contributors.map(function (item, index) {
      return '<div class="row">'
        +'  <div class="column small-5">'+item.name+'</div>'
        +'  <div class="column small-5"><input class="js-contributor-item-value-field" data-contributor-index="'+index+'" type="number" value="'+item.value+'" /></div>'
        +'  <div class="column small-2"><button class="js-contributor-item-remove-btn button expanded" data-contributor-index="'+index+'" class="button">&times;</button></div>'
        +'</div>';
    }).join('');
    $contributorsList.html(html);
    $contributorsList.find('.js-contributor-item-value-field').on('change', handleContributorItemFieldChange);
    $contributorsList.find('.js-contributor-item-remove-btn').on('click', handleContributorRemoveBtnClick);
  }

  function renderDebetors () {
    var debetors = window.contributors.getDebetors();
    var html = debetors.map(function (item) {
      return '<div class="row">'
        +'  <div class="column small-4"><strong>'+item.from+'</strong></div>'
        +'  <div class="column small-1 text-right">&rarr;</div>'
        +'  <div class="column small-5"><strong>'+item.to+'</strong></div>'
        +'  <div class="column small-2 text-center"><strong>'+_round(item.value, -2)+'</strong></div>'
        +'</div>';
    }).join('');
    $debetorsList.html(html);
  }

  function handleContributorFormSubmit (event) {
    event.preventDefault();
    var name = $contributorNameField.val();
    var value = parseFloat($contributorValueField.val());
    if (! name || ! value) {
      alert('Имя и Сумма - обязательно должны быть заполнены!');
      return;
    }
    window.contributors.add(name, value);
    redraw();
    $contributorNameField.val('');
    $contributorValueField.val('');
    $contributorNameField.focus();
  }

  function handleContributorItemFieldChange (event) {
    var $field = $(event.target);
    var index = parseInt($field.attr('data-contributor-index'), 10);
    window.contributors.set(index, parseFloat($field.val()));
    redraw();
  }

  function handleContributorRemoveBtnClick (event) {
    event.preventDefault();
    var $btn = $(event.target);
    var index = parseInt($btn.attr('data-contributor-index'), 10);
    window.contributors.remove(index);
    redraw();
  }

  function redraw () {
    renderContributors();
    renderDebetors();
    location.href = '#' + _b64EncodeUnicode(JSON.stringify(contributors.getAll()));
  }
})();
