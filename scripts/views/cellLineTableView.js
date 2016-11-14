(function(module) {


  var cellListView = {};
  cellListView.filters = ['Main_gene_name', 'Main_structure', 'Main_fluorescent_tag', 'Main_parent_line'];

  $('#cell-line-table').on('click', '.cellline',function() {
    currentID=(this.id);
    $('#cell-line-list').hide();
    $('#cellline-profile').fadeIn();
    page('/cellline/' + currentID);
  });


  cellListView.setFilters = function(ctx){
    $('#'+ ctx.params.filtername + '-filter').val(ctx.params.filtervalue);
    $('#'+ ctx.params.filternamesec + '-filter').val(ctx.params.filtervaluesec);
  };

  cellListView.readFilters = function(){
    $('.cellline').hide();
    var filters = $('.filter').map(function() {
      return {
        value : $(this).val(),
        filter: this.id.replace('-filter', '')
      };}).get().filter(function(ele){
        return ele.value !== '';
      });
      url = filters.reduce(function(acc, cur){
        acc.push('/' + cur.filter + '/' +cur.value);
        return acc;
      },[]);
      page(url.join(''));
  };

  cellListView.checkContext = function(ctx){
    if(ctx.celllines.length !== 0) {
      $('#cell-line-list .errors').hide();
    } else {
      $('#cell-line-list .errors').show();
      $('.filter').val('');
    }
  };

  $('.filter').on('change', cellListView.readFilters);

  cellListView.createFilter= function(filterid, option){
    var $parentOptions = $(filterid);
    $('<option>').val(option).addClass('options').attr('data-content', "<span class='label label-success'>Relish</span>").text(option).appendTo($parentOptions);
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
    $('#main').hide();
    $('.logo').attr('background-image', 'url(/images/logo-CLC.png)');
    if ($('select').find('.options').length ===0) {
      cellListView.filters.forEach(function(filter){
        CellLine.allInCategory(filter).forEach(function(option){
          cellListView.createFilter(('#'+filter+'-filter'), option);
        });
      });
    }
    cellListView.drawTable(allcelllines);
  };

  cellListView.renderMainPage = function(){
    $('#cellline-profile').hide();
    $('#cell-line-list').hide();
    $('#cell-line-table').children().remove();
    $('#main').show();
    $('.logo').attr('background-image', 'url(/images/logo-AC.png)');
  };

  cellListView.resetFilters =function(){
    $('.filter').val('');
  };

  module.cellListView = cellListView;
})(window);
