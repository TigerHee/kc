import {getUserFlag, getUserShowFullName} from 'utils/user';

describe('user.js', () => {
  describe('getUserFlag', () => {
    it('should return first two characters of nickname when available', () => {
      const user = {nickname: 'JohnDoe'};
      expect(getUserFlag(user)).toBe('JO');
    });

    it('should handle nickName (camelCase) property', () => {
      const user = {nickName: 'JohnDoe'};
      expect(getUserFlag(user)).toBe('JO');
    });

    it('should return first two characters of email when no nickname', () => {
      const user = {email: 'john@example.com'};
      expect(getUserFlag(user)).toBe('JO');
    });

    it('should return last two characters of phone when no nickname or email', () => {
      const user = {phone: '1234567890'};
      expect(getUserFlag(user)).toBe('90');
    });

    it('should return subAccount first two characters when isSub is true', () => {
      const user = {
        nickname: 'JohnDoe',
        isSub: true,
        subAccount: 'sub123',
      };
      expect(getUserFlag(user)).toBe('SU');
    });

    it('should handle empty subAccount when isSub is true', () => {
      const user = {
        nickname: 'JohnDoe',
        isSub: true,
        subAccount: '',
      };
      expect(getUserFlag(user)).toBe('');
    });

    it('should handle non-ASCII characters in nickname', () => {
      const user = {nickname: '张三'};
      expect(getUserFlag(user)).toBe('张');
    });

    it('should handle null or undefined user', () => {
      expect(getUserFlag(null)).toBe('');
      expect(getUserFlag(undefined)).toBe('');
    });

    it('should handle empty user object', () => {
      expect(getUserFlag({})).toBe('');
    });
  });

  describe('getUserShowFullName', () => {
    it('should return nickname when available', () => {
      const user = {nickname: 'John Doe'};
      expect(getUserShowFullName(user)).toBe('John Doe');
    });

    it('should return email when no nickname', () => {
      const user = {email: 'john@example.com'};
      expect(getUserShowFullName(user)).toBe('john@example.com');
    });

    it('should return phone when no nickname or email', () => {
      const user = {phone: '1234567890'};
      expect(getUserShowFullName(user)).toBe('1234567890');
    });

    it('should return empty string when no user info', () => {
      expect(getUserShowFullName(null)).toBe('');
      expect(getUserShowFullName(undefined)).toBe('');
      expect(getUserShowFullName({})).toBe('');
    });

    it('should prioritize nickname over email and phone', () => {
      const user = {
        nickname: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
      };
      expect(getUserShowFullName(user)).toBe('John Doe');
    });

    it('should prioritize email over phone when no nickname', () => {
      const user = {
        email: 'john@example.com',
        phone: '1234567890',
      };
      expect(getUserShowFullName(user)).toBe('john@example.com');
    });
  });
});
