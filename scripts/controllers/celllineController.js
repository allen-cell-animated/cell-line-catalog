(function(module){
  var celllineController = {};

  celllineController.privateAlert = function(ctx, next) {
    cellListView.alertPrivateBrowsers();
    next();
  };

  celllineController.loadAll = function(ctx, next) {
    var cellLineData = function(allCellLines) {
      ctx.celllines = CellLine.allCellLines;
      next();
    };
    if (CellLine.allCellLines.length){
      ctx.celllines = CellLine.allCellLines;
      next();
    }
    else{
      CellLine.updateData('/data/cell_line_catalog.json', 'cell-lines', cellLineData);

    }
  };


  celllineController.checkContext = function(ctx, next) {
    if(ctx.celllines.length !== 0) {
      console.log('length=',ctx.celllines.length);
      $('#cell-line-list .errors').hide();
    } else {
      $('#cell-line-list .errors').show();
      $('.filter').val('');
    }
    next();
  };

  celllineController.restartFilter = function(ctx, next) {
    cellListView.setFilters(ctx);
    // cellListView.drawTable(ctx.celllines);
    next();
  };

  celllineController.filter = function(ctx, next) {
    var complaintsData = function(array) {
      ctx.celllines = array;
      next();
    };
    var array = filter_fn(ctx, CellLine.allCellLines);
    complaintsData(array);
  };

  celllineController.filtersec = function(ctx, next) {
    var complaintsData = function(array) {
      ctx.celllines = array;
      next();
    };
    var array = filter_fn(ctx, ctx.celllines);
    complaintsData(array);
  };

  celllineController.filterthird = function(ctx, next) {
    var complaintsData = function(array) {
      ctx.celllines = array;
      next();
    };
    var array = filter_fn(ctx, ctx.celllines);
    complaintsData(array);
  };

  celllineController.loadById = function(ctx, next) {
    ctx.celllines = [];
    var complaintsData = function(array) {
      ctx.celllines = array;
      next();
    };
    var array = CellLine.allCellLines.find(function(ele, index, array){ return ele.cell_line_id === ctx.params.id  && ele.clone_number === ctx.params.cloneid;});
    complaintsData(array);
  };

  celllineController.index = function(ctx, next) {
    cellListView.renderIndexPage(ctx);

  };

  celllineController.mainindex = function(ctx, next) {
    if(ctx.celllines.length) {
      cellListView.renderMainPage(ctx.celllines);
    } else{
      page('/cell-line-catalog');
    }
  };

  celllineController.subpageIndex = function(ctx, next) {
    if(ctx.celllines) {
      cellLineProfileView.RenderProfile(ctx.celllines);
    } else{
      page('/cell-line-catalog');
    }
  };

  celllineController.resetFilters = function(ctx, next) {
    cellListView.resetFilters();
    next();
  };

  // Filter function for populating array of appropriate cell-lines
  filter_fn = function(ctx, cell_lines) {
    return cell_lines.filter(function(ele, index, array){
      // SPECIAL CASES:
      // fluorescent tag
      if (ctx.params.filtername === 'Main_fluorescent_tag') {
        if (ctx.params.filtervalue === '(m)EGFP') {
          return ele[ctx.params.filtername].includes('EGFP');
        } else if (ctx.params.filtervalue === 'mTagRFP-T') {
          return ele[ctx.params.filtername].includes('mTagRFP');
        }
      }

      // general case: if entry <INCLUDES> the filter value in its associated field
      return ele[ctx.params.filtername].includes(ctx.params.filtervalue);
    });
  };

  module.celllineController = celllineController;
})(window);
