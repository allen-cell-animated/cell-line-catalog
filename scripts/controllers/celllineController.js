(function(module){
  var celllineController = {};

  celllineController.loadAll = function(ctx, next) {
    var cellLineData = function(allCellLines) {
      ctx.celllines = CellLine.allCellLines;
      next();
    };
    if (CellLine.allCellLinesFB.length){
      ctx.celllines = CellLine.allCellLines;
      next();
    }
    else{
      CellLine.updateData('/data/cell_line_catalog.json', 'cell-lines', cellLineData);

    }
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



  module.celllineController = celllineController;
})(window);
