import { IconButton } from './icon-button';
import { useEffect, useState } from 'react';

import facebookIcon from './assets/facebook.svg?url';
import twitterIcon from './assets/twitter.svg?url';
import linkedinIcon from './assets/linkedin.svg?url';
import lineIcon from './assets/line.svg?url';
import telegramIcon from './assets/telegram.svg?url';
import vkIcon from './assets/vk.svg?url';

export interface IButtonConfig {
  /**
   * platform id, should be unique, should be in lowercase
   */
  id: string;
  /**
   * platform name
   */
  title: string;
  /**
   * platform icon
   */
  icon: string;
  /**
   * URL template for the share button
   * * `%link%` will be replaced with the URL to share
   * * `%title%` will be replaced with the title of the page
   */
  url: string;
}

const BUILTIN_BUTTON_CONFIGS: IButtonConfig[] = [
  {
    id: 'telegram',
    title: 'Telegram',
    icon: telegramIcon,
    url: 'https://t.me/share/url?url=%link%&text=%title%',
  },

  {
    id: 'facebook',
    title: 'Facebook',
    icon: facebookIcon,
    url: 'https://www.facebook.com/sharer.php?u=%link%&t=%title%',
  },

  {
    id: 'twitter',
    title: 'X(Twitter)',
    icon: twitterIcon,
    url: 'https://twitter.com/intent/tweet?url=%link%&text=%title%',
  },

  {
    id: 'linkedin',
    title: 'Linkedin',
    icon: linkedinIcon,
    url: 'https://www.linkedin.com/sharing/share-offsite/?url=%link%&title=%title%',
  },
   {
    id: 'line',
    title: 'Line',
    icon: lineIcon,
    url: 'https://lineit.line.me/share/ui?url=%link%&text=%title%',
  },
  {
    id: 'vk',
    title: 'VK',
    icon: vkIcon,
    url: 'http://vk.com/share.php?url=%link%&comment=%title%',
  },
] as const

export type IBuiltinPlatform = typeof BUILTIN_BUTTON_CONFIGS[number]['id'];

const DEFAULT_DESKTOP_BUTTONS: IBuiltinPlatform[] = ['telegram', 'facebook', 'twitter', 'linkedin', 'vk', 'line'];
const DEFAULT_MOBILE_BUTTONS: IBuiltinPlatform[] = ['telegram', 'facebook', 'twitter', 'linkedin', 'line'];

export interface ISocialButtonsProps {
  isMobile?: boolean;
  /**
   * URL to share
   */
  link: string;
  /**
   * Title of the url
   */
  title?: string | undefined;
  /**
   * List of buttons to show
   */
  buttons?: (IBuiltinPlatform | IButtonConfig) [] | undefined;

  /**
   * trigger when share button clicked
   * @param platform platform id
   */
  onShared?: (platform: string) => void;
}

export function SocialButtons(props: ISocialButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const btnCfgs = getButtonConfigs({
    link: props.link,
    title: props.title,
    buttons: props.buttons || (props.isMobile ? DEFAULT_MOBILE_BUTTONS : DEFAULT_DESKTOP_BUTTONS),
  });

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const buttons = btnCfgs.map((btfCfg) => {
    return (
      <IconButton
        key={btfCfg.id}
        icon={btfCfg.icon}
        text={btfCfg.title}
        onClick={() => props.onShared?.(btfCfg.id)}
        as="a"
        href={btfCfg.url}
      />
    );
  })
  // 非移动端直接返回按钮
  if (!props.isMobile) return buttons;

  return (
    <div className={`kux-share-view_social-media ${isOpen ? 'open' : ''}`}>
      {buttons}
    </div>
  );
}

function getButtonConfigs(cfg: Pick<ISocialButtonsProps, 'buttons' | 'link' | 'title'>) {
  const encodedTitle = cfg.title ? encodeURIComponent(cfg.title) : '';
  const encodedLink = encodeURIComponent(cfg.link);

  return cfg.buttons!.map((btn) => {
    if (app.is(btn, 'string')) {
      const builtinConfig = BUILTIN_BUTTON_CONFIGS.find((config) => config.id === btn);
      if (!builtinConfig) return null;

      return {
        ...builtinConfig,
        url: builtinConfig.url.replace('%link%', encodedLink).replace('%title%', encodedTitle),
      };
    }

    return {
      ...btn,
      url: btn.url.replace('%link%', encodedLink).replace('%title%', encodedTitle),
    };
  })
  .filter(Boolean)
  // Remove duplicate buttons by id (only occurs when user provides custom buttons)
  .filter((btn, index, arr) => arr.findIndex((b) => b!.id === btn!.id) === index) as IButtonConfig[];
}