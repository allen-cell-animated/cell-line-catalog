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
    var array = filter_fn(ctx, CellLine.allCellLines, ctx.params.filtername, ctx.params.filtervalue);
    complaintsData(array);
  };

  celllineController.filtersec = function(ctx, next) {
    var complaintsData = function(array) {
      ctx.celllines = array;
      next();
    };
    var array = filter_fn(ctx, ctx.celllines, ctx.params.filternamesec, ctx.params.filtervaluesec);
    complaintsData(array);
  };

  celllineController.filterthird = function(ctx, next) {
    var complaintsData = function(array) {
      ctx.celllines = array;
      next();
    };
    var array = filter_fn(ctx, ctx.celllines, ctx.params.filternamelast, ctx.params.filtervaluelast);
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
  filter_fn = function(ctx, cell_lines, filtername, filtervalue) {
    return cell_lines.filter(function(ele, index, array){
      const fname = filtername;
      const fvalue = filtervalue;
      // SPECIAL CASES:

      // fluorescent tag
      if (fname === 'Main_fluorescent_tag') {
        if (fvalue === '(m)EGFP') {
          return ele[fname].includes('EGFP');
        } else if (fvalue === 'mTagRFP-T') {
          return ele[fname].includes('mTagRFP');
        }
      }

      // structure
      if (fname === 'Main_structure') {
        if (fvalue.includes('Nucleolus')) {
          let target = fvalue.substring(fvalue.indexOf('(') + 1, fvalue.indexOf(')'));
          return ele[fname].toLowerCase().includes(target.toLowerCase());  // ###### REMOVE TOLOWERCASE IF CAPITALIZATION IS CONSISTANT#####
        }
      }

      // Handle NA
      if (fvalue === 'NA') {
        return ele[fname] ==='NA';
      }

      // GENERAL CASE: if entry <INCLUDES> the filter value in its associated field
      return ele[fname].includes(fvalue);
    });
  };

  module.celllineController = celllineController;
})(window);
