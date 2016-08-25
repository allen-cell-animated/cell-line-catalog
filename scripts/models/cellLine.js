(function(module) {
function CellLine (opts) {
  for (key in opts) {
    this[key] = opts[key];
  }
}

  CellLine.allCellLines = [];

  CellLine.prototype.toHtml= function(templateid){
    var source = $(templateid).html();
    var renderTemplate = Handlebars.compile(source);
    return renderTemplate(this);
  };

  CellLine.loadIntoObjectArray = function(inputdata){
    CellLine.allCellLines = inputdata.sort().map(function(ele){
        return new CellLine(ele);
      });
    };



    CellLine.fetchAll = function(url, name, nextFunction) {
        if (!localStorage.getItem(name)) {
          console.log('nothing in local storage');
          $.get(url, function(data, message, xhr) {
            // console.log('data from get', data);
            localStorage.setItem(name,JSON.stringify(data));
            console.log(xhr.getResponseHeader('eTag'));
            localStorage['eTag'+name]=xhr.getResponseHeader('eTag');
            CellLine.fetchAll(url, name, nextFunction); // recursive call
          });
        }
        else{
          $.ajax({
            type: 'HEAD',
            url: url,
            success: function(data, message, xhr){
              var newTag=xhr.getResponseHeader('eTag');
              if (newTag !== localStorage['eTag'+name]){
                localStorage.setItem(name,'') ;
                console.log('getting new data!');
                CellLine.fetchAll(); // recursive call
              } //end of if
              console.log('got your data right here');
              var retreivedData =  JSON.parse(localStorage.getItem(name, data));
              CellLine.loadIntoObjectArray(retreivedData);
              nextFunction();
            } //end of success
          });  //end of ajax
        };
      };




CellLine.allTagLocations = function() {
  return CellLine.allCellLines.map(function(currentCellLine) {
    return currentCellLine.tagLocation;
  }).filter(function(element, index, array){
    return array.indexOf(element)===index;
    // TODO:DONE complete this function to sum up all of the words.
  })
};

  CellLine.allFluorophores = function() {
    return CellLine.allCellLines.map(function(currentCellLine) {
      return currentCellLine.fluorophore;
    }).filter(function(element, index, array){
      return array.indexOf(element)===index;
      // TODO:DONE complete this function to sum up all of the words.
    })
  };


module.CellLine = CellLine;
})(window);
