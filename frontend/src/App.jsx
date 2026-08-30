import { useGame } from './hooks/useGame.js';
import Setup from './components/Setup.jsx';
import GameScreen from './components/GameScreen.jsx';
import ScoringScreen from './components/ScoringScreen.jsx';
import EndScreen from './components/EndScreen.jsx';
import './styles/app.css';

export default function App() {
  const { state, error, busy, actions } = useGame();

  if (!state) {
    return <Setup onStart={actions.startGame} busy={busy} error={error} />;
  }

  if (state.phase === 'GAME_OVER') {
    return <EndScreen state={state} onNewGame={actions.newGame} />;
  }

  if (state.phase === 'SCORING') {
    return <ScoringScreen state={state} actions={actions} />;
  }

  return <GameScreen state={state} actions={actions} error={error} />;
}
