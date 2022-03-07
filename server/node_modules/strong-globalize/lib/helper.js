"use strict";
// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: strong-globalize
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLangAlias = exports.removeDoubleCurlyBraces = exports.loadMsgFromFile = exports.myIntlDir = exports.getLanguageFromRequest = exports.repackArgs = exports.mapArgs = exports.mapPercent = exports.percent = exports.intlDir = exports.headerIncluded = exports.getPackageItem = exports.getPackageVersion = exports.getPackageName = exports.getTrailerAfterDot = exports.getAppLanguages = exports.getSupportedLanguages = exports.isSupportedLanguage = exports.initIntlDirs = exports.sortMsges = exports.scanJsonPriv = exports.replaceJson = exports.scanJson = exports.normalizeKeyArrays = exports.readToJson = exports.resolveDependencies = exports.unsymbolLink = exports.requireResolve = exports.maxDirectoryDepth = exports.directoryDepth = exports.removeObsoleteFile = exports.enumerateMsgSyncPriv = exports.enumerateMsgSync = exports.cloneEnglishTxtSyncDeep = exports.enumerateLanguageSync = exports.enumerateFilesSyncPriv = exports.alreadyScanned = exports.enumerateFilesSync = exports.stripBom = exports.resTagExists = exports.registerResTag = exports.msgFileIdHash = exports.validateAmlValue = exports.isLoadMessages = exports.initGlobForSltGlobalize = exports.isRootPackage = exports.getRootDir = exports.setRootDir = exports.hashKeys = exports.MSG_GPB_UNAVAILABLE = exports.BIG_NUM = exports.AML_DEFAULT = exports.AML_NONE = exports.AML_ALL = exports.HELPTXT_TAG = exports.MSG_TAG = exports.PSEUDO_TAG = exports.PSEUDO_LANG = exports.ENGLISH = void 0;
const dbg = require("debug");
const debug = dbg('strong-globalize');
const acceptLanguage = require("accept-language");
const assert = require("assert");
const fs = require("fs");
const _ = require("lodash");
const md5 = require("md5");
const mkdirp = require("mkdirp");
const path = require("path");
const config_1 = require("./config");
exports.ENGLISH = 'en';
exports.PSEUDO_LANG = 'zz';
exports.PSEUDO_TAG = '♚♛♜♝♞♟';
exports.MSG_TAG = 'message';
exports.HELPTXT_TAG = 'helptxt';
exports.AML_ALL = 'all';
exports.AML_NONE = 'none';
exports.AML_DEFAULT = exports.AML_NONE;
exports.BIG_NUM = 999999999999;
exports.MSG_GPB_UNAVAILABLE = '*** Login to GPB failed or GPB.supportedTranslations error.';
const HASH_KEYS = false;
const KEY_HEADERS = ['msg'];
function hashKeys(p) {
    let trailer = null;
    return !(headerIncluded(p, KEY_HEADERS) ||
        (trailer = getTrailerAfterDot(p)) === 'txt' ||
        trailer === 'json' ||
        trailer === 'yml' ||
        trailer === 'yaml' ||
        p.indexOf(exports.PSEUDO_TAG) === 0);
}
exports.hashKeys = hashKeys;
// tslint:disable:no-any
/**
 * Supported languages in CLDR notation
 */
let TARGET_LANGS = null;
let MY_ROOT = process.cwd();
let INTL_DIR = path.join(MY_ROOT, 'intl');
/**
 * @param {string} Override the root directory path
 */
