const COMMIT_OPTIONS = {
  revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (.*)\.$/,
  revertCorrespondence: ['header', 'hash'],
  fieldPattern: /^-(.*?)-$/,
  headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
  headerCorrespondence: ['type', 'scope', 'subject'],
  mergePattern:
    /^(merge\s+(branch|tag|commit|pull\srequest|remote-tracking\s+branch)|pull\s+request\s+#\d+:)\s*([\s\S]+)\s*(?:into\s+([^\s]+))?(?:\s+of\s+(.*))?$/i,
  // Merge pull request #3761 in KUC/public-web from release/spotlight-2024.11.28 to master
  // Merge remote-tracking branch 'origin/release/spotlight-2024.11.28' into feature/spotlight-2024.11.11
  mergeCorrespondence: ['sourceType', 'source'],
  noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
  issuePrefixes: ['#'],
  issuePrefixesCaseSensitive: false,
  referenceActions: ['close', 'closes', 'closed', 'fix', 'fixes', 'fixed', 'resolve', 'resolves', 'resolved'],
};
export { COMMIT_OPTIONS };
