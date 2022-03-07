// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: strong-globalize
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

import dbg = require('debug');
const debug = dbg('strong-globalize');

import * as acceptLanguage from 'accept-language';
import * as assert from 'assert';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as md5 from 'md5';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import {AnyObject, ResourceTag, STRONGLOOP_GLB} from './config';

export const ENGLISH = 'en';
export const PSEUDO_LANG = 'zz';
export const PSEUDO_TAG = '♚♛♜♝♞♟';
export const MSG_TAG = 'message';
export const HELPTXT_TAG = 'helptxt';
export const AML_ALL = 'all';
export const AML_NONE = 'none';
export const AML_DEFAULT = AML_NONE;
export const BIG_NUM = 999999999999;
export const MSG_GPB_UNAVAILABLE =
  '*** Login to GPB failed or GPB.supportedTranslations error.';

const HASH_KEYS = false;
const KEY_HEADERS = ['msg'];

export function hashKeys(p: string) {
  let trailer = null;
  return !(
    headerIncluded(p, KEY_HEADERS) ||
    (trailer = getTrailerAfterDot(p)) === 'txt' ||
    trailer === 'json' ||
    trailer === 'yml' ||
    trailer === 'yaml' ||
    p.indexOf(PSEUDO_TAG) === 0
  );
}

// tslint:disable:no-any
/**
 * Supported languages in CLDR notation
 */
let TARGET_LANGS: string[] | null = null;
let MY_ROOT = process.cwd();
let INTL_DIR = path.join(MY_ROOT, 'intl');

/**
 * @param {string} Override the root directory path
 */
export function setRootDir(rootPath: string) {
  let validPath = true;
  let rootStats: fs.Stats | undefined = undefined;
  try {
    rootStats = fs.statSync(rootPath);
  } catch (e) {
    validPath = false;
  }
  assert(validPath, '*** setRootDir: Root path invalid: ' + rootPath);
  if (!rootStats!.isDirectory()) validPath = false;
  assert(
    validPath,
    '*** setRootDir: Root path is not a directory: ' + rootPath.toString()
  );
  let files: string[] | undefined = undefined;
  try {
    files = fs.readdirSync(rootPath);
  } catch (e) {
    validPath = false;
  }
  validPath = validPath && !!files;
  if (validPath) {
    let intlDirFound = false;
    files!.forEach(function (item) {
      if (intlDirFound) return;
      if (item === 'intl') intlDirFound = true;
    });
    validPath = intlDirFound;
  }
  assert(
    validPath,
    '*** setRootDir: Intl dir not found under: ' + rootPath.toString()
  );
  MY_ROOT = rootPath;
  INTL_DIR = path.join(MY_ROOT, 'intl');
}

export function getRootDir() {
  return MY_ROOT;
}

export function isRootPackage() {
  return MY_ROOT === STRONGLOOP_GLB.MASTER_ROOT_DIR;
}

export function initGlobForSltGlobalize(rootDir?: string) {
  if (STRONGLOOP_GLB.MASTER_ROOT_DIR) return;
  Object.assign(STRONGLOOP_GLB, {
    MASTER_ROOT_DIR: rootDir || getRootDir(),
    MSG_RES_LOADED: [],
  });
}

export function isLoadMessages(rootDir: string) {
  if (!STRONGLOOP_GLB.MASTER_ROOT_DIR) return false;
  if (path.resolve(rootDir) === path.resolve(STRONGLOOP_GLB.MASTER_ROOT_DIR!))
    return true;
  if (!STRONGLOOP_GLB.AUTO_MSG_LOADING) return false;
  if (STRONGLOOP_GLB.AUTO_MSG_LOADING === AML_NONE) return false;
  if (STRONGLOOP_GLB.AUTO_MSG_LOADING === AML_ALL) return true;
  const packagesToLoad = STRONGLOOP_GLB.AUTO_MSG_LOADING;
  const packageName = getPackageName(rootDir);
  const load = packagesToLoad.indexOf(packageName) >= 0;
  return load;
}

export function validateAmlValue(aml: string | string[]) {
  if (aml === AML_ALL || aml === AML_NONE) return aml;
  if (Array.isArray(aml)) {
    if (aml.length === 0) return false;
    aml.forEach(function (v) {
      if (typeof aml !== 'string') return false;
    });
    return aml;
  }
  return false;
}

