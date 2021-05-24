(function(module) {


  var cellListView = {};
  cellListView.filters = ['Main_gene_symbol', 'Main_structure', 'Main_fluorescent_tag', 'Main_parent_line'];

  // Specific filter options
  gene_symbol_edits = function(options) {
    options = options.filter(function(option){
      return !option.includes('CLYBL');
    })
    options.push('CLYBL');
    return options;
  }

  fluorescent_tag_edits = function(options) {
    options = options.filter(function(option){
      return !option.includes('EGFP') && !option.includes('mTagRFP');
    })
    options.push('(m)EGFP');
    options.push('mTagRFP-T');
    return options;
  }



  $('#cell-line-table').on('click', '.cellline',function() {
    currentID=(this.id);
    var clone_number = $(this).attr('data-cloneid')
    $('#cell-line-list').hide();
    $('#cellline-profile').fadeIn();
    page('/cellline/' + currentID + '/clone/' + clone_number);
  });

  cellListView.checkPrivate = function(){
    var testKey = 'test';
    try {
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return false;
    } catch (e) {
      return true;
    }
  };

  cellListView.alertPrivateBrowsers = function(){
    if (cellListView.checkPrivate() === true) {
      console.log('private!');
      $('<p>').html('This site requires access to local storage to work properly, please disable private browsing').addClass('errors').appendTo($('main'));
    }
    else{
    }
  };

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
    if (filters.length> 0) {
      url = filters.reduce(function(acc, cur){
        acc.push('/' + cur.filter + '/' +cur.value);
        return acc;
      },[]);
      page('/filter' + url.join(''));
    }
    else{
      page('/cell-line-catalog');
    }


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
      if (a.status === 'Yes' || a.status === 'No') {
        $('#cell-line-table').append(a.toHtml($('#cellList-template')));
      }
      else {
        $('#in-progress-table').append(a.toHtml($('#cellList-template')));
      }
    });
  };

  cellListView.renderIndexPage = function(ctx) {
    $('#cellline-profile').hide();
    $('#cell-line-table .cellline').remove();
    $('#in-progress-table').children().remove();
    $('#cell-line-list').show();
    $('#cell-line-catalog-nav').addClass('active');
    $('#home').removeClass('active');
    $('.sub-page-tab.active').removeClass('active');
    $('#main').hide();
    if ($('select').find('.options').length ===0) {
      cellListView.filters.forEach(function(filter){
        ///////
        // populate list of all filter options
        ///////
        let options_list = [];
        // handle multi labeled objects
        CellLine.allInCategory(filter).forEach(function(option){
          if (!option.includes("/")){
            options_list.push(option);
          } else { // split by / and add each option
            parts_list = option.split("/");
            parts_list.forEach(function(part){
              options_list.push(part.trim());
            })
          }
        });

        ///////
        // Apply additional processing
        ///////
        let filter_options_sorted = options_list.filter(function(option, index){
          return options_list.indexOf(option) == index;
        });

        if (filter == 'Main_gene_symbol') {
          filter_options_sorted = gene_symbol_edits(filter_options_sorted);
        } else if (filter == 'Main_fluorescent_tag') {
          filter_options_sorted = fluorescent_tag_edits(filter_options_sorted);
        }
        // sort choices alphabetically
        filter_options_sorted.sort((a, b) => (a > b) ? 1 : -1);

        filter_options_sorted.forEach(function(option){
          cellListView.createFilter(('#'+filter+'-filter'), option);
        });
      });
    }
    $('#cell-collection-banner').show();

    cellListView.setFilters(ctx);
    // ctx.celllines.sort((a, b) => (a.Main_gene_name > b.Main_gene_name) ? 1 : -1); <- alphabetical sort
    cellListView.drawTable(ctx.celllines);
  };

  cellListView.renderMainPage = function(){
    $('#cellline-profile').hide();
    $('#cell-collection-banner').hide();
    $('#cell-line-list').hide();
    $('#cell-line-table .cellline').remove();
    $('#main').show();
    $('#cell-line-catalog-nav').removeClass('active');
    $('#home').addClass('active');
    $('.logo').attr('background-image', 'url(/images/logo-AC.png)');
  };

  cellListView.resetFilters =function(){
    $('.filter').val('');
  };

  module.cellListView = cellListView;
})(window);
