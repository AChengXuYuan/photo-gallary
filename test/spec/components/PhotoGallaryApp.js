'use strict';

describe('PhotoGallaryApp', () => {
  let React = require('react/addons');
  let PhotoGallaryApp, component;

  beforeEach(() => {
    let container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    PhotoGallaryApp = require('components/PhotoGallaryApp.js');
    component = React.createElement(PhotoGallaryApp);
  });

  it('should create a new instance of PhotoGallaryApp', () => {
    expect(component).toBeDefined();
  });
});