export function msgFileIdHash(fileName: string, rootDir: string) {
  assert(fileName);
  rootDir = rootDir || getRootDir();
  const packageName = getPackageName(rootDir);
  const packageVersion = getPackageVersion(rootDir);
  const msgFileId = fileName + packageName + packageVersion;
  return md5(msgFileId);
}

export function registerResTag(
  fileIdHash: string,
  fileName: string,
  lang: string,
  tagType: string
) {
  assert(STRONGLOOP_GLB);
  assert(fileIdHash);
  assert(fileName);
  assert(lang);
  assert(tagType);
  if (resTagExists(fileIdHash, fileName, lang, tagType)) return false;
  const resTag: ResourceTag = {
    fileIdHash: fileIdHash,
    fileName: fileName,
    lang: lang,
    tagType: tagType,
  };
  STRONGLOOP_GLB.MSG_RES_LOADED!.push(resTag);
  return true;
}

export function resTagExists(
  fileIdHash: string,
  fileName: string,
  lang: string,
  tagType: string
) {
  assert(STRONGLOOP_GLB);
  assert(fileIdHash);
  assert(fileName);
  assert(lang);
  assert(tagType);
  const resTag = {
    fileIdHash: fileIdHash,
    lang: lang,
    tagType: tagType,
  };
  const exists = _.find(STRONGLOOP_GLB.MSG_RES_LOADED, resTag) !== undefined;
  return exists;
}

export function stripBom(str: string) {
  return str.charCodeAt(0) === 0xfeff ? str.slice(1) : str;
}

/**
 * Enumerate all JS files in this application
 * @param {Function}
 *   param.content is a UTF8 string of each JS source file.
 */
const showDotCount = 500;
const showCountCount = 10000;
let enumeratedFilesCount = 0;
let scannedFileNameHash: string[] | null = null;

export function enumerateFilesSync(
  rootDir: string,
  blackList: string[] | null,
  targetFileType: string | string[],
  verbose: boolean,
  checkNodeModules: boolean,
  callback: (content: string, filePath: string) => void
) {
  enumeratedFilesCount = 0;
  scannedFileNameHash = [];
  return enumerateFilesSyncPriv(
    rootDir,
    rootDir,
    blackList,
    targetFileType,
    verbose,
    checkNodeModules,
    callback
  );
}

export function alreadyScanned(fileName: string) {
  const realFileName = process.browser ? fileName : fs.realpathSync(fileName);
  const fileNameHash = md5(realFileName);
  if (scannedFileNameHash!.indexOf(fileNameHash) >= 0) {
    return true;
  } else {
    scannedFileNameHash!.push(fileNameHash);
    return false;
  }
}

export function enumerateFilesSyncPriv(
  currentPath: string,
  rootDir: string,
  blackList: string[] | null,
  targetFileType: string | string[],
  verbose: boolean,
  checkNodeModules: boolean,
  callback: (content: string, child: string) => void
) {
  if (!currentPath) currentPath = MY_ROOT;
  if (!rootDir) rootDir = MY_ROOT;
  currentPath = path.resolve(currentPath);
  if (alreadyScanned(currentPath)) return;
  rootDir = path.resolve(rootDir);
  blackList = Array.isArray(blackList) ? blackList : [];
  if (!Array.isArray(targetFileType)) targetFileType = [targetFileType];
  let skipDir = false;
  blackList.forEach(function (part) {
    if (typeof part !== 'string') return;
    if (currentPath.indexOf(part) >= 0) skipDir = true;
  });
  if (skipDir) {
    if (verbose) console.log('***  skipping directory:', currentPath);
    return;
  }
  let files = null;
  try {
    files = fs.readdirSync(currentPath);
  } catch (e) {
    return;
  }
  files.forEach(function (item) {
    if (item.indexOf('.') === 0) return;
    const child = path.join(currentPath, item);
    let stats = null;
    try {
      stats = fs.statSync(child);
    } catch (e) {
      return;
    }
    if (stats.isDirectory()) {
      item = item.toLowerCase();
      if (item === 'test' || item === 'node_modules' || item === 'coverage')
        return;
      enumerateFilesSyncPriv(
        child,
        rootDir,
        blackList,
        targetFileType,
        verbose,
        checkNodeModules,
        callback
      );
    } else {
      const fileType = getTrailerAfterDot(item);
      if (!fileType || targetFileType.indexOf(fileType) < 0) return;
      const content = stripBom(fs.readFileSync(child, 'utf8'));
      if (verbose) console.log('~~~ examining file:', child);
      if (checkNodeModules) {
        enumeratedFilesCount++;
        if (enumeratedFilesCount % showDotCount === 0) {
          process.stdout.write('.');
          if (enumeratedFilesCount % showCountCount === 0) {
            process.stdout.write(' ' + enumeratedFilesCount.toString() + '\n');
          }
        }
      }
      callback(content, child);
    }
  });
  if (checkNodeModules) {
    const depthRoot = directoryDepth(rootDir);
    const moduleRootPaths = resolveDependencies(currentPath, rootDir);
    if (moduleRootPaths) {
      moduleRootPaths.forEach(function (modulePath) {
        const depthModule = directoryDepth(modulePath);
        if (depthModule - depthRoot > maxDirectoryDepth()) return;
        enumerateFilesSyncPriv(
          modulePath,
          rootDir,
          blackList,
          targetFileType,
          verbose,
          checkNodeModules,
          callback
        );
      });
    }
  }
}

