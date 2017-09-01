(function(module) {
  function CellLine (opts) {
    for (var key in opts) {
      this[key] = opts[key];
    }
    this.displayID = Number(opts.cell_line_id.split('-')[1])
    if (opts.alleleCount === 'bi') {
      this.thumbnailimage = 'single_plane_image_bi.jpg'
    } else {
      this.thumbnailimage = 'single_plane_image.jpg'
    }
  }

  CellLine.allCellLines = [];
  CellLine.allCellLinesFB = [];

  CellLine.prototype.toHtml= function(templateid){
    var source = $(templateid).html();
    var renderTemplate = Handlebars.compile(source);
    return renderTemplate(this);
  };

  CellLine.prototype.nestedToHtml= function(templateid, nestedObj){
    var source = $(templateid).html();
    var renderTemplate = Handlebars.compile(source);
    return renderTemplate(nestedObj);
  };

  CellLine.loadIntoObjectArray = function(name){
    var retreivedData =  JSON.parse(localStorage.getItem(name));
    CellLine.allCellLines = retreivedData.sort(function(a, b){return a.cell_line_id.split('-')[1] - b.cell_line_id.split('-')[1];}).map(function(ele){
      return new CellLine(ele);
    });
  };

  CellLine.fetchAll = function(url, name, callback) {
    $.get(url, function(data, message, xhr) {
      localStorage.setItem(name, JSON.stringify(data));
      localStorage['eTag' + name] = xhr.getResponseHeader('eTag');
      CellLine.loadIntoObjectArray(name);
      callback();
    });
  };

  CellLine.updateData = function(url, name, callback) {
    if (!localStorage[name]) {
      CellLine.fetchAll(url, name, callback);
    }
    else{
      $.ajax({
        type: 'HEAD',
        url: url,
        success: function(data, message, xhr){
          var newTag = xhr.getResponseHeader('eTag');
          if (newTag !== localStorage['eTag' + name]){
            CellLine.fetchAll(url, name, callback);
          } //end of if
          else {
            CellLine.loadIntoObjectArray(name);
            callback();
          }
        } //end of success
      });  //end of ajax
    };
  };

  CellLine.allInCategory = function(category) {
    return CellLine.allCellLines.map(function(currentCellLine) {
      return currentCellLine[category];
    }).filter(function(element, index, array){
      return array.indexOf(element)===index;
    });
  };


  module.CellLine = CellLine;
})(window);
