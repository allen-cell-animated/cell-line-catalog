(function(module) {


  var cellListView = {};

  cellListView.handleRowSelect = function() {
    $('#cell-line-table').on('click', '.cellline',function() {
      currentID=eval(this.id);
      $('#cell-line-list').hide();
      $('#cellline-profile').show();
      var selectedCellLine = CellLine.allCellLines.find(function(ele, index, array){ return ele.ID === currentID;});
      console.log(selectedCellLine);
      cellLineProfileView.RenderProfile(selectedCellLine);
    });
  };


  cellListView.handleFluorophoreFilter = function() {
    $('#fluorophore-filter').on('change', function() {
      console.log($(this).val());
      if ($(this).val()) {
        $('.cellline').hide();
        $('.cellline[data-fluorescent_tag="' + $(this).val() + '"]').fadeIn();
      } else {
        $('.cellline').fadeIn();
      }
      $('#tagLocation-filter').val('');
    });
  };


  cellListView.handleTagFilter = function() {
    $('#tagLocation-filter').on('change', function() {
      if ($(this).val()) {
        $('.cellline').hide();
        $('.cellline[data-terminal_tagged="' + $(this).val() + '"]').fadeIn();
      } else {
        $('.cellline').fadeIn();
      }
      $('#fluorophore-filter').val('');
    });
  };

  cellListView.handleMainNav = function() {
    $('.main-nav').on('click', '.tab', function(e) {
      $('.tab-content').hide();
      $('#' + $(this).data('content')).fadeIn();
    });
    $('.main-nav .tab:first').click();
  };

  cellListView.createFilter= function(filterid, option ){
    var $parentOptions = $(filterid);
    console.log(option);
    $('<option>').val(option).text(option).appendTo($parentOptions);
  };

  cellListView.renderIndexPage = function() {
    CellLine.allTagLocations().forEach(function(a){
      cellListView.createFilter(('#tagLocation-filter'), a);

    });
    CellLine.allFluorophores().forEach(function(a){
      cellListView.createFilter(('#fluorophore-filter'), a);

    });
    CellLine.allCellLines.forEach(function(a) {
      $('#cell-line-table').append(a.toHtml($('#cellList-template')));
    });

    cellListView.handleFluorophoreFilter();
    cellListView.handleTagFilter();
    cellListView.handleMainNav();
    cellListView.handleRowSelect();

  };

  CellLine.updateData('../data/cell_line_catalog.json', 'cell-lines', CellLine.loadIntoObjectArray, cellListView.renderIndexPage);

  module.cellListView = cellListView;
})(window);
