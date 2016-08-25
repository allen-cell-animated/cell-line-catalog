(function(module) {


  var cellLineSubPageView = {};

  cellLineSubPageView.handleFluorophoreFilter = function() {
    $('#fluorophore-filter').on('change', function() {
      console.log($(this).val());
      if ($(this).val()) {
        $('.cellline').hide();
        $('.cellline[data-fluorophore="' + $(this).val() + '"]').fadeIn();
      } else {
        $('.cellline').fadeIn();
      }
      $('#tagLocation-filter').val('');
    });
  };

  cellLineSubPageView.handleTagFilter = function() {
    $('#tagLocation-filter').on('change', function() {
      if ($(this).val()) {
        $('.cellline').hide();
        $('.cellline[data-tagLocation="' + $(this).val() + '"]').fadeIn();
      } else {
        $('.cellline').fadeIn();
      }
      $('#fluorophore-filter').val('');
    });
  };

  cellLineSubPageView.handleMainNav = function() {
    $('.main-nav').on('click', '.tab', function(e) {
      $('.tab-content').hide();
      $('#' + $(this).data('content')).fadeIn();
    });
    $('.main-nav .tab:first').click();
  };

  cellLineSubPageView.createFilter= function(filterid, option ){
    var $parentOptions = $(filterid);
    console.log(option);
    $('<option>').val(option).text(option).appendTo($parentOptions);
  };

  cellLineSubPageView.renderIndexPage = function() {
    CellLine.allTagLocations().forEach(function(a){
      cellLineSubPageView.createFilter(('#tagLocation-filter'), a)

    })
    CellLine.allFluorophores().forEach(function(a){
      cellLineSubPageView.createFilter(('#fluorophore-filter'), a)

    })
    CellLine.allCellLines.forEach(function(a) {
      $('#cell-line-table').append(a.toHtml($('#cellList-template')));
    });

    cellLineSubPageView.handleFluorophoreFilter();
    cellLineSubPageView.handleTagFilter();
    cellLineSubPageView.handleMainNav();


  };

CellLine.fetchAll('../data/cell-lines.json', 'cell-lines', cellLineSubPageView.renderIndexPage);

  module.cellLineSubPageView = cellLineSubPageView;
})(window);
