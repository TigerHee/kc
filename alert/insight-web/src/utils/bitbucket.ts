export const getFileLink = (slug: string, repo: string, file: string, line: number) => {
  return `https://bitbucket.kucoin.net/projects/${slug}/repos/${repo}/browse/${file}#${line}`;
};
