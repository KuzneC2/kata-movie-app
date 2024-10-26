import { Component } from 'react';
import Tab from '../Tab/Tab';
import SearchLine from '../SearchLine/SearchLine';
import './Header.css';

export default class Header extends Component {
  constructor() {
    super();
  }

  render() {
    const { changeSearchLine, handleTabChange, displayRated } = this.props;
    const searchLine = !displayRated ? <SearchLine changeSearchLine={e => changeSearchLine(e)} /> : null;
    return (
      <>
        <Tab handleTabChange={label => handleTabChange(label)} />
        {searchLine}
      </>
    );
  }
}
