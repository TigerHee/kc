/*
 * Owner: tom@kupotech.com
 */
import { getShareBtns } from 'components/$/LeGoActivity/components/Share/ShareModel/pc/config';

describe('getShareBtns', () => {
  test('should return an array of share buttons with correct properties', () => {
    const shareUrl = 'https://example.com';
    const shareTitle = 'Test Title';
    const shareButtons = getShareBtns(shareUrl, shareTitle);
    const twitterBtn = shareButtons[0];
    const encodedShareUrl = encodeURIComponent(shareUrl);
    expect(twitterBtn.name).toBe('Twitter');
    expect(twitterBtn.url).toBe(
      `https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${shareTitle}`,
    );

    const shareButtons2 = getShareBtns(shareUrl, shareTitle, false);
    const linkedinBtn = shareButtons2[1];
    expect(linkedinBtn.name).toBe('Linkedin');
    expect(linkedinBtn.url).toBe(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=${shareTitle}`,
    );
  });
});