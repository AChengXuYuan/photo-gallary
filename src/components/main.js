'use strict';

var PhotoGallaryApp = require('./PhotoGallaryApp');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

var content = document.getElementById('content');

var Routes = (
  <Route handler={PhotoGallaryApp}>
    <Route name="/" handler={PhotoGallaryApp}/>
  </Route>
);

Router.run(Routes, function (Handler) {
  React.render(<Handler/>, content);
});

