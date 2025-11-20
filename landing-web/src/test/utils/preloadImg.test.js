/*
 * Owner: terry@kupotech.com
 */
import preloadImg, {preloadImageAndClip} from 'utils/preloadImg';

describe('preloadImg', () => {

  it('load success', async () => {
    const imgSrc= 'https://assets.staticimg.com/cms/media/6iM2B0zaI27FJy5w7KAzJLrdxnzcsAihb23HwKvyQ.png?d=564x322';
    expect(preloadImg(imgSrc, 'test-img')).toBeDefined()
  })

  it('load error', () => {
    const imgSrc= 'aa.com/a.png';
    preloadImg(imgSrc).catch(e => {
      expect(e).toBeDefined();
    })
  })

  it('preloadImageAndClip func', () => {
    const imgSrc= 'https://assets.staticimg.com/cms/media/6iM2B0zaI27FJy5w7KAzJLrdxnzcsAihb23HwKvyQ.png?d=564x322';
    preloadImageAndClip(imgSrc).then(e => {
      expect(e).toBeDefined();
    }).catch(e => {
      expect(e).toBeDefined();
    })
  })
})
