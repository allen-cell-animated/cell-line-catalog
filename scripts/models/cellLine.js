(function(module) {
  function CellLine (opts) {
    for (var key in opts) {
      this[key] = opts[key];
    }
  }

  CellLine.allCellLines = [];
  CellLine.allCellLinesFB = [];

  CellLine.prototype.toHtml= function(templateid){
    var source = $(templateid).html();
    var renderTemplate = Handlebars.compile(source);
    return renderTemplate(this);
  };

  CellLine.loadIntoObjectArray = function(name){
    var retreivedData =  JSON.parse(localStorage.getItem(name));
    CellLine.allCellLines = retreivedData.sort().map(function(ele){
      return new CellLine(ele);
    });
  };

  CellLine.fetchAll = function(url, name, loadDataintoArray, renderDatatoDOM) {
    $.get(url, function(data, message, xhr) {
      localStorage.setItem(name, JSON.stringify(data));
      localStorage['eTag' + name] = xhr.getResponseHeader('eTag');
      loadDataintoArray(name);
      renderDatatoDOM();
    });
  };

  CellLine.updateData = function(url, name, loadDataintoArray, renderDatatoDOM) {
    if (!localStorage[name]) {
      CellLine.fetchAll(url, name, loadDataintoArray, renderDatatoDOM);
    }
    else{
      $.ajax({
        type: 'HEAD',
        url: url,
        success: function(data, message, xhr){
          var newTag = xhr.getResponseHeader('eTag');
          if (newTag !== localStorage['eTag' + name]){
            CellLine.fetchAll(url, name, loadDataintoArray, renderDatatoDOM);
          } //end of if
          else {
            loadDataintoArray(name);
            renderDatatoDOM();
          }
        } //end of success
      });  //end of ajax
    };
  };

  CellLine.allTagLocations = function() {
    return CellLine.allCellLines.map(function(currentCellLine) {
      return currentCellLine.Main_terminal_tagged;
    }).filter(function(element, index, array){
      return array.indexOf(element)===index;
    });
  };

  CellLine.allFluorophores = function() {
    return CellLine.allCellLines.map(function(currentCellLine) {
      return currentCellLine.Main_fluorescent_tag;
    }).filter(function(element, index, array){
      return array.indexOf(element)===index;
    });
  };


  module.CellLine = CellLine;
})(window);
