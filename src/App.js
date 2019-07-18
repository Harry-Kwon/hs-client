import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: []
    };
  }

  handleChange = (event)=>{
    console.log(event.target.value)
    fetch('https://api.harrykwon.dev/card?name=' + event.target.value)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({...this.state, cards: result.cards});
      },
      (error) =>  {
        console.log(error);
      }
    )
  }

  render() {
    return (
      <div className='App'>
        <Searchbox name='name' onChange={this.handleChange}/>

        <Cardlist cards={this.state.cards}/>
      </div>
    );
  }
}

//TODO refactor - move logic into App and pass new props to Cardlist (onChangeHandler)
// Searchbox will take onChangeHandler as a prop
function Searchbox(props) {
  return (
    <form>
      <p>Name</p>
      <input
        type='text'
        name={props.name}
        className='card-search-input'
        onChange={props.onChange}></input>
    </form>
  )
}

function Cardlist(props) {
  const cardData = props.cards;
  console.log(cardData);

  const cards = cardData.map((c) => {
    return(
      <Card
        key={c.id}
        name={c.name}
        image={c.image}
      />
    )
  });

  return (
    <div id='card-container'>
      <ul>
        {cards}
      </ul>
    </div>
  )
}

function Card(props) {
  return (
    <a href='/'>
      <img
        className='Card'
        src={props.image}
        alt={props.name}
      />
    </a>
  )
}

export default App;
