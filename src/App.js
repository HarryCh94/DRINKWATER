import React, { Component } from 'react'
import Push from 'push.js'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appRunning: false,
      timer: 0,
      cupsPerDay: 0,
      timePerCup: 0
    };
  }

  componentDidMount() {
    Push.Permission.request(() => {
      console.log('Client accepts push notifications!');
    }, () => {
      console.log('Client denied push notifications!');
    });
  }

  startTimer = () => {

    if (!this.state.appRunning) {
      this.calculateTimer();
    } else {
      document.getElementById('error').innerHTML = 'App is already running!';
    }

  }

  // Timer Logic
  calculateTimer = () => {
    const recWaterPerDay = 3;
    const cupSize =  document.getElementById('glass-size').value * 0.0295735;
    const cupsPerDay = Math.ceil(recWaterPerDay / cupSize);

    this.setState({ cupsPerDay: cupsPerDay });

    if (document.getElementById('glass-size').value == 0) {
      document.getElementById('error').innerHTML = 'Please enter your glass size.';
    } else {
      document.getElementById('error').innerHTML = '';

      const startDate = new Date();
      const minutesPerCup =  Math.floor(600 / cupsPerDay);

      document.getElementById('start-time-display').innerHTML = `${startDate}`;
      document.getElementById('cup-display').innerHTML = `<b>Cups to drink:</b> ${cupsPerDay}`
      document.getElementById('cup-time-display').innerHTML = `<b>Drinking every:</b> ${minutesPerCup} minutes`;
      document.getElementById('start-timer-btn').setAttribute('style', 'display: block');
      document.getElementsByClassName('demo-card-square')[0].setAttribute('style', 'box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12)');
      
      

      this.timeDisplay(minutesPerCup * 60);
      this.setState({ timer: minutesPerCup * 60, timePerCup: minutesPerCup * 60 });
    }
  }

  // Display MM:SS time format to HTML
  timeDisplay = (time) => {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds == 0) {
      seconds = '00'
    } else if (seconds < 10 && seconds > 0) {
      seconds = '0' + seconds
    }

    // Update Clock
    document.getElementById('timer-display').innerHTML = `${minutes}:${seconds}`;
  }

  // Countdown
  countDown = () => {

    if (this.state.appRunning == false) {
      this.setState({ appRunning: true });
    
      const countDown = setInterval( () => {
  
        if (this.state.timer == 0) {
  
          if (this.state.cupsPerDay == 0) {
            this.setState({ appRunning: false, timer: 0 });
            clearInterval(countDown);
          } else {
            this.setState({ cupsPerDay: this.state.cupsPerDay - 1}, () => {
              document.getElementById('cup-display').innerHTML = `<b>Cups to drink:</b> ` + this.state.cupsPerDay;
            });
            this.setState({ timer: this.state.timePerCup });
            Push.create('💦 DRINK! 💦');
          }
        }
  
        if (!this.state.cupsPerDay == 0) {
          this.setState({ timer: this.state.timer - 1 });
          this.timeDisplay(this.state.timer);
        }
        
      }, 1000)
    } else {
      document.getElementById('error').innerHTML = 'App is already running!';
    }
  }

  // Dummy Countdown
  testCD = () => {
    this.setState({ 
      timer: 2,
      timePerCup: 2,
      cupsPerDay: 2
    }, () => {
      document.getElementById('start-time-display').innerHTML = new Date;
      document.getElementById('cup-display').innerHTML = `<b>Cups to drink:</b> ${2}`
      document.getElementById('cup-time-display').innerHTML = `<b>Drinking every:</b> ${2} seconds`;
      document.getElementById('start-timer-btn').setAttribute('style', 'display: block');
      document.getElementsByClassName('demo-card-square')[0].setAttribute('style', 'box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12)');
      document.getElementById('error').innerHTML = `This is a demo run. <p>2 notifications will go off every 2 seconds.</p>`;
      this.countDown;
    })
  }

  render() {
    return (
      <div>
        <header>
          <a href='http://witespace.ca' target='_blank'><h4>WITESPACE LABS 🔬</h4></a>
          <h1>DRINK WATER</h1>
        </header>
        <p className='accent'>The annoying hydration reminder app.</p>
        
        <i className="material-icons" id='help-btn' onClick={ this.testCD }>help</i>

        <div id='info-div'>
          <p>
            Scientists recommend at least 2L of water per day. <br />
            We are going to drink <span className='accent'>3L</span>. <br />
            Start the timer to get notified of your water intake over 10 hours. 
          </p>
        </div>

        <div className="mdl-textfield mdl-js-textfield">
          <input className="mdl-textfield__input" type="number" id="glass-size" />
          <label className="mdl-textfield__label" htmlFor="sample1">Glass Size (oz)</label>
        </div>
        <div>
          <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect"
          onClick={ this.startTimer }>
            Submit
          </button>
        </div>

        {/* Error Msg */}
        <p id='error'></p>

        <div className="demo-card-square mdl-card mdl-shadow--2dp">
          <img src='/img/water-drop.png' alt='water drop' className='rotating' id='water-drop'/>
          <div className="mdl-card__supporting-text">
            <p id='start-time-display'></p>
            <p id='cup-display'></p>
            <p id='cup-time-display'></p>
            <p id='timer-display'></p>
          </div>
          <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect"
            onClick={ this.countDown } id='start-timer-btn'>
              Start Timer
          </button>
        </div>


      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Roboto');
        @import url('https://fonts.googleapis.com/css?family=Comfortaa');

        body {
          min-height: 100vh;
          text-align: center;
          font-family: 'Roboto', sans-serif;

          padding: 64px 0;
        }

        a {
          text-decoration: none;
        }

        header {
          color: #03a9f4;
          letter-spacing: 3px;
          font-family: 'Comfortaa', cursive;
        }

        h4 {
          color: #DD3955;
          font-weight: bold;
          margin-bottom: 64px;
        }

        button {
          color: white !important;
        }

        #help-btn {
          position: absolute;
          top: 0;
          right: 0;

          margin: 64px;
          font-size: 48px;
          color: #03a9f4;

          cursor: pointer;
        }

        @media (max-width: 400px) {
          #help-btn {
            margin: 16px;
            font-size: 32px; 
          }
        }

        .accent {
          color: #03a9f4;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .mdl-textfield {
          display: block;
          margin: 0 auto;
          width: 120px;
        }

        .demo-card-square {
          margin: 0 auto;
          margin-top: 48px;
          width: 350px;

          box-shadow: none;
        }

        #timer-div {
          margin: 24px 0 24px 0;
        }

        #error {
          margin-top: 16px;
          margin-bottom: 0;
          color: red;
        }

        #timer-display {
          margin: 32px 0 32px 0;

          font-size: 2rem;

          color: #E91D63;
        }
        
        @keyframes rotating {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .rotating {
          animation: rotating infinite 10s linear;
        }

        #water-drop {
          width: 80px;  
          height: auto;

          margin: 16px auto;
        }

        #start-timer-btn {
          display: none;
        }
      `}</style>
      </div>

      
    );
  }
}

export default App;
