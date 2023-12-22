import router from '../../router'
import gsap from 'gsap'
import { TransparencyValues } from '../scene/TransparencyValues.js'
import { backView } from '../scene/CameraValues';

export function resetLocalValues(exp) {
    exp.ball.reset();
    exp.paddle.reset();
}

export function endGame() {
    const exp = window.experience;
    
    /* Scene opacity */
    gsap.to(window.experience.walls.wallMaterial, 
    { opacity: 0.0, duration: 1, ease:"expo.inOut"})
    TransparencyValues(exp.ball, exp.paddle, exp.field, 0.0, 0.0);
    backView();

    /* Reset all booleans */
    exp.localGameStarted = false;
    exp.matchMakingStarted = false;
    exp.tournamentStarted = false;
    
    /* Reset all choices */
    exp.chooseSoloLocal = false;
    exp.chooseMultiLocal = false;
    exp.chooseMatchmaking = false;
    exp.chooseTournament = false;

    /* Delete game instance */
    if (exp.localGame)
        delete exp.localGame;
}