/**
 * @param action A function to be invoked for each target language.
 * If it returns `true`, the enumeration will be terminated.
 */
export function enumerateLanguageSync(
  action: (lang: string) => boolean | undefined
): void {
  if (!TARGET_LANGS) TARGET_LANGS = getSupportedLanguages();
  for (const lang of TARGET_LANGS!) {
    const stopEnumeration = action(lang);
    if (stopEnumeration) return;
  }
}

/**
 * @param {string} lang Supported languages in CLDR notation
 * @param {Function}
 *   If callback returns err; if err, stop enumeration.
 */
export function cloneEnglishTxtSyncDeep(rootDir?: string) {
  if (!rootDir) rootDir = MY_ROOT;
  const enDirPath = path.join(rootDir, 'intl', ENGLISH);
  mkdirp.sync(enDirPath);
  return enumerateMsgSyncPriv(
    rootDir,
    rootDir,
    ENGLISH,
    true,
    true,
    0,
    function () {}
  );
}

export function enumerateMsgSync(
  rootDir: string,
  lang: string,
  checkNodeModules: boolean,
  callback: (jsonObj: AnyObject, filePath: string) => void
) {
  return enumerateMsgSyncPriv(
    rootDir,
    rootDir,
    lang,
    checkNodeModules,
    false,
    0,
    callback
  );
}

export function enumerateMsgSyncPriv(
  currentPath: string,
  rootDir: string,
  lang: string,
  checkNodeModules: boolean,
  cloneEnglishTxt: boolean,
  clonedTxtCount: number,
  callback: (json: object, file: string) => void
) {
  assert(currentPath);
  assert(rootDir);
  assert(typeof callback === 'function');
  let intlDirectory = path.join(currentPath, 'intl');
  const langDirPath = path.join(intlDirectory, lang);
  let msgFiles = null;
  try {
    msgFiles = fs.readdirSync(langDirPath);
  } catch (e) {
    return clonedTxtCount;
  }
  const enDirPath = path.join(rootDir, 'intl', ENGLISH);
  const clonedFileNames: string[] = [];
  msgFiles.forEach(function (msgFile) {
    if (msgFile.indexOf('.') === 0) return;
    const stats = fs.lstatSync(path.join(langDirPath, msgFile));
    if (!stats.isFile()) return;
    // commented out to avoid interference with intercept-stdout in test
    // debug('enumerating...', path.join(langDirPath, msgFile));
    if (cloneEnglishTxt && lang === ENGLISH) {
      if (currentPath === rootDir) return;
      if (getTrailerAfterDot(msgFile) !== 'txt') return;
      const sourceTxtFilePath = path.join(langDirPath, msgFile);
      const filePathHash = msgFileIdHash(msgFile, currentPath);
      if (resTagExists(filePathHash, msgFile, lang, HELPTXT_TAG)) return;
      registerResTag(filePathHash, msgFile, lang, HELPTXT_TAG);
      const targetTxtFilePath = path.join(enDirPath, msgFile);
      clonedFileNames.push(msgFile);
      fs.writeFileSync(targetTxtFilePath, fs.readFileSync(sourceTxtFilePath));
      clonedTxtCount++;
      console.log('--- cloned', sourceTxtFilePath);
    } else {
      const jsonObj = readToJson(langDirPath, msgFile, lang);
      if (jsonObj) {
        callback(jsonObj, path.join(langDirPath, msgFile));
      }
    }
  });
  if (cloneEnglishTxt && lang === ENGLISH && clonedFileNames.length > 0) {
    removeObsoleteFile(enDirPath, clonedFileNames);
  }
  if (checkNodeModules) {
    const depthRoot = directoryDepth(rootDir);
    const moduleRootPaths = resolveDependencies(currentPath, rootDir);
    if (moduleRootPaths) {
      moduleRootPaths.forEach(function (modulePath) {
        const depthModule = directoryDepth(modulePath);
        if (depthModule - depthRoot > maxDirectoryDepth()) return;
        clonedTxtCount = enumerateMsgSyncPriv(
          modulePath,
          rootDir,
          lang,
          false,
          cloneEnglishTxt,
          clonedTxtCount,
          callback
        );
      });
    }
  }
  return clonedTxtCount;
}

