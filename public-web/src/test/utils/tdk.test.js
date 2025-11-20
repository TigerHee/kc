/**
 * Owner: jessie@kupotech.com
 */
import { getTDKFromHtml } from 'utils/tdk';

describe('getTDKFromHtml', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.title = '';
  });

  test('should return title, description, and keywords from HTML', () => {
    document.title = 'Test Title';
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'Test Description';
    document.head.appendChild(metaDescription);

    const metaKeywords = document.createElement('meta');
    metaKeywords.name = 'keywords';
    metaKeywords.content = 'keyword1, keyword2';
    document.head.appendChild(metaKeywords);

    const result = getTDKFromHtml();

    expect(result).toEqual({
      title: 'Test Title',
      description: 'Test Description',
      keywords: 'keyword1, keyword2',
    });
  });

  test('should return empty description and keywords if not present', () => {
    document.title = 'Test Title';
    const result = getTDKFromHtml();

    expect(result).toEqual({
      title: 'Test Title',
    });
  });

  test('should return empty description if only keywords are present', () => {
    document.title = 'Test Title';
    const metaKeywords = document.createElement('meta');
    metaKeywords.name = 'keywords';
    metaKeywords.content = 'keyword1, keyword2';
    document.head.appendChild(metaKeywords);

    const result = getTDKFromHtml();

    expect(result).toEqual({
      title: 'Test Title',
      keywords: 'keyword1, keyword2',
    });
  });

  test('should return empty keywords if only description is present', () => {
    document.title = 'Test Title';
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'Test Description';
    document.head.appendChild(metaDescription);

    const result = getTDKFromHtml();

    expect(result).toEqual({
      title: 'Test Title',
      description: 'Test Description',
    });
  });

  test('should return the description from the meta tag', () => {
    document.title = 'Test Title';

    const metaDescription = document.createElement('meta');

    metaDescription.name = 'description';

    metaDescription.content = 'Test Description';

    document.head.appendChild(metaDescription);

    const tdk = getTDKFromHtml();

    expect(tdk.description).toBe('Test Description');
  });

  test('should return an empty description if the meta tag is not present', () => {
    document.title = 'Test Title';

    const tdk = getTDKFromHtml();

    expect(tdk.description).toBeUndefined();
  });

  test('should return the keywords from the meta tag', () => {
    document.title = 'Test Title';

    const metaKeywords = document.createElement('meta');

    metaKeywords.name = 'keywords';

    metaKeywords.content = 'keyword1, keyword2';

    document.head.appendChild(metaKeywords);

    const tdk = getTDKFromHtml();

    expect(tdk.keywords).toBe('keyword1, keyword2');
  });

  test('should return an empty keywords if the meta tag is not present', () => {
    document.title = 'Test Title';

    const tdk = getTDKFromHtml();

    expect(tdk.keywords).toBeUndefined();
  });

  test('should return both description and keywords if both meta tags are present', () => {
    document.title = 'Test Title';

    const metaDescription = document.createElement('meta');

    metaDescription.name = 'description';

    metaDescription.content = 'Test Description';

    document.head.appendChild(metaDescription);

    const metaKeywords = document.createElement('meta');

    metaKeywords.name = 'keywords';

    metaKeywords.content = 'keyword1, keyword2';

    document.head.appendChild(metaKeywords);

    const tdk = getTDKFromHtml();

    expect(tdk.description).toBe('Test Description');

    expect(tdk.keywords).toBe('keyword1, keyword2');
  });

  test('should handle missing title', () => {
    document.title = '';

    const tdk = getTDKFromHtml();

    expect(tdk.title).toBe('');
  });
});
