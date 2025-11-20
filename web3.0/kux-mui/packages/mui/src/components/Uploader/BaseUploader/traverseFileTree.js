/**
 * Owner: victor.ren@kupotech.com
 */
function loopFiles(item, callback) {
  const dirReader = item.createReader();
  let fileList = [];

  function sequence() {
    dirReader.readEntries((entries) => {
      const entryList = Array.prototype.slice.apply(entries);
      fileList = fileList.concat(entryList);

      const isFinished = !entryList.length;

      if (isFinished) {
        callback(fileList);
      } else {
        sequence();
      }
    });
  }

  sequence();
}

const traverseFileTree = (files, callback, isAccepted) => {
  const _traverseFileTree = (item, path) => {
    item.path = path || '';
    if (item.isFile) {
      item.file((file) => {
        if (isAccepted(file)) {
          if (item.fullPath && !file.webkitRelativePath) {
            Object.defineProperties(file, {
              webkitRelativePath: {
                writable: true,
              },
            });

            file.webkitRelativePath = item.fullPath.replace(/^\//, '');
            Object.defineProperties(file, {
              webkitRelativePath: {
                writable: false,
              },
            });
          }
          callback([file]);
        }
      });
    } else if (item.isDirectory) {
      loopFiles(item, (entries) => {
        entries.forEach((entryItem) => {
          _traverseFileTree(entryItem, `${path}${item.name}/`);
        });
      });
    }
  };
  files.forEach((file) => {
    _traverseFileTree(file.webkitGetAsEntry());
  });
};

export default traverseFileTree;
