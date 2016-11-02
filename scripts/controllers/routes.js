page('/',
  celllineController.loadAll,
  celllineController.index);

// page('/about', aboutController.index);
// page('/admin', adminController.index);

page('/cellline/:id',
  celllineController.loadAll,
  celllineController.loadById,
  celllineController.subpageIndex);

page('/:filtername/:filtervalue',
  celllineController.filter,
  celllineController.restartFilter,
  celllineController.index);


page('/:filtername/:filtervalue/:filternamesec/:filtervaluesec',
  celllineController.filter,
  celllineController.filtersec,
  celllineController.restartFilter,
  celllineController.index);


// Redirect home if the default filter option is selected:
page('/:filtername/', '/');
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
