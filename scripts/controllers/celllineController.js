(function(module){
  var celllineController = {};

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
    cellListView.drawTable(ctx.celllines);
    next();
  };

  celllineController.filter = function(ctx, next) {
    var complaintsData = function(array) {
      ctx.celllines = array;
      next();
    };
    var array = CellLine.allCellLines.filter(function(ele, index, array){ return ele[ctx.params.filtername] === ctx.params.filtervalue;});
    complaintsData(array);
  };

  celllineController.filtersec = function(ctx, next) {
    var complaintsData = function(array) {
      ctx.celllines = array;
      next();
    };
    var array = ctx.celllines.filter(function(ele, index, array){ return ele[ctx.params.filternamesec] === ctx.params.filtervaluesec;});
    complaintsData(array);
  };

  celllineController.loadById = function(ctx, next) {
    ctx.celllines = [];
    var complaintsData = function(array) {
      ctx.celllines = array;
      next();
    };
    var array = CellLine.allCellLines.find(function(ele, index, array){ return ele.cell_line_id === ctx.params.id;});
    complaintsData(array);
  };

  celllineController.index = function(ctx, next) {
    if(ctx.celllines.length) {
      cellListView.renderIndexPage(ctx.celllines);
    } else{
      page('/');
    }
  };

  celllineController.subpageIndex = function(ctx, next) {
    if(ctx.celllines) {
      cellLineProfileView.RenderProfile(ctx.celllines);
    } else{
      page('/');
    }
  };

  celllineController.resetFilters = function(ctx, next) {
    cellListView.resetFilters();
    next();
  }



  module.celllineController = celllineController;
})(window);
