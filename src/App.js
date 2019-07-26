import React from 'react';
import './App.css';

const PAGE_SIZE=15;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      activeCards: [],
      search: '',
      page: 0,
    };
  }

  //@TODO pagination buttons
  setPage = (p) => {
    this.setState({...this.state,
      activeCards: this.state.cards.slice(p*PAGE_SIZE, (p+1)*PAGE_SIZE),
      page: p,
    });
  }

  handleSearchChange = (event) => {
    console.log(event.target.value);
    this.setState({...this.state, search: event.target.value});
    let s = event.target.value;
    fetch('https://api.harrykwon.dev/card?name=' + event.target.value)
    .then(res => res.json())
    .then(
      (result) => {
        console.log(s +'=?='+this.state.search);
        if(s === this.state.search) {
          this.setState({...this.state, cards: result.cards});
          this.setPage(0);
          console.log(this.state);
        }
      },
      (error) =>  {
        console.log(error);
      }
    )
  }


  render() {
    return (
      <div className='App'>
        <Searchbox name='name' onChange={this.handleSearchChange}/>
        <Pagination pages={Math.floor(this.state.cards.length/PAGE_SIZE)}
      setPage={this.setPage}
      currentPage={this.state.page}/>

        <Cardlist cards={this.state.activeCards}/>
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

function Pagination(props) {
  let pages = [];
  let start = Math.max(0, props.currentPage-5);
  let end = Math.min(props.pages, start+5*2);
  console.log(start, end);

  for(let i = start; i < end; i++) {
    pages.push(<button onClick={() => props.setPage(i)}>{i+1}</button>)
  }

  return(
    <div className='pagination'>
      {pages}
    </div>
  )
}


function Cardlist(props) {
  const cardData = props.cards;
  console.log(cardData);
  
  let cards = cardData.map((c) => {
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
      <div id='card-list'>
        {cards}
      </div>
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
