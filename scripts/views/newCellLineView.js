(function(module){

  var newCellLine = {};
  newCellLine.currentID;
  newCellLine.allAttributes = [
    'cell_line_id',
    'Main_gene_symbol',
    'Main_gene_name',
    'Main_gene_id',
    'Main_mrna_id',
    'Main_ensembl_id',
    'Main_structure',
    'Main_terminal_tagged',
    'Main_fluorescent_tag',
    'Main_linker',
    'Main_plasmid_sequence',
    'Main_cell_line_morphology',
    'EditingDesign_crRNA_seq',
    'EditingDesign_cas9',
    'EditingDesign_NCBI_isoform',
    'EditingDesign_gene_figure',
    'EditingDesign_p14_fpkm',
    'EditingDesign_p18_fpkm',
    'EditingDesign_expression_figure',
    'GenomicCharacterization_ddpcr',
    'StemCellCharacterization_pluripotency_analysis',
    'StemCellCharacterization_karyotype',
    'StemCellCharacterization_differentiation'
  ];

  newCellLine.initnewCellLinePage = function() {
    newCellLine.uploadImages();
    newCellLine.submitLine();
    newCellLine.uploadTables();
    $('#cell_line_id').show();
    newCellLine.lookup();
    //user handling
    cellLineUsers.signinHandler();
    cellLineUsers.registerHandler();
    cellLineUsers.signinRegisterSwitch();
    cellLineUsers.signOutHandler();
  };

  newCellLine.lookup = function(){
    $('#lookup-id').on('submit', function(event){
      event.preventDefault();
      newCellLine.currentID = $(this).find('#cell_line_id').val();
      $('.entries').children().remove();
      if (CellLine.allCellLinesFB.length === 0) {
        console.log('no firebase');
      }
      else if (CellLine.allCellLinesFB[newCellLine.currentID]) {
        console.log('exsiting cell line');
        newCellLine.read(CellLine.allCellLinesFB[newCellLine.currentID]);
      }
      else{
        console.log('new cell line');
        var data = {
          cell_line_id :newCellLine.currentID
        };
        newCellLine.write(data);
      }
    });
  };

  newCellLine.resetform = function(celllineid) {
    console.log('setting form new cell line', celllineid);
    $('.entries').children().remove();
    $('footer').children().remove();
    $('<h4>').html('Saved cell line: '+ celllineid).appendTo($('footer'));
  };

  newCellLine.write = function(data) {
    var updates = {};
    var newCellLineKey = firebaseLocal.ref().child('celllines').push().key;
    updates['/celllines/' + newCellLine.currentID] = newCellLineKey;
    updates['/celllinesdata/' + newCellLineKey] = data;
    return firebase.database().ref().update(updates).then(function(snapshot){
      newCellLine.read(CellLine.allCellLinesFB[newCellLine.currentID]);
    });
  };

  newCellLine.read = function(key) {
    return firebase.database().ref('/celllinesdata/' + key).once('value').then(function(snapshot) {
      var exsitingCellLine = new CellLine(snapshot.val());
      console.log(exsitingCellLine);
      $('.entries').append(exsitingCellLine.toHtml($('#new-cellline-template')));
      exsitingCellLine['subpaged_status'].forEach(function(ele){
        if (ele.done === 'true') {
          $('#' + ele.id).prop('checked', true);
        }
        else {
        }
      });
    });
  };

  newCellLine.submitLine = function() {
    $('#new-form').on('submit', newCellLine.update);
  };

  newCellLine.update = function(event) {
    event.preventDefault();
    var celldata = newCellLine.create();
    console.log(celldata);
    var updates = {};
    var cellLineKey = CellLine.allCellLinesFB[newCellLine.currentID];
    updates['/celllinesdata/' + cellLineKey] = celldata;
    newCellLine.resetform(newCellLine.currentID);
    return firebase.database().ref().update(updates);
  };

  newCellLine.uploadImages = function() {
    $('#write').on('change', '.image', function(event) {
      var cellLineID = $('#cell_line_id').val();
      var file = this.files[0];
      var id = this.id;
      var metadata = {
        contentType: 'image'
      };
      console.log('Stored ' + cellLineID + '/' + this.id + '/' + file.name);
      var uploadTask = firebaseLocal.storageRef.child('images/' +
      cellLineID + '/' + this.id + '/' +file.name).put(file, metadata);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function(snapshot) {
        refKey = CellLine.allCellLinesFB[cellLineID];
        var updates = {};
        updates[id+'_url'] = uploadTask.snapshot.downloadURL;
        console.log(uploadTask.snapshot.downloadURL);
        return firebase.database().ref().child('/celllinesdata/' + refKey).update(updates);
      });
    });
  };

  newCellLine.uploadTables = function() {
    $('#write').on('change', '.spreadsheet', function(event) {
      var cellLineID = $('#cell_line_id').val();
      var file = this.files[0];
      var id = this.id;
      console.log(file);
    });
  };

  newCellLine.create = function() {
    var text_ids = $('#write .form-control[type=text]').map(function() {
      return this.id;
    }).get();
    var image_ids = $('#write .image').map(function() {
      return this.id;
    }).get();
    var subpage_status = $('input[type=checkbox].subpage-status').map(function(){obj= {done: this.checked, id: this.id}; return obj;}).get();
    var cellLineEntry = new CellLine();
    cellLineEntry['subpaged_status'] = subpage_status;
    text_ids.forEach(function(id){
      cellLineEntry[id] = $('#' + id).val();
    });
    return cellLineEntry;
  };

  newCellLine.initnewCellLinePage();
  module.newCellLine = newCellLine;
})(window);
