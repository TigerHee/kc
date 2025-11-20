import fs from 'fs';
import path from 'path';

/**
 * get file path recursively
 */
export function getFilePath(dir: string, isTargetFile: (f: string) => boolean): string {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      const res = getFilePath(filePath, isTargetFile);
      if (res) {
        return res;
      }
    } else if (isTargetFile(file.replace(/\\/g, '/'))) {
      return filePath;
    }
  }
  return '';
}

export interface ICopyDirOptions {
  /**
   * empty dest dir before copying
   */
  emptyDest?: boolean
  /**
   * return true to copy file / dir
   */
  filter?: (f: string, isFile: boolean) => boolean

  /**
   * update file content when copying
   */
  updateFile?: (srcPath: string, destPath: string) => string
}

/**
 * copy dir recursively
 * @param filter return true to copy file / dir
 */
export function copyDir(src: string, dest: string, options: ICopyDirOptions = {}) {
  const filterFn = options.filter || (() => true);
  if (options.emptyDest) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(dest, { recursive: true })
  fs.readdirSync(src).forEach((file) => {
    const srcFile = path.resolve(src, file)
    const destFile = path.resolve(dest, file)
    if (fs.lstatSync(srcFile).isDirectory()) {
      if (filterFn(srcFile, false)) {
        copyDir(srcFile, destFile, options)
      }
    } else {
      if (!filterFn(srcFile, true)) return
      if (options.updateFile) {
        const content = options.updateFile(srcFile, destFile)
        fs.writeFileSync(destFile, content)
      } else {
        fs.copyFileSync(srcFile, destFile)
      }
    }
  })
}

/**
 * copy file
 */
export function copyFile(src: string, dest: string) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
  }
  fs.copyFileSync(src, dest);
}