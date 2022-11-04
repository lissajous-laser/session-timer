import React, { useEffect, useState } from 'react';
import beep from './audio/temple-bell.mp3';


const minToSec = 60;
const defaultBreakLength = 5;
const defaultSessionLength = 25;

/**
 * Entry point into app.
 * @return {JSX} The app.
 */
function App() {
  return (
    <div className="App">
        <Clock />
    </div>
  );
}

/**
 * Renders the timer.
 * @return {JSX} The timer.
 */
function Clock() {

  const [breakLength, setBreakLength] = useState(defaultBreakLength);
  const [sessionLength, setSessionLength] = useState(defaultSessionLength);
  // if clock is in the break interval
  const [isBreak, setIsBreak] = useState(false);
  // if clock is running
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(defaultSessionLength * minToSec);

  useEffect(() => {
    setTimeout(() => {

      if (isRunning) {
        setTimeLeft((state) => {

          if (state === 0) {

            const beepElement = document.getElementById("beep");
            beepElement.play();

            if (isBreak) {
              setIsBreak(false);
              return sessionLength * minToSec;
            } else {
              setIsBreak(true);
              return breakLength * minToSec;
            }
          }
          return state - 0.125;
        });
      }

    }, 125);
  }, [timeLeft, isRunning, isBreak, breakLength, sessionLength]);

  function toggleStartStop() {
    setIsRunning((state) => !state);
  }

  function formatTime(timeInSecs) {
    let mins = String(Math.floor(timeInSecs / 60));
    if (mins.length === 1) {
      mins = "0" + mins;
    }
    let secs = String(timeInSecs % 60);
    if (secs.length === 1) {
      secs = "0" + secs;
    }
    return String(mins) + ":" + String(secs);
  }


  function reset() {
    setIsRunning(false);
    setIsBreak(false);
    setBreakLength(defaultBreakLength);
    setSessionLength(defaultSessionLength);
    setTimeLeft(defaultSessionLength * minToSec);
    const beepElement = document.getElementById("beep");
    beepElement.pause();
    beepElement.fastSeek(0.0);
  }

  return (
    <div id="clock"
      className={`position-absolute top-50 start-50
        translate-middle card p-2 rounded-4`}
    >
      <div>
        <TimeSetter
          kind="break"
          interval={breakLength}
          setInterval={setBreakLength}
          setTimeLeft={setTimeLeft}
          isRunning={isRunning}
          isBreak={isBreak}
        />
        <TimeSetter
          kind="session"
          interval={sessionLength}
          setInterval={setSessionLength}
          setTimeLeft={setTimeLeft}
          isRunning={isRunning}
          isBreak={isBreak}
        />
      </div>
      <div className="card m-1 text-bg-light">
        <h4 id="timer-label" className="ms-3 mt-2">
          {isBreak ? "Break" : "Session"}
        </h4>
        <h2 id="time-left" className="ms-3">
          {formatTime(Math.ceil(timeLeft))}
        </h2>
        <div>
        <input type="button"
          id="start_stop"
          className="btn btn-outline-primary btn-sm"
          style={{width: "70%"}}
          value="Start/Stop"
          onClick={toggleStartStop}
        />
        <input
          type="button"
          id="reset"
          className="btn btn-outline-secondary btn-sm"
          style={{width: "30%"}}
          value="Reset"
          onClick={reset}
        />
        </div>
      </div>
      <audio src={beep}></audio>
    </div>
  );
}

function TimeSetter(props) {
  function increment() {
    if (props.interval < 60 && !props.isRunning) {
      props.setInterval(props.interval + 1);
      if ((props.kind === 'break' && props.isBreak)
      || (props.kind === 'session' && !props.isBreak)) {
        props.setTimeLeft((props.interval + 1) * minToSec);
      }
    }
  }

  function decrement() {
    if (props.interval > 1 && !props.isRunning) {
      props.setInterval(props.interval - 1);
      if ((props.kind === 'break' && props.isBreak)
          || (props.kind === 'session' && !props.isBreak)) {
        props.setTimeLeft((props.interval - 1) * minToSec);
      }
    }

  }

  return (
    <div
      className="setter card d-inline-flex m-1 text-bg-light"
      style={{width: "5.5rem"}}
    >
      <h6 id={props.kind + "-label"} className="ms-3 mt-3 mb-2 text-capitalize lh-sm">
        {props.kind + " length"}
      </h6>
      <h4 id={props.kind + "-length"} className="ms-3">{props.interval}</h4>
      <div>
        <input type="button"
          id={props.kind + "-decrement"}
          className="w-50 btn btn-outline-secondary btn-sm"
          value="-" onClick={decrement}
        />
        <input
          type="button"
          id={props.kind + "-increment"}
          className="w-50 btn btn-outline-secondary btn-sm"
          value="+"
          onClick={increment}
        />
      </div>
      <audio id="beep" src={beep}></audio>
    </div>
  );
}

export default App;
