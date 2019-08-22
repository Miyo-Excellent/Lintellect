// Dependencies
import React, {Component} from 'react';
import {Tab} from 'semantic-ui-react';

export default class Tabs extends Component {
  constructor(props) {
    super(props);
  }

  newPanes(panes) {
    return panes.map(({title, Children}) => ({
      menuItem: title, render: () => (
        <Tab.Pane attached={false}>
          <Children/>
        </Tab.Pane>
      )
    }));
  }

  render() {
    const {data} = this.props;
    const panes = this.newPanes(data);

    return (
      <Tab
        menu={{secondary: true, pointing: true}}
        panes={panes}
      />
    );
  }
}

