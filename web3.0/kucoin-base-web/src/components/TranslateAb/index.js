import { useEffect } from 'react';
import { kcsensorsManualTrack } from '@utils/sensors';
import { Helmet } from 'react-helmet';

export default function TranslateAb() {
  const eventHandler = (msg) => {
    if (process.env.NODE_ENV === 'development') return;
    if (msg.detail && msg.detail.changeTo) {
      kcsensorsManualTrack(['translateLang', msg.detail.changeTo]);
    }
  }

  useEffect(() => {
    window.addEventListener('translate_lang', eventHandler);

    return () => {
      window.removeEventListener('translate_lang', eventHandler);
    }
  }, [])

  return (
    <Helmet>
      <script async src={`${process.env.REACT_APP_CDN}/natasha/npm/googleTranslatePollify/1.0.1/google-translate-pollify.min.js`} integrity="sha384-nMR75xlYMzv5xI0ozHwNXmyXZW7LdwuJn/jzKESLVDMV5vSL88VBeaI7IyQwdd7F" crossOrigin="anonymous" />
    </Helmet>
  );
}
