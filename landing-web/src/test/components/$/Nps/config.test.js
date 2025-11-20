/*
 * Owner: jesse.shao@kupotech.com
 */
// main.test.js
import {
  getDataForBackend,
  getText,
  numToLetter,
  isPreviewFn,
} from 'src/components/$/Nps/config.js';

describe('getDataForBackend', () => {
  it('returns an array of objects', () => {
    const formDatas = {
      questions: [
        {
          questionId: 1,
          type: 'single',
          options: [
            {
              sort: 1,
              selected: true,
              content: 'Option 1',
            },
            {
              sort: 2,
              selected: false,
              content: 'Option 2',
            },
          ],
        },
        {
          questionId: 2,
          type: 'multi',
          options: [
            {
              sort: 1,
              selected: false,
              content: 'Option 1',
            },
            {
              sort: 2,
              selected: true,
              content: 'Option 2',
            },
            {
              sort: 3,
              selected: true,
              content: 'Option 3',
            },
          ],
        },
      ],
    };

    const result = getDataForBackend(formDatas);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(typeof result[0]).toBe('object');
    expect(typeof result[1]).toBe('object');
  });

  it('returns the correct data', () => {
    const formDatas = {
      questions: [
        {
          questionId: 1,
          type: 'single',
          options: [
            {
              sort: 1,
              selected: true,
              content: 'Option 1',
            },
            {
              sort: 2,
              selected: false,
              content: 'Option 2',
            },
          ],
        },
        {
          questionId: 2,
          type: 'multi',
          options: [
            {
              sort: 1,
              selected: false,
              content: 'Option 1',
            },
            {
              sort: 2,
              selected: true,
              content: 'Option 2',
            },
            {
              sort: 3,
              selected: true,
              content: 'Option 3',
            },
          ],
        },
      ],
    };

    const result = getDataForBackend(formDatas);

    expect(result[0]).toEqual({
      questionId: 1,
      type: 'single',
      options: [
        {
          sort: 1,
          selected: true,
          content: 'Option 1',
        },
        {
          sort: 2,
          selected: false,
          content: 'Option 2',
        },
      ],
    });

    expect(result[1]).toEqual({
      questionId: 2,
      type: 'multi',
      options: [
        {
          sort: 1,
          selected: false,
          content: 'Option 1',
        },
        {
          sort: 2,
          selected: true,
          content: 'Option 2',
        },
        {
          sort: 3,
          selected: true,
          content: 'Option 3',
        },
      ],
    });
  });

  it('returns the correct data when optionContent is present', () => {
    const formDatas = {
      questions: [
        {
          questionId: 1,
          type: 'single',
          options: [
            {
              sort: 1,
              selected: true,
              content: 'Option 1',
              optionContent: 'Option 1 Content',
            },
            {
              sort: 2,
              selected: false,
              content: 'Option 2',
              optionContent: 'Option 2 Content',
            },
          ],
        },
      ],
    };
  });
});

// test('isPreviewFn should return true when "preview=true" is in the URL', () => {
//   // Arrange
//   const mockWindowLocation = {
//     href: 'https://example.com/?preview=true',
//   };
//   global.window = Object.create(window);
//   Object.defineProperty(window, 'location', {
//     value: mockWindowLocation,
//   });

//   // Act
//   const result = isPreviewFn();

//   // Assert
//   expect(result).toBe(true);
// });
