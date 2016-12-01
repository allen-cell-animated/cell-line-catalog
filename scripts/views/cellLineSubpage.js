(function(module) {


  var cellLineProfileView = {};


  cellLineProfileView.gallery = function() {
    $('.thumbnails').on('click', '.morphology-thumbnail', function(e) {
      e.preventDefault();
      $('.morphology-main').empty();
      $('.morphology-main').append($(this).find('.toappend').clone().attr('controls', '').attr('autoplay',''));
      $('.morphology-main').append($(this).find('.caption').clone());
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
      cellLine['GenomicCharacterization_ddpcr'].forEach(function(a){
        $('#ddPCR-table').append(cellLine.nestedToHtml($('#ddPCR-template'), a ))
      });
      cellLine['GenomicCharacterization_offtargets'].forEach(function(a){
        $('#off-target-table').append(cellLine.nestedToHtml($('#offTargets-template'), a ))
      });


      $('#validation').append(cellLine.toHtml($('#validation-template')));
      $('#stemcellcharacteristics').append(cellLine.toHtml($('#stemcellcharacteristics-template')));
      cellLine['StemCellCharacterization_pluripotency_analysis'].forEach(function(a){
        $('#pluripotent-table-body').append(cellLine.nestedToHtml($('#pluripotent-template'), a ))
      });

      $('#supplementaryinformation').append(cellLine.toHtml($('#supplementaryinformation-template')));
      // cellLineProfileView.goBack();
      cellLineProfileView.gallery();
      $('#cellline-profile').show();
    }
  };

  // CellLine.fetchAll('../data/cell-lines.json', 'cell-lines', cellLineProfileView.renderIndexPage);

  module.cellLineProfileView = cellLineProfileView;
})(window);
