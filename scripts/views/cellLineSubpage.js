(function(module) {


  var cellLineProfileView = {};


  cellLineProfileView.handleSubNav = function() {
    $('.subpage-nav').on('click', '.tab', function(e) {
      $('.sub-tab-content').hide();
      $('#' + $(this).data('content')).fadeIn();
    });
  };

  cellLineProfileView.RenderProfile = function(cellLine) {
    if ($('#cellline-info').find('ul').length ===0){
      $('#cellline-info').append(cellLine.toHtml($('#cell-profile-info-template')));
      cellLineProfileView.handleSubNav();
    }
  };

  // CellLine.fetchAll('../data/cell-lines.json', 'cell-lines', cellLineProfileView.renderIndexPage);

  module.cellLineProfileView = cellLineProfileView;
})(window);