export function removeObsoleteFile(dir: string, fileNames: string[]) {
  const files = fs.readdirSync(dir);
  files.forEach(function (file) {
    const matched = file.match(/^([0-9a-f]{32})_(.*\.txt)$/);
    if (!matched) return;
    if (fileNames.indexOf(matched[2]) >= 0) {
      console.log('--- removed', path.join(dir, file));
      fs.unlinkSync(path.join(dir, file));
    }
  });
}

export function directoryDepth(fullPath: string) {
  assert(typeof fullPath === 'string');
  return _.compact(fullPath.split(path.sep)).length;
}

export function maxDirectoryDepth() {
  let depth = parseInt(process.env.STRONGLOOP_GLOBALIZE_MAX_DEPTH!, 10);
  if (isNaN(depth)) depth = BIG_NUM;
  depth = Math.max(1, depth);
  return depth;
}

export function requireResolve(
  depName: string,
  currentDir: string,
  rootDir: string
) {
  // simulates npm v3 dependency resolution
  let depPath = null;
  let stats = null;
  try {
    depPath = path.join(currentDir, 'node_modules', depName);
    stats = fs.lstatSync(depPath);
  } catch (e) {
    stats = null;
    try {
      depPath = path.join(rootDir, 'node_modules', depName);
      stats = fs.lstatSync(depPath);
    } catch (e) {
      return null;
    }
  }
  if (!stats) return null;
  return unsymbolLink(depPath);
}

export function unsymbolLink(filePath: string): string | null {
  if (!filePath) return null;
  let stats = null;
  try {
    stats = fs.lstatSync(filePath);
  } catch (e) {
    return null;
  }
  if (!stats) return null;
  if (stats.isSymbolicLink()) {
    let realPath = null;
    try {
      realPath = process.browser ? filePath : fs.realpathSync(filePath);
    } catch (e) {
      return null;
    }
    return unsymbolLink(realPath);
  } else {
    return stats.isDirectory() ? filePath : null;
  }
}

export function resolveDependencies(
  currentDir: string,
  rootDir: string,
  moduleRootPaths?: string[]
) {
  moduleRootPaths = moduleRootPaths || [];
  const packageJson = path.join(currentDir, 'package.json');
  let deps = null;
  try {
    deps = require(packageJson).dependencies;
  } catch (e) {
    return null;
  }
  if (deps === undefined || !deps) return null;
  deps = Object.keys(deps);
  if (deps.length === 0) return null;
  deps.forEach(function (dep) {
    const depPath = requireResolve(dep, currentDir, rootDir);
    if (depPath && moduleRootPaths!.indexOf(depPath) < 0) {
      moduleRootPaths!.push(depPath);
      resolveDependencies(depPath, rootDir, moduleRootPaths);
    }
  });
  moduleRootPaths = _.uniq(_.compact(moduleRootPaths));
  return moduleRootPaths;
}

/**
 * Read a txt or json file and convert to JSON
 */
const acceptableTrailers = ['json', 'txt'];

