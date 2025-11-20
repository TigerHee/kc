/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { ICDeleteOutlined, ICEyeOpenOutlined, DocOutlined, ErrorPictureOutlined } from '@kux/icons';
import useTheme from 'hooks/useTheme';
import styled, { isPropValid } from 'emotion/index';
import UploaderImgLight from '@kux/icons/static/uploader-light.svg';
import UploaderImgDark from '@kux/icons/static/uploader-dark.svg';
import Spin from '../Spin';
import { isImageUrl } from './aux';

const ListItemContainer = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ listType, theme }) => {
  return {
    ...(listType === 'text' && {
      marginTop: '12px',
      '&:after': {
        display: 'table',
        width: 0,
        height: 0,
        content: '""',
      },
    }),
    ...(listType === 'picture-card' && {
      display: 'inline-block',
      width: '100px',
      height: '100px',
      borderRadius: '4px',
      margin: '0 12px 12px 0',
      position: 'relative',
      overflow: 'hidden',
      border: `1px solid ${theme.colors.cover4}`,
    }),
  };
});

const ListItemBox = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ listType, status, theme }) => {
  return {
    ...(listType === 'text' && {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    }),
    ...(listType === 'picture-card' && {
      position: 'relative',
      width: '100%',
      height: '100%',
      ...(status === 'error' && {
        background: theme.colors.secondary8,
      }),
    }),
  };
});

const ListInfo = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ listType, theme, status, isHover }) => {
  return {
    ...(listType === 'text' && {
      flex: 1,
      width: 'calc(100% - 28px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: `1px solid ${theme.colors.cover8}`,
      background: 'transparent',
      borderRadius: 8,
      height: '40px',
      padding: '0 12px',
      '.KuxSpin-root': {
        alignSelf: 'auto',
      },
    }),
    ...(listType === 'picture-card' && {
      position: 'relative',
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:before': {
        position: 'absolute',
        display: 'block',
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0, 0.6)',
        opacity: isHover ? 1 : 0,
        transition: 'all .3s',
        content: '""',
        ...(status === 'uploading' && {
          opacity: 1,
        }),
      },
    }),
  };
});

const Action = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ listType, isHover }) => {
  return {
    ...(listType === 'text' && {
      flexShrink: 0,
      cursor: 'pointer',
      marginLeft: '12px',
    }),
    ...(listType === 'picture-card' && {
      position: 'absolute',
      top: '50%',
      left: '50%',
      zIndex: 10,
      whiteSpace: 'nowrap',
      transform: 'translate(-50%,-50%)',
      opacity: isHover ? 1 : 0,
      transition: 'all .3s',
    }),
  };
});

const ListInfoText = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  };
});

const Text = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme, status }) => {
  return {
    flex: 1,
    color: theme.colors.text,
    fontSize: '14px',
    lineHeight: '22px',
    marginLeft: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 500,
    ...(status === 'error' && {
      color: theme.colors.secondary,
    }),
  };
});

const Image = styled('img', {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  };
});

const ItemImg = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const ListItem = React.forwardRef(({ listType, file, onClose, onPreview }, ref) => {
  const theme = useTheme();

  const [isHover, setIsHover] = React.useState(false);

  let item = (
    <ListItemBox theme={theme} listType={listType}>
      <ListInfo theme={theme} listType={listType}>
        <ListInfoText>
          <ItemImg src={theme.currentTheme === 'dark' ? UploaderImgDark : UploaderImgLight} />
          <Text status={file?.status} theme={theme}>
            {file?.name}
          </Text>
        </ListInfoText>
        {file?.status === 'uploading' ? <Spin size="small" type="normal" /> : null}
      </ListInfo>
      <Action listType={listType}>
        <ICDeleteOutlined
          onClick={() => {
            onClose(file);
          }}
          size="16"
          color={theme.colors.icon}
        />
      </Action>
    </ListItemBox>
  );

  if (listType === 'picture-card') {
    let listInfoContent = null;

    if (file.status === 'uploading') {
      listInfoContent = <Spin />;
    } else if (file.status === 'error') {
      listInfoContent = <ErrorPictureOutlined color={theme.colors.secondary} size={24} />;
    } else {
      const thumbnail = isImageUrl?.(file) ? (
        <Image src={file.url} alt={file.name} crossOrigin={file.crossOrigin} />
      ) : (
        <DocOutlined color={theme.colors.icon} size={30} />
      );

      listInfoContent = <>{thumbnail}</>;
    }

    item = (
      <ListItemBox theme={theme} status={file?.status} listType={listType}>
        <ListInfo isHover={isHover} status={file.status} listType={listType}>
          {listInfoContent}
        </ListInfo>
        {file.status !== 'uploading' ? (
          <Action isHover={isHover} listType={listType}>
            <a
              href={file.url || file.thumbUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={
                isImageUrl(file) && file.url
                  ? { cursor: 'pointer', marginRight: '24px' }
                  : { display: 'none' }
              }
              onClick={(e) => onPreview(file, e)}
            >
              <ICEyeOpenOutlined color="#fff" size={16} />
            </a>
            <span style={{ cursor: 'pointer' }}>
              <ICDeleteOutlined
                onClick={() => {
                  onClose(file);
                }}
                color="#fff"
                size={16}
              />
            </span>
          </Action>
        ) : null}
      </ListItemBox>
    );
  }

  return (
    <ListItemContainer
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onTouchStart={() => setIsHover(true)}
      onTouchEnd={() => setIsHover(false)}
      theme={theme}
      listType={listType}
      ref={ref}
    >
      {item}
    </ListItemContainer>
  );
});

export default ListItem;
