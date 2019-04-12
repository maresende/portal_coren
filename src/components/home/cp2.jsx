import React from 'react'
import Main from '../template/Main'


export default class USerCrud extends React.Component {
    state = {
      isGoing: true,
      documento: this.props.documento,
      birth: this.props.birth
    };

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <Main>
      <form>
        <label>
          Documento: 
          <input
            name="documento"
            type="text"
            value={this.state.documento}
            onChange={e => this.handleInputChange(e)} />
        </label>
	<label>
          Nascimento:
          <input
            name="birth"
            type="text"
            value={this.state.birth}
            onChange={e => this.handleInputChange(e)} />
        </label>

	<br />      
	<label>
          Possui registro no CorenMG?:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
      </form>
    </Main>
    );
  }
}