function setRootDir(rootPath) {
    let validPath = true;
    let rootStats = undefined;
    try {
        rootStats = fs.statSync(rootPath);
    }
    catch (e) {
        validPath = false;
    }
    assert(validPath, '*** setRootDir: Root path invalid: ' + rootPath);
    if (!rootStats.isDirectory())
        validPath = false;
    assert(validPath, '*** setRootDir: Root path is not a directory: ' + rootPath.toString());
    let files = undefined;
    try {
        files = fs.readdirSync(rootPath);
    }
    catch (e) {
        validPath = false;
    }
    validPath = validPath && !!files;
    if (validPath) {
        let intlDirFound = false;
        files.forEach(function (item) {
            if (intlDirFound)
                return;
            if (item === 'intl')
                intlDirFound = true;
        });
        validPath = intlDirFound;
    }
    assert(validPath, '*** setRootDir: Intl dir not found under: ' + rootPath.toString());
    MY_ROOT = rootPath;
    INTL_DIR = path.join(MY_ROOT, 'intl');
}
exports.setRootDir = setRootDir;
function getRootDir() {
    return MY_ROOT;
}
exports.getRootDir = getRootDir;
function isRootPackage() {
    return MY_ROOT === config_1.STRONGLOOP_GLB.MASTER_ROOT_DIR;
}
exports.isRootPackage = isRootPackage;
function initGlobForSltGlobalize(rootDir) {
    if (config_1.STRONGLOOP_GLB.MASTER_ROOT_DIR)
        return;
    Object.assign(config_1.STRONGLOOP_GLB, {
        MASTER_ROOT_DIR: rootDir || getRootDir(),
        MSG_RES_LOADED: [],
    });
}
exports.initGlobForSltGlobalize = initGlobForSltGlobalize;
function isLoadMessages(rootDir) {
    if (!config_1.STRONGLOOP_GLB.MASTER_ROOT_DIR)
        return false;
    if (path.resolve(rootDir) === path.resolve(config_1.STRONGLOOP_GLB.MASTER_ROOT_DIR))
        return true;
    if (!config_1.STRONGLOOP_GLB.AUTO_MSG_LOADING)
        return false;
    if (config_1.STRONGLOOP_GLB.AUTO_MSG_LOADING === exports.AML_NONE)
        return false;
    if (config_1.STRONGLOOP_GLB.AUTO_MSG_LOADING === exports.AML_ALL)
        return true;
    const packagesToLoad = config_1.STRONGLOOP_GLB.AUTO_MSG_LOADING;
    const packageName = getPackageName(rootDir);
    const load = packagesToLoad.indexOf(packageName) >= 0;
    return load;
}
exports.isLoadMessages = isLoadMessages;
function validateAmlValue(aml) {
    if (aml === exports.AML_ALL || aml === exports.AML_NONE)
        return aml;
    if (Array.isArray(aml)) {
        if (aml.length === 0)
            return false;
        aml.forEach(function (v) {
            if (typeof aml !== 'string')
                return false;
        });
        return aml;
    }
    return false;
}
exports.validateAmlValue = validateAmlValue;
function msgFileIdHash(fileName, rootDir) {
    assert(fileName);
    rootDir = rootDir || getRootDir();
    const packageName = getPackageName(rootDir);
    const packageVersion = getPackageVersion(rootDir);
    const msgFileId = fileName + packageName + packageVersion;
    return md5(msgFileId);
}
exports.msgFileIdHash = msgFileIdHash;
function registerResTag(fileIdHash, fileName, lang, tagType) {
    assert(config_1.STRONGLOOP_GLB);
    assert(fileIdHash);
    assert(fileName);
    assert(lang);
    assert(tagType);
    if (resTagExists(fileIdHash, fileName, lang, tagType))
        return false;
    const resTag = {
        fileIdHash: fileIdHash,
        fileName: fileName,
        lang: lang,
        tagType: tagType,
    };
    config_1.STRONGLOOP_GLB.MSG_RES_LOADED.push(resTag);
    return true;
}
exports.registerResTag = registerResTag;
function resTagExists(fileIdHash, fileName, lang, tagType) {
    assert(config_1.STRONGLOOP_GLB);
    assert(fileIdHash);
    assert(fileName);
    assert(lang);
    assert(tagType);
    const resTag = {
        fileIdHash: fileIdHash,
        lang: lang,
        tagType: tagType,
    };
    const exists = _.find(config_1.STRONGLOOP_GLB.MSG_RES_LOADED, resTag) !== undefined;
    return exists;
}
exports.resTagExists = resTagExists;
function stripBom(str) {
    return str.charCodeAt(0) === 0xfeff ? str.slice(1) : str;
}
exports.stripBom = stripBom;
/**
 * Enumerate all JS files in this application
 * @param {Function}
 *   param.content is a UTF8 string of each JS source file.
 */
