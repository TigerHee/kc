import { useEffect, useState, useContext } from 'react';
import { StateContext } from '../components/StateProvider';

// export default function useExternalStore(subscriber, snapshot, defaultValue) {
//   const [state, setState] = useState(defaultValue);
//   const forUpdate = (...args) => {
//     setState(snapshot(...args));
//   };
//   useEffect(() => {
//     subscriber(forUpdate);
//   }, []);
//   return state;
// }

export const useStateSelector = (key) => {
  const props = useContext(StateContext);
  const [state, setState] = useState(props[key]);
  useEffect(() => {
    setState(props[key]);
  }, [props[key]]);
  return state;
};

export function withStateHoc(Component) {
  return function ContextComponent(props) {
    return (
      <StateContext.Consumer>
        {(context) => {
          return <Component {...props} context={context} />;
        }}
      </StateContext.Consumer>
    );
  };
}