export function readToJson(langDirPath: string, msgFile: string, lang: string) {
  const fileType = getTrailerAfterDot(msgFile);
  if (!fileType || acceptableTrailers.indexOf(fileType) < 0) return null;
  let jsonObj: any = null;
  const sourceFilePath = path.join(langDirPath, msgFile);
  if (fileType === 'json') {
    jsonObj = JSON.parse(stripBom(fs.readFileSync(sourceFilePath, 'utf-8')));
  } else {
    // txt
    const origStr = stripBom(fs.readFileSync(sourceFilePath, 'utf8'));
    jsonObj = {};
    const re = /^([0-9a-f]{32})_(.*)\.txt/;
    const results = re.exec(msgFile);

    if (results && results.length === 3) {
      // deep-extracted txt file ?
      msgFile = results[2] + '.txt';
    }

    jsonObj[msgFile] = mapPercent(JSON.parse(JSON.stringify(origStr)));
  }
  if (fileType === 'json' && HASH_KEYS && lang === ENGLISH) {
    const keys = Object.keys(jsonObj);
    keys.forEach(function (key) {
      const newKey = md5(key);
      jsonObj[newKey] = jsonObj[key];
      delete jsonObj[key];
    });
  }
  return jsonObj;
}

export function normalizeKeyArrays(keyArrays?: string | string[]) {
  // keep 0 as "0"
  if (keyArrays == null) return [];
  if (typeof keyArrays === 'string' && keyArrays.length === 0) return [];
  if (!Array.isArray(keyArrays)) return [[keyArrays.toString()]];
  const retKeyArrays: string[][] = [];
  keyArrays.forEach(function (keyArray) {
    if (keyArray === null) return;
    if (typeof keyArray === 'string' && keyArray.length === 0) return;
    if (!Array.isArray(keyArray)) {
      retKeyArrays.push([keyArray.toString()]);
      return;
    }
    const retKeyArray: string[] = [];
    keyArray.forEach(function (key) {
      if (key === null) return;
      if (typeof key === 'string' && key.length === 0) return;
      assert(
        typeof key === 'string' || typeof key === 'number',
        'type of key must be a string or a number.'
      );
      retKeyArray.push(key.toString());
    });
    if (retKeyArray.length > 0) retKeyArrays.push(retKeyArray);
  });
  return retKeyArrays;
}

export function scanJson(
  keys: string[],
  data: AnyObject,
  returnErrors?: boolean
) {
  return scanJsonPriv(keys, data, null, returnErrors);
}

export function replaceJson(keys: string[], data: AnyObject, newValues: any[]) {
  return scanJsonPriv(keys, data, newValues, false);
}

export function scanJsonPriv(
  keys: string[],
  data: AnyObject,
  newValues: any[] | null,
  returnErrors?: boolean
): string[] | AnyObject {
  if (!data || typeof data !== 'object') return [];
  if (newValues) assert(keys.length === newValues.length);
  const keyArrays = normalizeKeyArrays(keys);
  const ret: string[] = [];
  keyArrays.forEach((k, kix) => {
    let d = null;
    let err = null;
    let prevObj: {[name: string]: any} | null = null;
    let prevKey: string | null = null;
    try {
      for (let ix = 0; ix < k.length; ix++) {
        if (ix === 0) d = data;
        if (typeof d === 'string') {
          err = '*** unexpected string value ' + JSON.stringify(k);
          if (returnErrors) ret.push(err);
          else console.log(err);
          return;
        }
        prevObj = d;
        prevKey = k[ix];
        d = d![k[ix]];
      }
      if (typeof d === 'string') {
        if (newValues) prevObj![prevKey!] = newValues[kix];
        else ret.push(d);
      } else {
        err = '*** not a string value ' + JSON.stringify(k);
        if (returnErrors) ret.push(err);
        else console.log(err);
      }
    } catch (e) {
      err = '*** ' + e.toString() + ' ' + JSON.stringify(k);
      if (returnErrors) ret.push(err);
      else console.log(err);
    }
  });
  return newValues ? data : ret;
}

export function sortMsges(msgs: {[name: string]: any}) {
  const keys = Object.keys(msgs);
  const msgKeys = _.remove(keys, function (key) {
    return KEY_HEADERS.some(function (header) {
      return key.indexOf(header) === 0;
    });
  });
  const sorted: {[name: string]: any} = {};
  keys.sort().forEach(function (key) {
    sorted[key] = msgs[key];
  });
  msgKeys.sort().forEach(function (key) {
    sorted[key] = msgs[key];
  });
  return sorted;
}

/**
 * Initialize intl directory structure for non-En languages
 * intl/en must exist.
 * it returns false if failed.
 */
