import React, {Component} from 'react';
import {SpinnerPage} from './Spinner';

export default class Lazy extends Component {
  constructor(props) {
    super(props);
    this.state = {module: null};
  }

  async componentDidMount() {
    let module = await this.props.module;
    module = module.default ? module.default : module;
    this.setState({module});
  }

  render() {
    const {module: Module} = this.state;
    return Module ? <Module {...this.props} /> : <SpinnerPage />;
  }
}
