var newCellLine = {};
newCellLine.currentID;

newCellLine.initnewCellLinePage = function() {
  newCellLine.uploadImages();
  newCellLine.submit();
  $('.entries').hide();
  $('#cell_line_id').show();
  newCellLine.lookup();
};

newCellLine.lookup = function(){
  $('#cell_line_id').on('focusout', function(){
    newCellLine.currentID = $(this).val()
    if (CellLine.allCellLinesFB[$(this).val()]) {

    }
    else{
      $('.entries').show();
      console.log('new cell line');
      var updates = {}
      var newCellLineKey = FirebaseRef.ref().child('celllines').push().key;
      updates['/celllines/' + newCellLine.currentID] = newCellLineKey;
      return firebase.database().ref().update(updates);

    }
  });
};

newCellLine.submit = function() {
  $('#write').on('submit', newCellLine.update);
};

newCellLine.update = function() {
  var celldata = newCellLine.create();
  console.log(celldata);
  var updates = {};
  var cellLineKey = CellLine.allCellLinesFB[newCellLine.currentID];
  updates['/celllinesdata/' + cellLineKey] = celldata;
  return firebase.database().ref().update(updates);
}

newCellLine.uploadImages = function() {
  $('#write').on('change', '.image', function(event) {
    var cellLineID = $('#cell_line_id').val();
    var file = this.files[0];
    var id = this.id;
    var metadata = {
      contentType: 'image'
    };
    console.log('Stored ' + cellLineID + '/' + this.id + '/' + file.name);
    var uploadTask = FirebaseRef.storageRef.child('images/' +
    cellLineID + '/' + this.id + '/' +file.name).put(file, metadata);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function(snapshot) {
      refKey = CellLine.allCellLinesFB[cellLineID];
      var updates = {};
      updates[id] = uploadTask.snapshot.downloadURL;
      console.log(uploadTask.snapshot.downloadURL);
      return firebase.database().ref().child('/celllinesdata/' + refKey).update(updates);
    });
  });
};

newCellLine.create = function() {
  var text_ids = $('#write input[type=text]').map(function() {
    return this.id;
  }).get();
  var image_ids = $('#write .image').map(function() {
    return this.id;
  }).get();
  var cellLineEntry = new CellLine();
  text_ids.forEach(function(id){
    cellLineEntry[id] = $('#' + id).val();
  });
  return cellLineEntry;
};




newCellLine.initnewCellLinePage();
