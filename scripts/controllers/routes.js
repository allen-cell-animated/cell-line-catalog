page('/',
  celllineController.loadAll,
  celllineController.index);

// page('/about', aboutController.index);
// page('/admin', adminController.index);

page('/cellline/:id',
  celllineController.loadAll,
  celllineController.loadById,
  celllineController.subpageIndex);

// Redirect home if the default filter option is selected:
// page('/category', '/');
// page('/author', '/');
//
// page('/author/:authorName',
//   celllineController.loadByAuthor,
//   celllineController.index);
//
// page('/category/:categoryName',
//   celllineController.loadByCategory,
//   celllineController.index);

page('*', function(){
  $('body').text('Not found!');
});

page();
