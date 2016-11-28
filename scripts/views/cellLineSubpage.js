(function(module) {


  var cellLineProfileView = {};


  cellLineProfileView.gallery = function() {
    $('.thumbnails').on('click', '.morphology-thumbnail', function(e) {
      e.preventDefault();
      $('.morphology-main').attr('src', $(this).attr('src')) ;
      $(this).parents().find('.active').removeClass('active');
      $(this).addClass('active');
    });
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
      // cellLineProfileView.goBack();
      cellLineProfileView.gallery();
      $('#cellline-profile').show();
    }
  };

  // CellLine.fetchAll('../data/cell-lines.json', 'cell-lines', cellLineProfileView.renderIndexPage);

  module.cellLineProfileView = cellLineProfileView;
})(window);
