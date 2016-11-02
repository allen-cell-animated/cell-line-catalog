(function(module) {


  var cellListView = {};
  cellListView.filters = ['Main_gene_name', 'Main_structure', 'Main_fluorescent_tag', 'Main_parent_line'];

  $('#cell-line-table').on('click', '.cellline',function() {
    currentID=(this.id);
    $('#cell-line-list').hide();
    $('#cellline-profile').fadeIn();
    page('/cellline/' + currentID);
  });



  $('.filter').on('change', readFilters);

  cellLineView.readFilters = function(){
    $('.cellline').hide();
    var filters = $('.filter').map(function() {
      return {
        value : $(this).val(),
        filter: this.id.replace('-filter', '')
      };}).get().filter(function(ele){
        return ele.value !== ''
      });
    if (filters.length <= 2) {
      url = filters.reduce(function(acc, cur){
        acc.push('/' + cur.filter + '/' +cur.value)
        return acc
      },[]);
      page(url.join(''))
    }
    else  {

    }

  };
  // $('.filter').change();



    //
    // $('.main-nav').on('click', '.tab', function(e) {
    //   $('.tab-section').hide();
    //   $('#' + $(this).data('content')).fadeIn();
    // });
    // $('.main-nav .tab:first').click();

  cellListView.createFilter= function(filterid, option){
    var $parentOptions = $(filterid);
    $('<option>').val(option).text(option).addClass('options').appendTo($parentOptions);
  };

  cellListView.drawTable = function(celllines) {
    celllines.forEach(function(a) {
      $('#cell-line-table').append(a.toHtml($('#cellList-template')));
    });
  };

  cellListView.renderIndexPage = function(allcelllines) {
    $('#cellline-profile').hide();
    $('#cell-line-table').children().remove();
    $('#cell-line-list').show();
    if ($('select').find('.options').length ===0) {
      cellListView.filters.forEach(function(filter){
        CellLine.allInCategory(filter).forEach(function(option){
          cellListView.createFilter(('#'+filter+'-filter'), option);
        });
      });
    }
    // $('.filter').change();
    cellListView.drawTable(allcelllines);
  };



  module.cellListView = cellListView;
})(window);
