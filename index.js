
import React, { useState, useEffect } from "react";
import { useSpring, animated as a } from "react-spring";

export default function App() {
  const [options, setOptions] = useState(null)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    const json = localStorage.getItem('memorygamehighscore')
    const savedScore = JSON.parse(json)
    if (savedScore) {
      setHighScore(savedScore)
    }
  }, [])

  return (
    <div>
      <div className="container">
        <h1>Memory Game(Test 3)</h1>
        <div>High Score: {highScore}</div>
        <div>
          {options === null ? (
            <>
              <button onClick={() => setOptions(20)}>Start Game</button>
              
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  const prevOptions = options
                  setOptions(null)
                  setTimeout(() => {
                    setOptions(prevOptions)
                  }, 5)
                }}
              >
                Start Over
              </button>
              <button onClick={() => setOptions(null)}>Main Menu</button>
            </>
          )}
        </div>
        <style jsx global>
  {`
    body {
      text-align: center;
      font-family: -apple-system, sans-serif;
      background-color: #91b187;
      color: #e0cbaf;
    }
    .container {
      width: 1060px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      color: #e0cbaf;
      
    }
    button {
      background: #e7a339;
      border-radius: 4px;
      font-weight: 700;
      color: #e0cbaf;
      border: none;
      padding: 7px 15px;
      margin-left: 8px;
      cursor: pointer;
    }
    button:hover {
      background-color:#4aafd5;
      color: #ffffff;
    }
    button:focus {
      outline: 0;
    }
    #cards {
      width: 650px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      background-color: #e0cbaf;
      height: 800px;
      padding-bottom: -50px;
      padding-top: 30px;
    }
    .card {
      
      width: 100px;
      height: 150px;
      margin-bottom: 20px;
      margin-left: 10px;
      margin-right: 20px;
    }
    .card:not(:nth-child(6n)) {
      margin-right: 20px;
      margin-left: 10px;
    }

    .c {
      position: absolute;
      max-width: 160px;
      max-height: 160px;
      width: 50ch;
      height: 50ch;
      cursor: pointer;
      will-change: transform, opacity;
    }
    .Square {
      margin-top: -18px; 
      posistion: relative;    
          }

    .label {
      posistion: relative;
     top:50%;
     padding: 0;
     margin-top: -30px;

    }

    .front,
    .back {
      background-size: cover;
    }

    .back {
      width: 100px;
      height: 150px;
     background-color:#4aafd5 ;
    }

    .front {
      width: 100px;
      height: 150px;
     
    }
    
  `}
</style>
      </div>

      {options ? (
        <MemoryGame
          options={options}
          setOptions={setOptions}
          highScore={highScore}
          setHighScore={setHighScore}
        />
      ) : (
        <h2 >Click Start to begin!</h2>
      )}
    </div>
  )
}

