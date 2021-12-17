(function(module) {
  function CellLine (opts) {
    for (var key in opts) {
      this[key] = opts[key];
    }
    this.displayID = Number(opts.cell_line_id.split('-')[1])
    var thumbnail = 'single_plane_image_cl'
    if (opts.backup === 'true') {
        this.displayClone = opts.clone_number.concat('**')
    }
    else {
        this.displayClone = opts.clone_number
    }
    this.thumbnailimage = thumbnail.concat(opts.clone_number, '.jpg')
  }

  CellLine.allCellLines = [];
  CellLine.allCellLinesFB = [];

  CellLine.prototype.toHtml= function(templateid){
      if (templateid.selector =="#cell-profile-info-template"){
          return CellLine.prototype.nestedToHtml(templateid, this);
      }
      else if (templateid.selector =="#cellList-template"){
          return CellLine.prototype.nestedToHtml(templateid, this);
      }

      var source = $(templateid).html();
      var renderTemplate = Handlebars.compile(source);
      return renderTemplate(this);
  };

  CellLine.prototype.nestedToHtml= function(templateid, nestedObj){
    var source = $(templateid).html();
    var renderTemplate = Handlebars.compile(source);
    var html = renderTemplate(nestedObj);

    // Using template to covert html to js element
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    finalElement = template.content.firstChild;

    // Populate Gene Symbol Text entry
    if (finalElement instanceof Element) {
      var geneSymbolEntry = finalElement.getElementsByClassName('gene-symbol');
      if (geneSymbolEntry &&
         HTMLCollection.prototype.isPrototypeOf(geneSymbolEntry)
         && geneSymbolEntry.length == 1)
        geneSymbolEntry[0].textContent = ' ('+ nestedObj.Main_gene_symbol.join(' / ') + ')';
    }

    return template.content;
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
