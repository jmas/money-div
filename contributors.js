(function () {
  var _items = [];

  function add (name, value) {
    _items.push({
      name: name,
      value: value
    });
  }

  function set (index, value) {
    _items[index].value = value;
  }

  function update (items) {
    _items = items;
  }

  function remove (index) {
    _items.splice(index, 1);
  }

  function getAll () {
    return _items;
  }

  function getDebetors () {
    var totalValue = 0,
        equalPayment = 0,
        _debetors = [], _lenders = [],
        lender = null, debtor = null,
        debetors = [], delta = 0;
    totalValue = _items.reduce(function (p,c) { return p + c.value; }, 0);
    equalPayment = totalValue/_items.length;
    var temp = _items.map(function (item) { return { name: item.name, value: equalPayment - item.value }; });
    _debetors = temp.filter(function (item) { return item.value > 0; });
    _lenders = temp.filter(function (item) { return item.value < 0; });
    lender = _lenders[0];
    debtor = _debetors[0];
    while (_lenders.length > 0 && _debetors.length > 0) {
      lender = lender || _lenders[0];
      debtor = debtor || _debetors[0];
      delta = debtor.value + lender.value;
      if (delta < 0) {
        debetors.push({
          from: debtor.name,
          to: lender.name,
          value: debtor.value
        });
        lender.value += debtor.value;
        debtor.value = 0;
      } else {
        debetors.push({
          from: debtor.name,
          to: lender.name,
          value: -lender.value
        });
        debtor.value += lender.value;
        lender.value = 0;
      }
      if (debtor.value === 0) {
        _debetors.splice(0, 1);
        debtor = null;
      }
      if (lender.value === 0) {
        _lenders.splice(0, 1);
        lender = null;
      }
      delta = 0;
    }
    return debetors;
  }

  window.contributors = {
    getAll: getAll,
    add: add,
    set: set,
    update: update,
    remove: remove,
    getDebetors: getDebetors
  };
})();