function MemoryGame({options, setOptions, highScore, setHighScore}) {
  const [game, setGame] = useState([])
  const [flippedCount, setFlippedCount] = useState(0)
  const [flippedIndexes, setFlippedIndexes] = useState([])

  const colors = [
    '#ecdb54',
    '#e34132',
    '#6ca0dc',
    '#944743',
    '#dbb2d1',
    '#ec9787',
    '#00a68c',
    '#645394',
    '#6c4f3d',
    '#ebe1df',
    '#bc6ca7',
    '#bfd833',
  ]

  useEffect(() => {
    const newGame = []
    for (let i = 0; i < options / 2; i++) {
      const firstOption = {
        id: 2 * i,
        colorId: i,
        color: colors[i],
        flipped: false,
      }
      const secondOption = {
        id: 2 * i + 1,
        colorId: i,
        color: colors[i],
        flipped: false,
      }

      newGame.push(firstOption)
      newGame.push(secondOption)
    }

    const shuffledGame = newGame.sort(() => Math.random() - 0.5)
    setGame(shuffledGame)
  }, [])

  useEffect(() => {
    const finished = !game.some(card => !card.flipped)
    if (finished && game.length > 0) {
      setTimeout(() => {
        const bestPossible = game.length
        let multiplier
  
        if (options === 12) {
          multiplier = 5
        } else if (options === 18) {
          multiplier = 2.5
        } else if (options === 24) {
          multiplier = 1
        }
  
        const pointsLost = multiplier * (0.66 * flippedCount - bestPossible)
  
        let score
        if (pointsLost < 100) {
          score = 100 - pointsLost
        } else {
          score = 0
        }
  
        if (score > highScore) {
          setHighScore(score)
          const json = JSON.stringify(score)
          localStorage.setItem('memorygamehighscore', json)
        }
  
        const newGame = confirm('You Win!, SCORE: ' + score + ' New Game?')
        if (newGame) {
          const gameLength = game.length
          setOptions(null)
          setTimeout(() => {
            setOptions(gameLength)
          }, 5)
        } else {
          setOptions(null)
        }
      }, 500)
    }
  }, [game])

  if (flippedIndexes.length === 2) {
    const match = game[flippedIndexes[0]].colorId === game[flippedIndexes[1]].colorId
  
    if (match) {
      const newGame = [...game]
      newGame[flippedIndexes[0]].flipped = true
      newGame[flippedIndexes[1]].flipped = true
      setGame(newGame)
  
      const newIndexes = [...flippedIndexes]
      newIndexes.push(false)
      setFlippedIndexes(newIndexes)
    } else {
      const newIndexes = [...flippedIndexes]
      newIndexes.push(true)
      setFlippedIndexes(newIndexes)
    }
  }

  if (game.length === 0) return <div>loading...</div>
  else {
    return (
      <div id="cards">
        {game.map((card, index) => (
          <div className="card" key={index}>
            <Card
              id={index}
              color={card.color}
              game={game}
              flippedCount={flippedCount}
              setFlippedCount={setFlippedCount}
              flippedIndexes={flippedIndexes}
              setFlippedIndexes={setFlippedIndexes}
             
            />
            
          </div>
        ))}
      </div>
    )
  }
}

function Card({
  id,
  color,
  game,
  flippedCount,
  setFlippedCount,
  flippedIndexes,
  setFlippedIndexes,
}) {
  const [flipped, set] = useState(false)
  const {transform, opacity} = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: {mass: 5, tension: 500, friction: 80},
  })

  useEffect(() => {
    if (flippedIndexes[2] === true && flippedIndexes.indexOf(id) > -1) {
      setTimeout(() => {
        set(state => !state)
        setFlippedCount(flippedCount + 1)
        setFlippedIndexes([])
      }, 1000)
    } else if (flippedIndexes[2] === false && id === 0) {
      setFlippedCount(flippedCount + 1)
      setFlippedIndexes([])
    }
  }, [flippedIndexes])

  const onCardClick = () => {
    if (!game[id].flipped && flippedCount % 3 === 0) {
      set(state => !state)
      setFlippedCount(flippedCount + 1)
      const newIndexes = [...flippedIndexes]
      newIndexes.push(id)
      setFlippedIndexes(newIndexes)
    } else if (
      flippedCount % 3 === 1 &&
      !game[id].flipped &&
      flippedIndexes.indexOf(id) < 0
    ) {
      set(state => !state)
      setFlippedCount(flippedCount + 1)
      const newIndexes = [...flippedIndexes]
      newIndexes.push(id)
      setFlippedIndexes(newIndexes)
    }
  }

  return (
    <div onClick={onCardClick}>
      <div>
      <a.div
        className="c back"
        
        style={{
          opacity: opacity.interpolate(o => 1 - o),
          transform,
        }}
      />
      </div>
      <div>
      <a.div

        className="c front"
        style={{
          opacity,
          transform: transform.interpolate(t => `${t} rotateX(180deg)`),
          background: color,
          height:100
          
        }}
        
      />
       <Square />
   <Label color={color}/>
      </div>
    
   
  
    </div>
  )

  
}

class Label extends React.Component {
  render() {
    var labelStyle = {
      fontFamily: "sans-serif",
      fontWeight: "bold",
     color: "black"
      
     
     

    };
    return (
      
<div className="label" style={labelStyle}>{this.props.color}</div>
    );
  }
}

class Square extends React.Component {
  render() {
    var squareStyle = {
      
      // display: "inline-block",
      backgroundColor: "#FFF",
      width: 100,
      height: 150,
      boxShadow: "0px 0px 5px #666",
     



    };

    return (
      <div className="Square" style={squareStyle}>
       
      </div>
    );
  }
}