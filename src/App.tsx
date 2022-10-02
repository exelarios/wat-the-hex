import React, { 
  useCallback, 
  useEffect, 
  useMemo, 
  useState 
} from 'react';

import './App.css';

function generateHexColor(): string {
  const value = Math.floor(Math.random() * 16777216).toString(16);
  return "#000000".slice(0, -value.length) + value;
}

const amountOfOptions = 3;

function useFadeText(fadeOutTime = 2000) {
  const [text, setText] = useState("");

  useEffect(() => {
    const fadeOutTimeout = setTimeout(() => {
      setText("");
    }, fadeOutTime);

    return () => {
      clearTimeout(fadeOutTimeout);
    }
  }, [text, fadeOutTime]);

  return [text, setText] as const;
}

type StatProps = {
  label: string,
  value: number
}

function Stat(props: StatProps) {
  const { label, value } = props;
  return (
    <div>
      <b>{label}</b>
      <p className="value">{value}</p>
    </div>
  )
}

function App() {

  // Select a random index within the option as the correct color.
  const [color, setColor] = useState((Math.floor(Math.random() * 10)) % amountOfOptions);
  const [options, setOptions] = useState<string[]>([]);
  const [message, setMessage] = useFadeText();

  const [points, setPoints] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);

  useEffect(() => {
    const colors: string[] = [];
    for (let value = 0; value < amountOfOptions; value++) {
      colors.push(generateHexColor());
    }
    setOptions(colors);
  }, [color]);

  const handleColorOption = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const element = event.target as HTMLButtonElement;
    const optionColor = element.textContent;
    const correctColor = options[color].toUpperCase();

    if (correctColor === optionColor) {
      setMessage("CORRECT");
      setColor((Math.floor(Math.random() * 10)) % amountOfOptions);
      setPoints(points + 10);
      setCorrect(correct + 1);
    } else {
      setMessage("INCORRECT");
      const penalty = 15;
      if (points > 0 && points - penalty > 0) {
        setPoints(points - penalty);
      } else {
        setPoints(0);
      }
      setIncorrect(incorrect + 1);
      element.disabled = true;
    }
  }, [color, options, setMessage, points, correct, incorrect]);

  const buttons = useMemo(() => {
    return options.map((color) => {
      return (
        <button
          key={color}
          onClick={handleColorOption}>
          {color.toUpperCase()}
        </button>
      );
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, options, handleColorOption]);

  return (
    <div className="App">
      <main>
        <h1>Wat teh hex?</h1>
        <section
          id="color-preview"
          style={{ backgroundColor: `${options[color]}`}}>
          <h1>{message}</h1>
        </section>
        <section id="color-options">
          {buttons}
        </section>
        <section id="stats">
          <Stat label="Points" value={points}/>
          <Stat label="Correct" value={correct}/>
          <Stat label="Incorrect" value={incorrect}/>
        </section>
      </main>
    </div>
  );
}

export default App;
