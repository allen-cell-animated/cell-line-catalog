page('/',
  celllineController.loadAll,
  celllineController.resetFilters,
  celllineController.mainindex);

page('/cell-line-catalog',
  celllineController.loadAll,
  celllineController.resetFilters,
  celllineController.index);

// page('/about', aboutController.index);
// page('/admin', adminController.index);

page('/cellline/:id',
  celllineController.loadAll,
  celllineController.loadById,
  celllineController.subpageIndex);

page('/:filtername/:filtervalue',
  celllineController.loadAll,
  celllineController.filter,
  celllineController.checkContext,
  celllineController.restartFilter,
  celllineController.index);


page('/:filtername/:filtervalue/:filternamesec/:filtervaluesec',
  celllineController.loadAll,
  celllineController.filter,
  celllineController.filtersec,
  celllineController.checkContext,
  celllineController.index
);

  page('/:filtername/:filtervalue/:filternamesec/:filtervaluesec/:filternamelast/:filtervaluelast',
  celllineController.loadAll,
  celllineController.filter,
  celllineController.filtersec,
  celllineController.filterthird,
  celllineController.checkContext,
  celllineController.index
);


// Redirect home if the default filter option is selected:
page('/:filtername/', '/cell-line-catalog');
// page('/author', '/');
//
// page('/author/:authorName',
//   celllineController.loadByAuthor,
//   celllineController.index);
//
// page('/category/:categoryName',
//   celllineController.loadByCategory,
//   celllineController.index);

// page('*', function(){
//   $('body').text('Not found!');
// });

page();
