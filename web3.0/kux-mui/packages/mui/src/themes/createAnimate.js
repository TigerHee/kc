/**
 * Owner: victor.ren@kupotech.com
 */
export default () => {
  return {
    ease: 'cubic-bezier(0.2, 0, 0, 1)',
    easeIn: 'cubic-bezier(0.3, 0, 1, 1)',
    easeOut: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
    easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
    generateSpringPath,
  };
};

/**
 * 弹性曲线参数
 * spring(tension, friction);
 */
const TENSION = 400.47;
const FRICTION = 26.72;

/**
 * generateSpringPath
 * ```
 * import { keyframes } from '@emotion/react'
 * const from = 0;
 * const to = 1;
 * const duration = 300;
 * const path = generateSpringPath(from, to, 300);
 * const show = keyframes`
 * from {
 *    transform: translate3d(0,${from * 100},0) scale(${from}, ${from});
 * }
 * to {
 *    transform: translate3d(0,${to * 100},0) scale(${to}, ${to});
 * }
 * ${path.map((cur, i)=>`
 * ${i * 100 / path.length}% {
 *    transform: translate3d(0,${cur * 100},0) scale(${cur}, ${cur});
 * }`).join('')}
 * `
 * ```
 * @param {number} from
 * @param {number} to
 * @param {number} duration
 * @returns {number[]}
 */
function generateSpringPath(from, to, duration) {
  return generateSpringRK4(TENSION, FRICTION, duration)(from, to);
}

/**
 * from velocity.js
 * https://github.com/julianshapiro/velocity/blob/767e35cac12120be526eef330e4d988b2c3cfc3c/src/Velocity/easing/spring_rk4.ts#L22
 */
function springAccelerationForState(state) {
  return -state.tension * state.x - state.friction * state.v;
}

function springEvaluateStateWithDerivative(initialState, dt, derivative) {
  const state = {
    x: initialState.x + derivative.dx * dt,
    v: initialState.v + derivative.dv * dt,
    tension: initialState.tension,
    friction: initialState.friction,
  };

  return {
    dx: state.v,
    dv: springAccelerationForState(state),
  };
}

function springIntegrateState(state, dt) {
  const a = {
    dx: state.v,
    dv: springAccelerationForState(state),
  };
  const b = springEvaluateStateWithDerivative(state, dt * 0.5, a);
  const c = springEvaluateStateWithDerivative(state, dt * 0.5, b);
  const d = springEvaluateStateWithDerivative(state, dt, c);
  const dxdt = (1 / 6) * (a.dx + 2 * (b.dx + c.dx) + d.dx);
  const dvdt = (1 / 6) * (a.dv + 2 * (b.dv + c.dv) + d.dv);

  state.x += dxdt * dt;
  state.v += dvdt * dt;

  return state;
}

/* Runge-Kutta spring physics function generator. Adapted from Framer.js, copyright Koen Bok. MIT License: http://en.wikipedia.org/wiki/MIT_License */
/* Given a tension, friction, and duration, a simulation at 60FPS will first run without a defined duration in order to calculate the full path. A second pass
 then adjusts the time delta -- using the relation between actual time and duration -- to calculate the path for the duration-constrained animation. */
function generateSpringRK4(tension, friction, duration) {
  const initState = {
    x: -1,
    v: 0,
    tension: parseFloat(tension) || 500,
    friction: parseFloat(friction) || 20,
  };
  const path = [0];
  const tolerance = 1 / 10000;
  const DT = 16 / 1000;
  const haveDuration = duration != null; // deliberate "==", as undefined == null != 0
  let timeLapsed = 0;
  let dt;
  let lastState;

  /* Calculate the actual time it takes for this animation to complete with the provided conditions. */
  if (haveDuration) {
    /* Run the simulation without a duration. */
    timeLapsed = generateSpringRK4(initState.tension, initState.friction);
    /* Compute the adjusted time delta. */
    dt = (timeLapsed / duration) * DT;
  } else {
    dt = DT;
  }

  while (true) {
    /* Next/step function. */
    lastState = springIntegrateState(lastState || initState, dt);
    /* Store the position. */
    path.push(1 + lastState.x);
    timeLapsed += 16;
    /* If the change threshold is reached, break. */
    if (!(Math.abs(lastState.x) > tolerance && Math.abs(lastState.v) > tolerance)) {
      break;
    }
  }

  /* If duration is not defined, return the actual time required for completing this animation. Otherwise, return a closure that holds the
	 computed path and returns a snapshot of the position according to a given percentComplete. */
  return !haveDuration
    ? timeLapsed
    : (startValue, endValue) => {
        return path.map((el) => startValue + el * (endValue - startValue));
      };
}
