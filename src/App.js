import React from 'react';
import './App.css';

const PAGE_SIZE=15;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: [],
    };
  }

  onCardClick = (card) => {
    this.setState({...this.State, deck: [...this.state.deck, card]});
  }

  render() {
    return(
      <div className="App">
        <CardViewer onclick={this.onCardClick}/>
        <DeckBuilder deck={this.state.deck}/>
      </div>
    )

  }
}

function DeckBuilder(props) {
  let cardlist = {};
  props.deck.forEach((c)=>{
    if(cardlist[c.name]>0) {
      cardlist[c.name]+=1;
    } else {
      cardlist[c.name]=1;
    }
  });

  let decklistview=[];
  for(let cardName in cardlist) {
    decklistview.push(
      <li>
        <p className="deck-card-name">{cardName}</p>
        <p className="deck-card-count">{cardlist[cardName]}</p>
      </li>
    )
  }

  return(
    <div className="Deck-Builder">
      <textarea rows="1" defaultValue="New Deck"></textarea>
      <ul>
        {decklistview}
      </ul>
    </div>
  )
}

class CardViewer extends React.Component {
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
      <div className='Card-Viewer'>
        <Searchbox name='name' onChange={this.handleSearchChange}/>
        <Pagination pages={Math.floor(this.state.cards.length/PAGE_SIZE)}
      setPage={this.setPage}
      currentPage={this.state.page}/>

        <Cardlist cards={this.state.activeCards}
          onclick={this.props.onclick}
        />
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
        onclick={()=>{props.onclick(c)}}
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
    <img
      className='Card'
      src={props.image}
      alt={props.name}
      onClick={props.onclick}
    />
  )
}

export default App;
