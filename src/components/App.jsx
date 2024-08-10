import { useState, useEffect } from "react";
import Card from './Card'
import '../styles/style.css';
import {getPokemon, getPokemonColor} from "./PokemonAPI";

const numCards = 20;

function MemoryCard({click, name, imgurl, type, color}) 
{
    const pokemonColor = color; 
    const colorStyle = {
        color: pokemonColor 
    }


    return (
        <div onClick={click} class="pokemonCard">
            <Card>
                <img className="pokemonImage" src={imgurl} alt={name} />
                <div className="pokemonInfo">
                    <p style={colorStyle}>{name}</p>
                    <p className="pokemonType">{type}</p>
                </div>
            </Card>
        </div>
    );
};

function Dashboard() 
{
    const [cardContainer, setCardContainer] = useState([]);

    useEffect(() => {
        let initCards = async () => {
            let cardList = []
            const floorId = Math.floor(Math.random() * 100);
            for (let i = floorId; i < floorId + numCards; i++) {
                const pokemon = await getPokemon(i).then(data => {return data}); 
                const pokemonColor = await getPokemonColor(i).then(data => {return data});

                const newCard = {"id": i,  
                                 "name": pokemon.name, 
                                 "imgurl": pokemon.sprites.front_default, 
                                 "type": pokemon.types[0].type.name, 
                                 "color": pokemonColor.color.name};
                console.log(newCard);

                cardList.push(newCard)
            }
            setCardContainer(cardList);
        }
        initCards();
    }, []);

    const [usedCardIds, setUsedCardIds] = useState(() => new Set());
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isStart, setIsStart] = useState(true);


    const addId = (id) => {
        setUsedCardIds(prev => new Set(prev).add(id));
    }

    const isIdUsed = (id) => {
        return usedCardIds.has(id);
    }

    const shuffleCards = () => {
        let array = [...cardContainer];
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

                // Pick a remaining element...
                let randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                // And swap it with the current element.
                [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        setCardContainer(array);
    }

    const incrementScore = () => {
        setScore(score + 1); 
        setHighScore(Math.max(score + 1, highScore));

    }

    const resetScore = () => {
        setScore(0);
        setUsedCardIds(() => new Set());
    }

    const handleClickedCard = (card) => {
        if (isStart) setIsStart(false);


        if (!isIdUsed(card.id)) // if player picked a card already picked
        {
            shuffleCards();
            addId(card.id);
            incrementScore();
        } else {
            resetScore();
        }
    }

    const displayCards = () => {
        if (cardContainer.length) 
        {
            return cardContainer.map((card) => {
                return (
                    <MemoryCard click={() => handleClickedCard(card)} imgurl={card.imgurl} name={card.name} color={card.color} type={card.type}/>
                );
            })
        } else {
            return (
                <div>Loading...</div>
            );
        }
    }

    const displayScoreBoard = () => {
        let topMessage = "Memorize the cards! Click cards you have not picked before to increase score!"; 
        if (score === 0 && !isStart) {
            topMessage = "Woops you picked that one already!";
        } 

        return (
            <div className="scoreContainer">
                <div className="score">Current Score: {score}</div>
                <div className="score">High Score: {highScore}</div>
                <div className="score">{topMessage}</div>
            </div>
        );

    }


    return (
        <>
            {displayScoreBoard()}
            <div className="dashBoard">{displayCards()}</div>
        </>
    );
}



function App()
{
    return (
        <div>
            <Dashboard/>
        </div>
    );
}

export default App;