const showDotCount = 500;
const showCountCount = 10000;
let enumeratedFilesCount = 0;
let scannedFileNameHash = null;
function enumerateFilesSync(rootDir, blackList, targetFileType, verbose, checkNodeModules, callback) {
    enumeratedFilesCount = 0;
    scannedFileNameHash = [];
    return enumerateFilesSyncPriv(rootDir, rootDir, blackList, targetFileType, verbose, checkNodeModules, callback);
}
exports.enumerateFilesSync = enumerateFilesSync;
function alreadyScanned(fileName) {
    const realFileName = process.browser ? fileName : fs.realpathSync(fileName);
    const fileNameHash = md5(realFileName);
    if (scannedFileNameHash.indexOf(fileNameHash) >= 0) {
        return true;
    }
    else {
        scannedFileNameHash.push(fileNameHash);
        return false;
    }
}
exports.alreadyScanned = alreadyScanned;
function enumerateFilesSyncPriv(currentPath, rootDir, blackList, targetFileType, verbose, checkNodeModules, callback) {
    if (!currentPath)
        currentPath = MY_ROOT;
    if (!rootDir)
        rootDir = MY_ROOT;
    currentPath = path.resolve(currentPath);
    if (alreadyScanned(currentPath))
        return;
    rootDir = path.resolve(rootDir);
    blackList = Array.isArray(blackList) ? blackList : [];
    if (!Array.isArray(targetFileType))
        targetFileType = [targetFileType];
    let skipDir = false;
    blackList.forEach(function (part) {
        if (typeof part !== 'string')
            return;
        if (currentPath.indexOf(part) >= 0)
            skipDir = true;
    });
    if (skipDir) {
        if (verbose)
            console.log('***  skipping directory:', currentPath);
        return;
    }
    let files = null;
    try {
        files = fs.readdirSync(currentPath);
    }
    catch (e) {
        return;
    }
    files.forEach(function (item) {
        if (item.indexOf('.') === 0)
            return;
        const child = path.join(currentPath, item);
        let stats = null;
        try {
            stats = fs.statSync(child);
        }
        catch (e) {
            return;
        }
        if (stats.isDirectory()) {
            item = item.toLowerCase();
            if (item === 'test' || item === 'node_modules' || item === 'coverage')
                return;
            enumerateFilesSyncPriv(child, rootDir, blackList, targetFileType, verbose, checkNodeModules, callback);
        }
        else {
            const fileType = getTrailerAfterDot(item);
            if (!fileType || targetFileType.indexOf(fileType) < 0)
                return;
            const content = stripBom(fs.readFileSync(child, 'utf8'));
            if (verbose)
                console.log('~~~ examining file:', child);
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
                if (depthModule - depthRoot > maxDirectoryDepth())
                    return;
                enumerateFilesSyncPriv(modulePath, rootDir, blackList, targetFileType, verbose, checkNodeModules, callback);
            });
        }
    }
}
exports.enumerateFilesSyncPriv = enumerateFilesSyncPriv;
/**
 * @param action A function to be invoked for each target language.
 * If it returns `true`, the enumeration will be terminated.
 */
function enumerateLanguageSync(action) {
    if (!TARGET_LANGS)
        TARGET_LANGS = getSupportedLanguages();
    for (const lang of TARGET_LANGS) {
        const stopEnumeration = action(lang);
        if (stopEnumeration)
            return;
    }
}
exports.enumerateLanguageSync = enumerateLanguageSync;
/**
 * @param {string} lang Supported languages in CLDR notation
 * @param {Function}
 *   If callback returns err; if err, stop enumeration.
 */
