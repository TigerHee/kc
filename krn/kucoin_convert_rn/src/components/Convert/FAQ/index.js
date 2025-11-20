/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import useLang from 'hooks/useLang';
import {RichLocale} from '@krn/ui';
import {openLink} from 'utils/helper';

const Container = styled.View`
  flex: 1;
`;

const ScrollView = styled.ScrollView`
  margin: 12px 16px;
  flex: 1;
`;

const Para = styled.View`
  margin-bottom: 24px;
`;

const Content = styled.View`
  margin-bottom: 12px;
`;

const Label = styled.Text`
  font-weight: 600;
  font-size: 16px;
  line-height: 20.8px;
  margin-bottom: 8px;
  color: ${({theme}) => theme.colorV2.text};
`;

const Desc = styled.Text`
  font-size: 16px;
  line-height: 24px;
  color: ${({theme}) => theme.colorV2.text60};
`;

const LinkText = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.color.primary};
`;

const Faq5Content = () => {
  const {_t} = useLang();

  const onPressPlusLink = () => {
    openLink('/support/34869477207961');
  };

  return (
    <Content>
      <Content>
        <Desc>{_t('55df93299c944000a790')}</Desc>
      </Content>
      <Content>
        <Desc>{_t('fd19ece589ac4000aaf3')}</Desc>
      </Content>
      <Desc>
        <RichLocale
          message={_t('15de039241e94000a70e')}
          renderParams={{
            LINK: {
              component: LinkText,
              componentProps: {onPress: onPressPlusLink},
            },
          }}
        />
      </Desc>
    </Content>
  );
};

export default ({}) => {
  const {_t} = useLang();

  const list = [
    {
      title: _t('e97BCfRbQ4is9AExehdPMj'),
      answer: _t('8dfP8cKqSQYLdCio3G8221'),
    },
    {
      title: _t('nvkSu8mHeSzTpCnVKft2WN'),
      answer: _t('gmKUBmSFyMkoKoJ43RFU7E'),
    },
    {
      title: _t('q6LRhiCbg8w42XaZNzDC4G'),
      answer: _t('iKzDkaKunHrYNDgqU6UCSh'),
    },
    {
      title: _t('b7rUvLjZzS6nN291kz2ZPh'),
      answer: _t('x56xGiprLGkfsRYajmRDDM'),
    },
  ];
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {list.map((i, index) => (
          <Para key={index}>
            <Label>{i.title}</Label>
            <Desc>{i.answer}</Desc>
          </Para>
        ))}
        <Para>
          <Label>{_t('f097865414cc4000a633')}</Label>
          <Faq5Content />
        </Para>
      </ScrollView>
    </Container>
  );
};
