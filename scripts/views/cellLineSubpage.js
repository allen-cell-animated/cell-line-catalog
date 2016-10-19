(function(module) {


  var cellLineProfileView = {};

  cellLineProfileView.goBack = function(){
    $('.back-button').on('click', function(){
      $('.main-nav .tab:first').click();
    });
  };

  cellLineProfileView.handleSubNav = function() {
    // $('.subpage-nav').on('click', '.nav-item', function(e) {
    //   e.preventDefault();
    //   $(this).tab('show');
    // });
    // $('.sub-nav .tab:first').click();
  };



  cellLineProfileView.RenderProfile = function(cellLine) {
    $('#cellline-info').children().remove();
    $('.subpage-tab').children().remove();
    if ($('#cellline-info').find('ul').length ===0){
      $('#cellline-info').append(cellLine.toHtml($('#cell-profile-info-template')));
      $('#editingdesign').append(cellLine.toHtml($('#editingDesign-template')));
      $('#genomiccharacterizations').append(cellLine.toHtml($('#genomiccharacterizations-template')));
      $('#validation').append(cellLine.toHtml($('#validation-template')));
      $('#stemcellcharacteristics').append(cellLine.toHtml($('#stemcellcharacteristics-template')));
      $('#supplementaryinformation').append(cellLine.toHtml($('#supplementaryinformation-template')));

      cellLineProfileView.handleSubNav();
      cellLineProfileView.goBack();
    }
  };

  // CellLine.fetchAll('../data/cell-lines.json', 'cell-lines', cellLineProfileView.renderIndexPage);

  module.cellLineProfileView = cellLineProfileView;
})(window);
