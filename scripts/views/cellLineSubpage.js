(function(module) {

  var cellLineProfileView = {};

  cellLineProfileView.disableLinks = function(){
    $('.subpage-nav').on('click', '.disabled', function(e){
      e.preventDefault();
      console.log('disabled');
      return false;
    });
  };

  cellLineProfileView.checkforData = function(cellLine){
    if (cellLine.Main_media.length > 0) {
      cellLineProfileView.makeGallery(cellLine);
      $('.morphology-images').show();
      $('#images-not-available').hide();
    }
    else {
      $('.morphology-images').hide();
      $('#images-not-available').show();
    }

    cellLine.subpaged_status.forEach(function(a){
      if (a.done==='true') {
        $('#tab_' + a.id).removeClass('disabled');
        if (a.id === 'editingdesign') {
          $('#tab_' + a.id).addClass('active');
          $('#' + a.id).addClass('active');

        }
      }
      else {
        $('#tab_' + a.id).addClass('disabled');
        $('#tab_' + a.id).removeClass('active');
        $('#' + a.id).removeClass('active');

      }
    });
  };

  cellLineProfileView.gallery = function() {
    $('#gallery-thumbnails').on('click', '.morphology-thumbnail', function(e) {
      e.stopPropagation();
      e.preventDefault();
      $('.morphology-main').empty();
      var $fullscreen = $('.morphology-main').append($(this).find('.toappend').clone());
      $fullscreen.find('.blocker').detach();
      var $src = $fullscreen.find('iframe').attr('src');
      $fullscreen.find('iframe').attr('src', $src + '?autoplay=1&loop=1&byline=0')
      $('.morphology-main').append($(this).find('.caption-container').clone().removeClass('hidden'));
      $(this).parents().find('.active').removeClass('active');
      $(this).addClass('active');
      $('#tab_editingdesign a').click();
    });
  };

  cellLineProfileView.makeGallery = function(cellLine){
    $('.morphology-main').empty();
    $('#gallery-thumbnails').empty();

    if (cellLine.Main_media[0].type === 'movie') {
      $('.morphology-main').append(cellLine.nestedToHtml($('#gallery-main-movie-template'), cellLine.Main_media[0]));
    }
    else if (cellLine.Main_media[0].type ==='image') {
      $('.morphology-main').append(cellLine.nestedToHtml($('#gallery-main-image-template'), cellLine.Main_media[0]));

    }
    cellLine.Main_media.forEach(function(a){
      if (a.type === 'movie') {
        $('#gallery-thumbnails').append(cellLine.nestedToHtml($('#movie-thumbnail-template'), a));
      }
      else if (a.type ==='image') {
        $('#gallery-thumbnails').append(cellLine.nestedToHtml($('#image-thumbnail-template'), a));

      }
    });
  };

  cellLineProfileView.renderGeneSymbList = function(cellLine) {
    $('#gene-symb-list').empty();

    // Create label
    var label = document.createElement('span');
    label.classList.add('profile-summary-key');
    label.textContent = 'Gene symbol: ';
    $('#gene-symb-list').append(label);

    // local helper function for generating gene links
    var genGeneChild = (gene, gene_id) => {
      var child = document.createElement('span');
      var geneLink = document.createElement('a');
      child.classList.add('profile-summary-value');
      geneLink.href = 'http://www.ncbi.nlm.nih.gov/gene/' + gene_id;
      geneLink.textContent = gene;
      child.appendChild(geneLink);
      $('#gene-symb-list').append(child);
    };

    for (var i = 0; i < cellLine.Main_gene_symbol.length; i++) {
      genGeneChild(cellLine.Main_gene_symbol[i], cellLine.Main_gene_id[i]);
      if (i <cellLine.Main_gene_symbol.length -1){
        var slash= document.createElement('span');
        slash.textContent = ' / '
        $('#gene-symb-list').append(slash);
      }
    }
  }

  cellLineProfileView.RenderProfile = function(cellLine) {
    $('#cellline-info').children().remove();
    $('.subpage-tab').children().remove();
    $('.subpage-tab').removeClass('active');
    if ($('#cellline-info').find('ul').length ===0){
      $('#cellline-info').append(cellLine.toHtml($('#cell-profile-info-template')));

      $('#editingdesign').append(cellLine.toHtml($('#editingDesign-template')));
      $('#genomiccharacterizations').append(cellLine.toHtml($('#genomiccharacterizations-template')));
      if (typeof(cellLine['GenomicCharacterization_ddpcr']) !=='string') {
        cellLine['GenomicCharacterization_ddpcr'].forEach(function(a){
          $('#ddPCR-table').append(cellLine.nestedToHtml($('#ddPCR-template'), a ));
        });
      }
      if (typeof(cellLine['GenomicCharacterization_offtargets']) !=='string') {
        cellLine['GenomicCharacterization_offtargets'].forEach(function(a){
          $('#off-target-table').append(cellLine.nestedToHtml($('#offTargets-template'), a ));
        });
      }

      $('#validation').append(cellLine.toHtml($('#validation-template')));
      $('#stemcellcharacteristics').append(cellLine.toHtml($('#stemcellcharacteristics-template')));
      if (typeof(cellLine['StemCellCharacterization_pluripotency_analysis'])!=='string') {
        cellLine['StemCellCharacterization_pluripotency_analysis'].forEach(function(a){
          $('#pluripotent-table-body').append(cellLine.nestedToHtml($('#pluripotent-template'), a ));
        });
      }
      if (typeof(cellLine['StemCellCharacterization_trilineage']) !=='string') {
        cellLine['StemCellCharacterization_trilineage'].forEach(function(a){
          $('#trilineage-table-body').append(cellLine.nestedToHtml($('#trilineage-template'), a ));
        });
      }
      $('#supplementaryinformation').append(cellLine.toHtml($('#supplementaryinformation-template')));
      $('#protocols').append(cellLine.toHtml($('#protocols-template')));
      $('#stranalysis').append(cellLine.toHtml($('#stranalysis-template')));

      // cellLineProfileView.goBack();
      cellLineProfileView.gallery();
      $('#cell-collection-banner').show();
      cellLineProfileView.checkforData(cellLine);
      cellLineProfileView.renderGeneSymbList(cellLine)
      cellLineProfileView.disableLinks();
      $('#cellline-profile').show();

    }
  };

  // CellLine.fetchAll('../data/cell-lines.json', 'cell-lines', cellLineProfileView.renderIndexPage);

  module.cellLineProfileView = cellLineProfileView;
})(window);