function cloneEnglishTxtSyncDeep(rootDir) {
    if (!rootDir)
        rootDir = MY_ROOT;
    const enDirPath = path.join(rootDir, 'intl', exports.ENGLISH);
    mkdirp.sync(enDirPath);
    return enumerateMsgSyncPriv(rootDir, rootDir, exports.ENGLISH, true, true, 0, function () { });
}
exports.cloneEnglishTxtSyncDeep = cloneEnglishTxtSyncDeep;
function enumerateMsgSync(rootDir, lang, checkNodeModules, callback) {
    return enumerateMsgSyncPriv(rootDir, rootDir, lang, checkNodeModules, false, 0, callback);
}
exports.enumerateMsgSync = enumerateMsgSync;
function enumerateMsgSyncPriv(currentPath, rootDir, lang, checkNodeModules, cloneEnglishTxt, clonedTxtCount, callback) {
    assert(currentPath);
    assert(rootDir);
    assert(typeof callback === 'function');
    let intlDirectory = path.join(currentPath, 'intl');
    const langDirPath = path.join(intlDirectory, lang);
    let msgFiles = null;
    try {
        msgFiles = fs.readdirSync(langDirPath);
    }
    catch (e) {
        return clonedTxtCount;
    }
    const enDirPath = path.join(rootDir, 'intl', exports.ENGLISH);
    const clonedFileNames = [];
    msgFiles.forEach(function (msgFile) {
        if (msgFile.indexOf('.') === 0)
            return;
        const stats = fs.lstatSync(path.join(langDirPath, msgFile));
        if (!stats.isFile())
            return;
        // commented out to avoid interference with intercept-stdout in test
        // debug('enumerating...', path.join(langDirPath, msgFile));
        if (cloneEnglishTxt && lang === exports.ENGLISH) {
            if (currentPath === rootDir)
                return;
            if (getTrailerAfterDot(msgFile) !== 'txt')
                return;
            const sourceTxtFilePath = path.join(langDirPath, msgFile);
            const filePathHash = msgFileIdHash(msgFile, currentPath);
            if (resTagExists(filePathHash, msgFile, lang, exports.HELPTXT_TAG))
                return;
            registerResTag(filePathHash, msgFile, lang, exports.HELPTXT_TAG);
            const targetTxtFilePath = path.join(enDirPath, msgFile);
            clonedFileNames.push(msgFile);
            fs.writeFileSync(targetTxtFilePath, fs.readFileSync(sourceTxtFilePath));
            clonedTxtCount++;
            console.log('--- cloned', sourceTxtFilePath);
        }
        else {
            const jsonObj = readToJson(langDirPath, msgFile, lang);
            if (jsonObj) {
                callback(jsonObj, path.join(langDirPath, msgFile));
            }
        }
    });
    if (cloneEnglishTxt && lang === exports.ENGLISH && clonedFileNames.length > 0) {
        removeObsoleteFile(enDirPath, clonedFileNames);
    }
    if (checkNodeModules) {
        const depthRoot = directoryDepth(rootDir);
        const moduleRootPaths = resolveDependencies(currentPath, rootDir);
        if (moduleRootPaths) {
            moduleRootPaths.forEach(function (modulePath) {
                const depthModule = directoryDepth(modulePath);
                if (depthModule - depthRoot > maxDirectoryDepth())
                    return;
                clonedTxtCount = enumerateMsgSyncPriv(modulePath, rootDir, lang, false, cloneEnglishTxt, clonedTxtCount, callback);
            });
        }
    }
    return clonedTxtCount;
}
exports.enumerateMsgSyncPriv = enumerateMsgSyncPriv;
function removeObsoleteFile(dir, fileNames) {
    const files = fs.readdirSync(dir);
    files.forEach(function (file) {
        const matched = file.match(/^([0-9a-f]{32})_(.*\.txt)$/);
        if (!matched)
            return;
        if (fileNames.indexOf(matched[2]) >= 0) {
            console.log('--- removed', path.join(dir, file));
            fs.unlinkSync(path.join(dir, file));
        }
    });
}
exports.removeObsoleteFile = removeObsoleteFile;
function directoryDepth(fullPath) {
    assert(typeof fullPath === 'string');
    return _.compact(fullPath.split(path.sep)).length;
}
exports.directoryDepth = directoryDepth;
function maxDirectoryDepth() {
    let depth = parseInt(process.env.STRONGLOOP_GLOBALIZE_MAX_DEPTH, 10);
    if (isNaN(depth))
        depth = exports.BIG_NUM;
    depth = Math.max(1, depth);
    return depth;
}
exports.maxDirectoryDepth = maxDirectoryDepth;
function requireResolve(depName, currentDir, rootDir) {
    // simulates npm v3 dependency resolution
    let depPath = null;
    let stats = null;
    try {
        depPath = path.join(currentDir, 'node_modules', depName);
        stats = fs.lstatSync(depPath);
    }
    catch (e) {
        stats = null;
        try {
            depPath = path.join(rootDir, 'node_modules', depName);
            stats = fs.lstatSync(depPath);
        }
        catch (e) {
            return null;
        }
    }
    if (!stats)
        return null;
    return unsymbolLink(depPath);
}
exports.requireResolve = requireResolve;
function unsymbolLink(filePath) {
    if (!filePath)
        return null;
    let stats = null;
    try {
        stats = fs.lstatSync(filePath);
    }
    catch (e) {
        return null;
    }
    if (!stats)
        return null;
    if (stats.isSymbolicLink()) {
        let realPath = null;
        try {
            realPath = process.browser ? filePath : fs.realpathSync(filePath);
        }
        catch (e) {
            return null;
        }
        return unsymbolLink(realPath);
    }
    else {
        return stats.isDirectory() ? filePath : null;
    }
}
exports.unsymbolLink = unsymbolLink;
function resolveDependencies(currentDir, rootDir, moduleRootPaths) {
    moduleRootPaths = moduleRootPaths || [];
    const packageJson = path.join(currentDir, 'package.json');
    let deps = null;
    try {
        deps = require(packageJson).dependencies;
    }
    catch (e) {
        return null;
    }
    if (deps === undefined || !deps)
        return null;
    deps = Object.keys(deps);
    if (deps.length === 0)
        return null;
    deps.forEach(function (dep) {
        const depPath = requireResolve(dep, currentDir, rootDir);
        if (depPath && moduleRootPaths.indexOf(depPath) < 0) {
            moduleRootPaths.push(depPath);
            resolveDependencies(depPath, rootDir, moduleRootPaths);
        }
    });
    moduleRootPaths = _.uniq(_.compact(moduleRootPaths));
    return moduleRootPaths;
}
exports.resolveDependencies = resolveDependencies;
/**
 * Read a txt or json file and convert to JSON
 */
