page('/',
  celllineController.privateAlert,
  celllineController.loadAll,
  celllineController.resetFilters,
  celllineController.mainindex);

page('/new.html',
  celllineController.loadAll);

page('/cell-line-catalog',
  celllineController.privateAlert,
  celllineController.loadAll,
  celllineController.resetFilters,
  celllineController.index);

page('/cellline/:id/clone/:cloneid',
  celllineController.loadAll,
  celllineController.privateAlert,
  celllineController.loadById,
  celllineController.subpageIndex);

page('/filter/:filtername/:filtervalue',
  celllineController.privateAlert,
  celllineController.loadAll,
  celllineController.filter,
  celllineController.checkContext,
  celllineController.restartFilter,
  celllineController.index);


page('/filter/:filtername/:filtervalue/:filternamesec/:filtervaluesec',
  celllineController.loadAll,
  celllineController.filter,
  celllineController.filtersec,
  celllineController.checkContext,
  celllineController.index
);

page('/filter/:filtername/:filtervalue/:filternamesec/:filtervaluesec/:filternamelast/:filtervaluelast',
  celllineController.loadAll,
  celllineController.filter,
  celllineController.filtersec,
  celllineController.filterthird,
  celllineController.checkContext,
  celllineController.index
);


// Redirect home if the default filter option is selected:
page('/:filtername/', '/cell-line-catalog');


page();
