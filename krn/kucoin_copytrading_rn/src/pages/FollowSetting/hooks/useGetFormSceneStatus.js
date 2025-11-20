import {useParams} from 'hooks/useParams';
import {SETTING_SCENE} from '../constant';

export const useGetFormSceneStatus = () => {
  const {scene} = useParams();

  const isReadonly = scene === SETTING_SCENE.readonly;

  return {
    scene,
    isReadonly,
  };
};