const acceptableTrailers = ['json', 'txt'];
function readToJson(langDirPath, msgFile, lang) {
    const fileType = getTrailerAfterDot(msgFile);
    if (!fileType || acceptableTrailers.indexOf(fileType) < 0)
        return null;
    let jsonObj = null;
    const sourceFilePath = path.join(langDirPath, msgFile);
    if (fileType === 'json') {
        jsonObj = JSON.parse(stripBom(fs.readFileSync(sourceFilePath, 'utf-8')));
    }
    else {
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
    if (fileType === 'json' && HASH_KEYS && lang === exports.ENGLISH) {
        const keys = Object.keys(jsonObj);
        keys.forEach(function (key) {
            const newKey = md5(key);
            jsonObj[newKey] = jsonObj[key];
            delete jsonObj[key];
        });
    }
    return jsonObj;
}
exports.readToJson = readToJson;
function normalizeKeyArrays(keyArrays) {
    // keep 0 as "0"
    if (keyArrays == null)
        return [];
    if (typeof keyArrays === 'string' && keyArrays.length === 0)
        return [];
    if (!Array.isArray(keyArrays))
        return [[keyArrays.toString()]];
    const retKeyArrays = [];
    keyArrays.forEach(function (keyArray) {
        if (keyArray === null)
            return;
        if (typeof keyArray === 'string' && keyArray.length === 0)
            return;
        if (!Array.isArray(keyArray)) {
            retKeyArrays.push([keyArray.toString()]);
            return;
        }
        const retKeyArray = [];
        keyArray.forEach(function (key) {
            if (key === null)
                return;
            if (typeof key === 'string' && key.length === 0)
                return;
            assert(typeof key === 'string' || typeof key === 'number', 'type of key must be a string or a number.');
            retKeyArray.push(key.toString());
        });
        if (retKeyArray.length > 0)
            retKeyArrays.push(retKeyArray);
    });
    return retKeyArrays;
}
exports.normalizeKeyArrays = normalizeKeyArrays;
function scanJson(keys, data, returnErrors) {
    return scanJsonPriv(keys, data, null, returnErrors);
}
exports.scanJson = scanJson;
function replaceJson(keys, data, newValues) {
    return scanJsonPriv(keys, data, newValues, false);
}
exports.replaceJson = replaceJson;
function scanJsonPriv(keys, data, newValues, returnErrors) {
    if (!data || typeof data !== 'object')
        return [];
    if (newValues)
        assert(keys.length === newValues.length);
    const keyArrays = normalizeKeyArrays(keys);
    const ret = [];
    keyArrays.forEach((k, kix) => {
        let d = null;
        let err = null;
        let prevObj = null;
        let prevKey = null;
        try {
            for (let ix = 0; ix < k.length; ix++) {
                if (ix === 0)
                    d = data;
                if (typeof d === 'string') {
                    err = '*** unexpected string value ' + JSON.stringify(k);
                    if (returnErrors)
                        ret.push(err);
                    else
                        console.log(err);
                    return;
                }
                prevObj = d;
                prevKey = k[ix];
                d = d[k[ix]];
            }
            if (typeof d === 'string') {
                if (newValues)
                    prevObj[prevKey] = newValues[kix];
                else
                    ret.push(d);
            }
            else {
                err = '*** not a string value ' + JSON.stringify(k);
                if (returnErrors)
                    ret.push(err);
                else
                    console.log(err);
            }
        }
        catch (e) {
            err = '*** ' + e.toString() + ' ' + JSON.stringify(k);
            if (returnErrors)
                ret.push(err);
            else
                console.log(err);
        }
    });
    return newValues ? data : ret;
}
exports.scanJsonPriv = scanJsonPriv;
function sortMsges(msgs) {
    const keys = Object.keys(msgs);
    const msgKeys = _.remove(keys, function (key) {
        return KEY_HEADERS.some(function (header) {
            return key.indexOf(header) === 0;
        });
    });
    const sorted = {};
    keys.sort().forEach(function (key) {
        sorted[key] = msgs[key];
    });
    msgKeys.sort().forEach(function (key) {
        sorted[key] = msgs[key];
    });
    return sorted;
}
exports.sortMsges = sortMsges;
/**
 * Initialize intl directory structure for non-En languages
 * intl/en must exist.
 * it returns false if failed.
 */
function initIntlDirs() {
    let intlEnStats;
    try {
        intlEnStats = fs.statSync(path.join(INTL_DIR, exports.ENGLISH));
    }
    catch (e) {
        return false;
    }
    if (!intlEnStats.isDirectory())
        return false;
    if (!TARGET_LANGS)
        TARGET_LANGS = getSupportedLanguages();
    TARGET_LANGS.forEach(function (lang) {
        mkdirp.sync(path.join(INTL_DIR, lang));
    });
    return true;
}
exports.initIntlDirs = initIntlDirs;
/**
 * @param {string} lang Supported languages in CLDR notation
 * Returns true for 'en' and supported languages
 * in CLDR notation.
 */
function isSupportedLanguage(lang) {
    lang = lang || 'en';
    if (!TARGET_LANGS)
        TARGET_LANGS = getSupportedLanguages();
    return TARGET_LANGS.indexOf(lang) >= 0 || getAppLanguages().indexOf(lang) > 0;
}
exports.isSupportedLanguage = isSupportedLanguage;
/**
 * Returns an array of locales supported by the local cldr data.
 */
function getSupportedLanguages() {
    const cldrDir = path.join(__dirname, '..', 'cldr');
    let langs = [];
    enumerateFilesSync(cldrDir, null, ['json'], false, false, (content, filePath) => {
        let cldr = null;
        try {
            cldr = JSON.parse(content);
        }
        catch (e) {
            throw new Error('*** CLDR read error on ' + process.platform);
        }
        const theseLangs = Object.keys(cldr.main || {});
        langs = _.concat(langs, theseLangs);
    });
    return _.uniq(langs);
}
exports.getSupportedLanguages = getSupportedLanguages;
function getAppLanguages() {
    if (config_1.STRONGLOOP_GLB && config_1.STRONGLOOP_GLB.APP_LANGS) {
        return config_1.STRONGLOOP_GLB.APP_LANGS;
    }
    return [];
}
exports.getAppLanguages = getAppLanguages;
/**
 * Returns trailer of file name.
 */
function getTrailerAfterDot(name) {
    if (typeof name !== 'string')
        return null;
    const parts = name.split('.');
    if (parts.length < 2)
        return null;
    return parts[parts.length - 1].toLowerCase();
}
exports.getTrailerAfterDot = getTrailerAfterDot;
/**
 * Returns package name defined in package.json.
 */
function getPackageName(root) {
    return getPackageItem(root, 'name');
}
exports.getPackageName = getPackageName;
function getPackageVersion(root) {
    return getPackageItem(root, 'version');
}
exports.getPackageVersion = getPackageVersion;
function getPackageItem(root, itemName) {
    root = root || MY_ROOT;
    let item = null;
    try {
        item = require(path.join(root, 'package.json'))[itemName];
    }
    catch (e) { }
    return item;
}
exports.getPackageItem = getPackageItem;
/**
 * @param {string} name to be checked
 * @param {Array} headersAllowed a list of strings to check
 * Returns directory path for the language.
 */
function headerIncluded(name, headersAllowed) {
    if (typeof name !== 'string')
        return false;
    let matched = false;
    if (Array.isArray(headersAllowed)) {
        headersAllowed.forEach(function (header) {
            if (matched)
                return;
            matched = name.indexOf(header) === 0;
        });
    }
    else if (typeof headersAllowed === 'string') {
        matched = name.indexOf(headersAllowed) === 0;
    }
    return matched;
}
exports.headerIncluded = headerIncluded;
/**
 * @param {string} lang Supported languages in CLDR notation
 * Returns directory path for the language.
 */
function intlDir(lang) {
    lang = lang || exports.ENGLISH;
    return path.join(INTL_DIR, lang);
}
exports.intlDir = intlDir;
/**
 * %s is included in the string
 */
function percent(msg) {
    return /\%[sdj\%]/.test(msg);
}
exports.percent = percent;
/**
 * %replace %s with {N} where N=0,1,2,...
 */
function mapPercent(msg) {
    let ix = 0;
    const output = msg.replace(/\%[sdj\%]/g, (match) => {
        if (match === '%%')
            return '';
        const str = '{' + ix.toString() + '}';
        ix++;
        return str;
    });
    return output;
}
exports.mapPercent = mapPercent;
function mapArgs(p, args) {
    let ix = 1;
    const output = [];
    p.replace(/\%[sdj\%]/g, (match) => {
        if (match === '%%')
            return '';
        let arg = args[ix++];
        if (arg === undefined)
            arg = 'undefined';
        if (arg === null)
            arg = 'null';
        output.push(match === '%j' ? JSON.stringify(arg) : arg.toString());
        return '';
    });
    return output;
}
exports.mapArgs = mapArgs;
function repackArgs(args, initIx) {
    const argsLength = Array.isArray(args)
        ? args.length
        : Object.keys(args).length;
    if (initIx >= argsLength)
        return [];
    const output = [];
    for (let ix = initIx; ix < argsLength; ix++) {
        output.push(args[ix]);
    }
    return output;
}
exports.repackArgs = repackArgs;
/**
 * Get the language (from the supported languages) that
 * best matches the requested Accept-Language expression.
 *
 * @param req
 * @param globalize
 * @returns {*}
 */
function getLanguageFromRequest(req, appLanguages, defaultLanguage) {
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
exports.getLanguageFromRequest = getLanguageFromRequest;
function myIntlDir() {
    return INTL_DIR;
}
exports.myIntlDir = myIntlDir;
/**
 * Load messages for the language from a given root directory
 * @param lang Language for messages
 * @param rootDir Root directory
 * @param enumerateNodeModules A flag to control if node_modules will be checked
 */
function loadMsgFromFile(lang, rootDir, enumerateNodeModules) {
    assert(lang);
    rootDir = rootDir || getRootDir();
    if (!isLoadMessages(rootDir))
        return;
    enumerateNodeModules = enumerateNodeModules || false;
    const tagType = exports.MSG_TAG;
    enumerateMsgSync(rootDir, lang, enumerateNodeModules, (jsonObj, filePath) => {
        // writeAllToMsg(lang, jsonObj);
        let fileName = path.basename(filePath);
        const re = /^([0-9a-f]{32})_(.*)\.txt/;
        const results = re.exec(fileName);
        let fileIdHash;
        if (results && results.length === 3) {
            // deep-extracted txt file ?
            fileIdHash = results[1];
            fileName = results[2] + '.txt';
        }
        else {
            fileIdHash = msgFileIdHash(fileName, rootDir);
            fileName = fileName;
        }
        if (resTagExists(fileIdHash, fileName, lang, tagType)) {
            debug('*** loadMsgFromFile(res tag exists): skipping:', lang, fileName);
            return;
        }
        debug('*** loadMsgFromFile(new res tag): loading:', lang, fileName);
        removeDoubleCurlyBraces(jsonObj);
        const messages = {};
        messages[lang] = jsonObj;
        config_1.STRONGLOOP_GLB.loadMessages(messages);
        registerResTag(fileIdHash, fileName, lang, tagType);
        if (config_1.STRONGLOOP_GLB.formatters.has(lang)) {
            const formatters = config_1.STRONGLOOP_GLB.formatters.get(lang);
            for (const key in jsonObj) {
                formatters.delete(key);
            }
        }
    });
}
exports.loadMsgFromFile = loadMsgFromFile;
/**
 * Remove `{{` and `}}`
 */
function removeDoubleCurlyBraces(json) {
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
exports.removeDoubleCurlyBraces = removeDoubleCurlyBraces;
/**
 * If an language has alias name that SG supports, return the alias name.
 *
 * The known aliases are hard-coded to solve issue
 * https://github.com/strongloop/strong-globalize/issues/150
 * @param lang
 */
function getLangAlias(lang) {
    // The {lang: alias} pairs
    let language = _.toLower(lang) || lang;
    const ALIAS_MAP = {
        'zh-cn': 'zh-Hans',
        'zh-tw': 'zh-Hant',
    };
    if (lang && ALIAS_MAP.hasOwnProperty(language))
        return ALIAS_MAP[language];
    return lang;
}
exports.getLangAlias = getLangAlias;
//# sourceMappingURL=helper.js.map