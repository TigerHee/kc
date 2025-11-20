import { escapeHtml, filterXssHTML } from '../src/safe-html'

describe('safe-html', () => {
  it('escapeHtml', () => {
    // @ts-expect-error ignore for test
    expect(escapeHtml(true)).toBe(true)
    expect(escapeHtml('<script>alert(1)</script>')).toBe('&#60;script&#62;alert(1)&#60;/script&#62;')
    expect(escapeHtml('<img src="x" onerror="alert(1)">')).toBe('&#60;img src=&#34;x&#34; onerror=&#34;alert(1)&#34;&#62;')
  })

  describe('filterXssHTML', () => {
    it.each([
      // --- Existing cases above ---
      // <body onload=alert(1)> => body tag should be removed
      ['remove body onload event', '<body onload="alert(1)">test</body>', 'test'],
      // <form action="javascript:alert(1)">
      ['remove form javascript action', '<form action="javascript:alert(1)">x</form>', '<form>x</form>'],
      // <input formaction="javascript:alert(1)">
      ['remove input formaction javascript', '<input formaction="javascript:alert(1)">', '<input>'],
      // <object data="javascript:alert(1)">
      ['remove object data javascript', '<object data="javascript:alert(1)"></object>', '<object></object>'],
      // <embed src="javascript:alert(1)">
      ['remove embed src javascript', '<embed src="javascript:alert(1)">', '<embed>'],
      // <meta http-equiv="set-cookie" content="a=1">
      ['remove meta http-equiv set-cookie', '<meta http-equiv="set-cookie" content="a=1">', '<meta content="a=1">'],
      // <img src=x onerror=alert(document.domain)>
      ['remove img onerror with document.domain', '<img src="x" onerror="alert(document.domain)">', '<img src="x">'],
      ['remove img onerror with document.domain2', '<img src="x" OnError="alert(document.domain)">', '<img src="x">'],
      // <svg><script>top[location.hash.slice(1)]()</script></svg>
      ['remove svg with script tag', '<svg><script>top[location.hash.slice(1)]()</script></svg>', '<svg></svg>'],
      // <math><mi xlink:href="javascript:alert(1)"></mi></math>
      ['remove math xlink:href javascript', '<math><mi xlink:href="javascript:alert(1)"></mi></math>', '<math><mi></mi></math>'],
      // <img src="x" style="background:url(javascript:alert(1))">
      ['remove style background javascript', '<img src="x" style="background:url(javascript:alert(1))">', '<img src="x">'],
      // <img src="x" style="width:expression(alert(1));">
      ['remove style expression', '<!-- comment --><img src="x" style="width:expression(alert(1));">', '<img src="x">'],
      // <iframe srcdoc="<script>alert(1)</script>">
      ['remove iframe srcdoc script', '<iframe srcdoc="<script>alert(1)</script>">', ''],
      // allow onerror
      ['allow onerror', '<img src="/aaa.png" oNerrOr="this.src=\'/xxx.png\'">', '<img src="/aaa.png" onerror="this.src=&amp;#39;/xxx.png&amp;#39;">', { allowEvents: ['onerror'] }],
      // <img src="x" onmouseover="window[location.hash.slice(1)]()">
      ['remove img onmouseover with window injection', '<img src="x" onmouseover="window[location.hash.slice(1)]()">', '<img src="x">'],
      // <a href="//evil.com">x</a>
      ['allow protocol-relative url', '<a href="//evil.com">x</a>', '<a href="//evil.com">x</a>'],
      // <img src="x" onerror="this.onerror=null;window.evil=1">
      ['remove img onerror with global var injection', '<img src="x" onerror="this.onerror=null;window.evil=1">', '<img src="x">'],
      // <img src="x" onerror="parent.evil=1">
      ['remove img onerror with parent global var injection', '<img src="x" onerror="parent.evil=1">', '<img src="x">'],
      // <img src="x" onerror="top.evil=1">
      ['remove img onerror with top global var injection', '<img src="x" onerror="top.evil=1">', '<img src="x">'],
      // <img src="x" onerror="window[\'evil\']=1">
      ['remove img onerror with window property injection', '<img src="x" onerror="window[\'evil\']=1">', '<img src="x">'],
      ['remove script tag', '<script>alert(1)</script>', ''],
      ['remove img onerror attribute', '<img src="x" onerror="alert(1)">', '<img src="x">'],
      ['remove svg onload attribute', '<svg onload="alert(1)"></svg>', '<svg></svg>'],
      ['remove a tag javascript protocol', '<a href="javascript:alert(1)">x</a>', '<a>x</a>'],
      ['remove style tag', '<style>body{background:url(javascript:alert(1))}</style>', ''],
      ['remove iframe tag', '<iframe src="javascript:alert(1)"></iframe>', ''],
      ['remove div onclick event', '<div onclick="alert(1)">x</div>', '<div>x</div>'],
      ['allow img tag', '<img src="x" onerror="alert(1)">', '<img src="x">', { allowTags: ['img'] }],
      ['allow only img src attribute', '<img src="x" onerror="alert(1)">', '<img src="x">', { allowAttrs: ['src'] }],
      ['ignore img onerror attribute', '<img src="x" onerror="alert(1)">', '<img src="x">', { ignoreAttrs: ['onerror'] }],
      ['allow http protocol', '<a href="http://safe.com">x</a>', '<a href="http://safe.com">x</a>'],
      ['remove a tag javascript protocol', '<a href="javascript:alert(1)">x</a>', '<a>x</a>'],
      ['allow data protocol', '<img src="data:image/png;base64,xxx">', '<img src="data:image/png;base64,xxx">'],
      ['allow tel protocol', '<a href="tel:123456">x</a>', '<a href="tel:123456">x</a>'],
      ['allow mailto protocol', '<a href="mailto:test@test.com">x</a>', '<a href="mailto:test@test.com">x</a>'],
      ['remove not allowed custom protocol', '<a href="custom:123">x</a>', '<a>x</a>'],
      ['allow custom protocol', '<a href="custom:123">x</a>', '<a href="custom:123">x</a>', { allowProtocols: ['custom'] }],
      ['ignoreTags remove img', '<br><img src="x" onerror="alert(1)">', '<br>', { ignoreTags: ['img'] }],
      // @ts-expect-error ignore for test
    ])('%s', (_, input, expected, options) => {
      expect(filterXssHTML(input, options)).toBe(expected)
    })
  })
})