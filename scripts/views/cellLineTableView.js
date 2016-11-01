(function(module) {


  var cellListView = {};

  cellListView.handleRowSelect = function() {
    $('#cell-line-table').on('click', '.cellline',function() {
      currentID=(this.id);
      $('#cell-line-list').hide();
      $('#cellline-profile').fadeIn();
      page('/cellline/' + currentID);
    });
  };


  cellListView.handleFluorophoreFilter = function() {
    $('#fluorophore-filter').on('change', function() {
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
      $('.tab-section').hide();
      $('#' + $(this).data('content')).fadeIn();
    });
    $('.main-nav .tab:first').click();
  };

  cellListView.createFilter= function(filterid, option ){
    var $parentOptions = $(filterid);
    $('<option>').val(option).text(option).appendTo($parentOptions);
  };

  cellListView.renderIndexPage = function(allcelllines) {
    $('#cellline-profile').hide();
    $('#cell-line-table').children().remove();
    CellLine.allTagLocations().forEach(function(a){
      cellListView.createFilter(('#tagLocation-filter'), a);
    });
    CellLine.allFluorophores().forEach(function(a){
      cellListView.createFilter(('#fluorophore-filter'), a);
    });
    allcelllines.forEach(function(a) {
      $('#cell-line-table').append(a.toHtml($('#cellList-template')));
    });
    cellListView.handleFluorophoreFilter();
    cellListView.handleTagFilter();
    cellListView.handleMainNav();
    cellListView.handleRowSelect();
  };



  module.cellListView = cellListView;
})(window);