export function initIntlDirs() {
  let intlEnStats;
  try {
    intlEnStats = fs.statSync(path.join(INTL_DIR, ENGLISH));
  } catch (e) {
    return false;
  }
  if (!intlEnStats.isDirectory()) return false;
  if (!TARGET_LANGS) TARGET_LANGS = getSupportedLanguages();
  TARGET_LANGS.forEach(function (lang) {
    mkdirp.sync(path.join(INTL_DIR, lang));
  });
  return true;
}

/**
 * @param {string} lang Supported languages in CLDR notation
 * Returns true for 'en' and supported languages
 * in CLDR notation.
 */
export function isSupportedLanguage(lang?: string) {
  lang = lang || 'en';
  if (!TARGET_LANGS) TARGET_LANGS = getSupportedLanguages();

  return TARGET_LANGS.indexOf(lang) >= 0 || getAppLanguages().indexOf(lang) > 0;
}

/**
 * Returns an array of locales supported by the local cldr data.
 */
export function getSupportedLanguages() {
  const cldrDir = path.join(__dirname, '..', 'cldr');
  let langs: string[] = [];
  enumerateFilesSync(
    cldrDir,
    null,
    ['json'],
    false,
    false,
    (content: string, filePath: string) => {
      let cldr = null;
      try {
        cldr = JSON.parse(content);
      } catch (e) {
        throw new Error('*** CLDR read error on ' + process.platform);
      }
      const theseLangs = Object.keys(cldr.main || {});
      langs = _.concat(langs, theseLangs);
    }
  );
  return _.uniq(langs);
}

export function getAppLanguages() {
  if (STRONGLOOP_GLB && STRONGLOOP_GLB.APP_LANGS) {
    return STRONGLOOP_GLB.APP_LANGS;
  }
  return [];
}

/**
 * Returns trailer of file name.
 */
export function getTrailerAfterDot(name: string) {
  if (typeof name !== 'string') return null;
  const parts = name.split('.');
  if (parts.length < 2) return null;
  return parts[parts.length - 1].toLowerCase();
}

/**
 * Returns package name defined in package.json.
 */
export function getPackageName(root?: string) {
  return getPackageItem(root, 'name');
}

export function getPackageVersion(root?: string) {
  return getPackageItem(root, 'version');
}

export function getPackageItem(root: string | undefined, itemName: string) {
  root = root || MY_ROOT;
  let item = null;
  try {
    item = require(path.join(root, 'package.json'))[itemName];
  } catch (e) {}
  return item;
}

/**
 * @param {string} name to be checked
 * @param {Array} headersAllowed a list of strings to check
 * Returns directory path for the language.
 */
export function headerIncluded(name: string, headersAllowed: string[]) {
  if (typeof name !== 'string') return false;
  let matched = false;
  if (Array.isArray(headersAllowed)) {
    headersAllowed.forEach(function (header) {
      if (matched) return;
      matched = name.indexOf(header) === 0;
    });
  } else if (typeof headersAllowed === 'string') {
    matched = name.indexOf(headersAllowed) === 0;
  }
  return matched;
}

/**
 * @param {string} lang Supported languages in CLDR notation
 * Returns directory path for the language.
 */
export function intlDir(lang: string) {
  lang = lang || ENGLISH;
  return path.join(INTL_DIR, lang);
}

/**
 * %s is included in the string
 */
export function percent(msg: string) {
  return /\%[sdj\%]/.test(msg);
}

/**
 * %replace %s with {N} where N=0,1,2,...
 */
export function mapPercent(msg: string) {
  let ix = 0;
  const output = msg.replace(/\%[sdj\%]/g, (match) => {
    if (match === '%%') return '';
    const str = '{' + ix.toString() + '}';
    ix++;
    return str;
  });
  return output;
}

export function mapArgs(p: string, args: any[]) {
  let ix = 1;
  const output: string[] = [];
  p.replace(/\%[sdj\%]/g, (match) => {
    if (match === '%%') return '';
    let arg = args[ix++];
    if (arg === undefined) arg = 'undefined';
    if (arg === null) arg = 'null';
    output.push(match === '%j' ? JSON.stringify(arg) : arg.toString());
    return '';
  });
  return output;
}

