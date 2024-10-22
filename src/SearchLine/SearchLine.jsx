import { Component } from 'react';

import './SearchLine.css';

export default class SearchLine extends Component {
  constructor() {
    super();
  }

  render() {
    return <input className="header-input" type="text" placeholder="Type to search..." />;
  }
}
