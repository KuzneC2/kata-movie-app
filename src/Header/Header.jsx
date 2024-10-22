import { Component } from 'react';
import Tab from '../Tab/Tab';
import SearchLine from '../SearchLine/SearchLine';
import './Header.css';

export default class Header extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <>
        <Tab />
        <SearchLine />
      </>
    );
  }
}