export function repackArgs(
  args: any[] | {[name: number]: any},
  initIx: number
) {
  const argsLength = Array.isArray(args)
    ? args.length
    : Object.keys(args).length;
  if (initIx >= argsLength) return [];
  const output = [];
  for (let ix = initIx; ix < argsLength; ix++) {
    output.push(args[ix]);
  }
  return output;
}

/**
 * Get the language (from the supported languages) that
 * best matches the requested Accept-Language expression.
 *
 * @param req
 * @param globalize
 * @returns {*}
 */

export function getLanguageFromRequest(
  req: {headers: {[name: string]: string}},
  appLanguages: string[],
  defaultLanguage: string
): string {
  if (!req || !req.headers || !req.headers['accept-language']) {
    return defaultLanguage;
  }

  let languages = req.headers['accept-language'].split(',');
  for (let i = 0; i < languages.length; i++) {
    let languageWeighted = languages[i].split(';');
    languageWeighted[0] = getLangAlias(languageWeighted[0].trim());
    languages[i] = languageWeighted.join(';');
  }
  const reqLanguage = languages.join(',');
  if (!reqLanguage) {
    return defaultLanguage;
  }

  // Copy the array so that it won't be mutated
  appLanguages = [defaultLanguage, ...appLanguages];

  acceptLanguage.languages(appLanguages);
  const bestLanguage = acceptLanguage.get(reqLanguage);
  return bestLanguage || defaultLanguage;
}

export function myIntlDir() {
  return INTL_DIR;
}

/**
 * Load messages for the language from a given root directory
 * @param lang Language for messages
 * @param rootDir Root directory
 * @param enumerateNodeModules A flag to control if node_modules will be checked
 */
export function loadMsgFromFile(
  lang: string,
  rootDir: string,
  enumerateNodeModules?: boolean
) {
  assert(lang);
  rootDir = rootDir || getRootDir();
  if (!isLoadMessages(rootDir)) return;
  enumerateNodeModules = enumerateNodeModules || false;
  const tagType = MSG_TAG;
  enumerateMsgSync(
    rootDir,
    lang,
    enumerateNodeModules,
    (jsonObj: AnyObject, filePath: string) => {
      // writeAllToMsg(lang, jsonObj);
      let fileName = path.basename(filePath);
      const re = /^([0-9a-f]{32})_(.*)\.txt/;
      const results = re.exec(fileName);
      let fileIdHash;
      if (results && results.length === 3) {
        // deep-extracted txt file ?
        fileIdHash = results[1];
        fileName = results[2] + '.txt';
      } else {
        fileIdHash = msgFileIdHash(fileName, rootDir);
        fileName = fileName;
      }
      if (resTagExists(fileIdHash, fileName, lang, tagType)) {
        debug('*** loadMsgFromFile(res tag exists): skipping:', lang, fileName);
        return;
      }
      debug('*** loadMsgFromFile(new res tag): loading:', lang, fileName);
      removeDoubleCurlyBraces(jsonObj);
      const messages: AnyObject = {};
      messages[lang] = jsonObj;
      STRONGLOOP_GLB.loadMessages!(messages);
      registerResTag(fileIdHash, fileName, lang, tagType);
      if (STRONGLOOP_GLB.formatters!.has(lang)) {
        const formatters = STRONGLOOP_GLB.formatters!.get(lang);
        for (const key in jsonObj) {
          formatters.delete(key);
        }
      }
    }
  );
}

/**
 * Remove `{{` and `}}`
 */
export function removeDoubleCurlyBraces(json: AnyObject) {
  let count = 0;
  Object.keys(json).forEach((key) => {
    count++;
    if (typeof json[key] !== 'string') {
      // The value for `zz` pseudo code is an array, let's skip
      return;
    }
    json[key] = json[key].replace(/}}/g, '').replace(/{{/g, '');
    debug(count, key + ' : ' + json[key]);
  });
}

/**
 * If an language has alias name that SG supports, return the alias name.
 *
 * The known aliases are hard-coded to solve issue
 * https://github.com/strongloop/strong-globalize/issues/150
 * @param lang
 */
export function getLangAlias(lang: string): string {
  // The {lang: alias} pairs
  let language = _.toLower(lang) || lang;
  const ALIAS_MAP: {[lang: string]: string} = {
    'zh-cn': 'zh-Hans',
    'zh-tw': 'zh-Hant',
  };
  if (lang && ALIAS_MAP.hasOwnProperty(language)) return ALIAS_MAP[language];
  return lang;
}
