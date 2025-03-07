//
// ==================== Class ==================== //
//

//
// ----- ダイアログ
//
var DialogManager = function () {

    var _window;
    var _imageCheckboxExport;
    var _imageEdittextDirectory;
    var _imageRadiobuttonPng;
    var _imageRadiobuttonJpg;
    var _imageRadiobuttonGif;
    var _imageDropdownlistJpgCompress;
    var _okBtn;
    var _cancelBtn;
    var _isExportImages = true;
    var _imageFolderPath = null;
    var _jpegCompressRate = null;
    var _defaultFileType = null;
    var _otherEdittextColor;


    // 初期化
    this.init = function () {
        var totalY = 0;
        // ウィンドウ作成
        _window = new Window("dialog", "HTML初期構築自動化 (画像のみ) ver2.1", _getPosition({x:200, y:200, w:390, h:400}));
        // 画像ファイル設定
        totalY = 20;
        _imageCheckboxExport = _window.add("checkbox", _getPosition({x:20, y:totalY, w:320, h:40}), "画像ファイルを書き出す");
        _imageCheckboxExport.value = true;
        imagePanel = _window.add("panel", _getPosition({x:20, y:totalY + 40, w:350, h:130}), "画像ファイル設定");
        imagePanel.add("statictext", _getPosition({x:20, y:20, w:100, h:20}), "ディレクトリ :").justify = "right";
        _imageEdittextDirectory = imagePanel.add("edittext", _getPosition({x:130, y:20, w:200, h:20}), "images");
        imagePanel.add("statictext", _getPosition({x:20, y:50, w:100, h:20}), "ファイル形式 :").justify = "right";
        _imageRadiobuttonPng = imagePanel.add("radiobutton", _getPosition({x:130, y:50, w:50, h:20}), "PNG");
        _imageRadiobuttonPng.value = true;
        _imageRadiobuttonJpg = imagePanel.add("radiobutton", _getPosition({x:190, y:50, w:50, h:20}), "JPEG");
        _imageRadiobuttonJpg.value = false;
        _imageRadiobuttonGif = imagePanel.add("radiobutton", _getPosition({x:250, y:50, w:50, h:20}), "GIF");
        _imageRadiobuttonGif.value = false;
        imagePanel.add("statictext", _getPosition({x:20, y:80, w:100, h:20}), "JPEG画質 :").justify = "right";
        _imageDropdownlistJpgCompress = imagePanel.add("dropdownlist", _getPosition({x:130, y:80, w:200, h:20}), ["100 （最高画質）", "90", "80 （高画質）", "70", "60 （やや高画質）", "50", "40", "30 （中画質）", "20", "10 （低画質）"]);
        _imageDropdownlistJpgCompress.selection = 2;

        // その他オプション
        totalY = 200;
        _window.add("statictext", _getPosition({x:20, y:totalY, w:90, h:20}), "背景色 :").justify = "right";
        _otherEdittextColor = _window.add("edittext", _getPosition({x:120, y:totalY, w:200, h:20}), "#ffffff");

        // OKボタン
        totalY = 300;
        _okBtn = _window.add("button", _getPosition({x:90, y:totalY, w:100, h:30}), "OK", { name:"ok" });
        _okBtn.onClick = function () {
            _close({flg:true});
        };
        // CANCELボタン
        _cancelBtn = _window.add("button", _getPosition({x:200, y:totalY, w:100, h:30}), "Cancel", { name:"cancel" });
        _cancelBtn.onClick = function () {
            _close({flg:false});
        };
        // コピーライト
        _window.add("statictext", _getPosition({x:20, y:totalY + 50, w:350, h:20}), "Developed : @knockknockjp").justify = "right";
        _window.add("statictext", _getPosition({x:20, y:totalY + 70, w:350, h:20}), "URL : http://www.knockknock.jp").justify = "right";
        _window.add("statictext", _getPosition({x:20, y:totalY + 90, w:350, h:20}), "e-Mail : nishida@knockknock.jp").justify = "right";
    };

    // 開く
    this.open = function () {
        _window.show();
    };

    // 画像ファイルを書き出すか否か
    this.getIsExportImages = function () {
        return _isExportImages;
    };

    // 画像ファイル格納場所
    this.getImageFolderPath = function () {
        return _imageFolderPath;
    };

    // JPEG圧縮率
    this.getJpegCompressRate = function () {
        return _jpegCompressRate;
    };

    // デフォルト画像形式
    this.getDefaultFileType = function () {
        return _defaultFileType;
    };

    // 背景カラー
    this.getOtherBgColor = function () {
        return _otherBgColor;
    };

    // 閉じる
    function _close(e) {
        if (e.flg) {
            var str = "";
            var selection = "";
            // 画像ファイルを書き出すか否か
            _isExportImages = _imageCheckboxExport.value;
            // 画像ファイル格納場所
            _imageFolderPath = _setDirectoryText({str:_imageEdittextDirectory.text});
            // 背景カラー
            _otherBgColor = getHexColorTextUtil(_otherEdittextColor.text);

            // JPEG圧縮率
            _jpegCompressRate = 80;
            selection = String(_imageDropdownlistJpgCompress.selection);
            switch (selection) {
                case "100 （最高画質）":
                    _jpegCompressRate = 100;
                    break;
                case "90":
                    _jpegCompressRate = 90;
                    break;
                case "80 （高画質）":
                    _jpegCompressRate = 80;
                    break;
                case "70":
                    _jpegCompressRate = 70;
                    break;
                case "60 （やや高画質）":
                    _jpegCompressRate = 60;
                    break;
                case "50":
                    _jpegCompressRate = 50;
                    break;
                case "40":
                    _jpegCompressRate = 40;
                    break;
                case "30 （中画質）":
                    _jpegCompressRate = 30;
                    break;
                case "20":
                    _jpegCompressRate = 20;
                    break;
                case "10 （低画質）":
                    _jpegCompressRate = 10;
                    break;
            }

            // デフォルト画像形式
            _defaultFileType = FILE_KEY_PNG;
            if (_imageRadiobuttonPng.value) {
                _defaultFileType = FILE_KEY_PNG;
            } else if (_imageRadiobuttonJpg.value) {
                _defaultFileType = FILE_KEY_JPG;
            } else if (_imageRadiobuttonGif.value) {
                _defaultFileType = FILE_KEY_GIF;
            }

            _window.close();
            // エラーチェックイベント
            checkErrorEvent();
        } else {
            _window.close();
            alert("取り消しました");
        }
    }

    // アイテム位置情報取得
    function _getPosition(e) {
        return [ e.x, e.y, e.w + e.x, e.h + e.y ];
    }

    // ディレクトリテキスト作成
    function _setDirectoryText(e) {
        var str = String(e.str);
        var str2 = "";
        var flg = false;
        var flg2 = false;
        var length = str.length;
        for (var i = 0; i < length; i++) {
            if (!flg && String(str[i]).match(/[^0-9A-Za-z_-]+/) == null) {
                flg = true;
            }
            if (flg && String(str[i]).match(/[^0-9A-Za-z_.\/-]+/) == null) {
                if (String(str[i]).match(/[^\/]+/) == null) {
                    if (flg2) {
                        return str2.substr(0, str2.length - 1);
                    } else {
                        str2 += str[i];
                    }
                    flg2 = true;
                } else {
                    str2 += str[i];
                    flg2 = false;
                }
            }
        }
        if (str2.charAt(str2.length - 1) == "/") {
            str2 = str2.substr(0, str2.length - 1);
        }
        return str2;
    }

};

//
// ----- エラー管理
//
var ErrorChecker = function () {

    var _errorMsgSave;
    var _errorMsgDuplicate;
    var _errorMsgName;
    var _errorMsgExist;

    var _layerName;

    // 初期化
    this.init = function () {
        _errorMsgSave = "";
        _errorMsgDuplicate = "";
        _errorMsgName = "";
        _errorMsgExist = "";
        _layerName = "";
    };

    // チェック
    this.check = function (e) {
        _checkSave();
        _checkDuplicate({
            item:activeDocument,
            name:""
        });
        _checkName({
            item:activeDocument,
            name:""
        });
        _checkExist({
            item:activeDocument,
            name:""
        });
        var msg = "";
        if (_errorMsgSave != "" || _errorMsgDuplicate != "" || _errorMsgName != "" || _errorMsgExist != "") {
            msg = "以下のエラーがあります。\n\n";
            if (_errorMsgSave != "") msg += _errorMsgSave;
            if (_errorMsgDuplicate != "") msg += "■レイヤー及びレイヤーセットの名称でIDに重複しているものがあります。\n\n" + _errorMsgDuplicate;
            if (_errorMsgName != "") msg += "■レイヤー及びレイヤーセットの名称でIDに使用出来ない文字列が存在します。\n\n" + _errorMsgName;
            if (_errorMsgExist != "") msg += "■表示範囲に要素がないレイヤー及びレイヤーセットが存在します。\n\n" + _errorMsgExist;
        }
        if (msg != "") {
            alert(msg);
        } else {
            // 書き出し開始イベント
            startExportEvent();
        }
    };

    // 保存チェック
    function _checkSave() {
        if (!activeDocument || !activeDocument.path) {
            _errorMsgSave += "■実行するには、PSDドキュメントを保存する必要があります。\n\n";
        }
        var fileName = String(activeDocument.fullName);
        fileName = fileName.substring(fileName.lastIndexOf("/") + 1, fileName.length);
        if (fileName.match(/[^0-9A-Za-z_.:-]+/) != null) {
            _errorMsgSave += "■PSDドキュメントを半角英数で保存する必要があります。\n\n";
        }
    }

    // 重複チェック
    function _checkDuplicate(e) {
        var item = e.item;
        var name = e.name;
        // レイヤー
        var length = item.artLayers.length;
        for (var i = 0; i < length; i++) {
            var artLayer = item.artLayers[ i ];
            var layerName = getLayerNameUtil({name:artLayer.name});
            if (_layerName == layerName) {
                _errorMsgDuplicate += "	レイヤー :  " + name + "/" + artLayer.name + "\n\n";
            }
            _layerName += layerName + "@";
        }
        // レイヤーセット
        var length = item.layerSets.length;
        for (var i = 0; i < length; i++) {
            var layerSet = item.layerSets[ i ];
            var layerName = getLayerNameUtil({name:layerSet.name});
            if (_layerName == layerName) {
                _errorMsgDuplicate += "	レイヤーセット : " + name + "/" + layerSet.name + "\n\n";
            }
            _layerName += layerName + "@";
            // 再帰
            _checkDuplicate({
                item:layerSet,
                name:name + "/" + layerSet.name
            });
        }
    }

    // IDチェック
    function _checkName(e) {
        var item = e.item;
        var name = e.name;
        // レイヤー
        var length = item.artLayers.length;
        for (var i = 0; i < length; i++) {
            var artLayer = item.artLayers[ i ];
            var layerName = getLayerNameUtil({name:artLayer.name});
            if (layerName.match(/[^0-9A-Za-z_.:-]+/) != null) {
                _errorMsgName += "	レイヤー :  " + name + "/" + artLayer.name + "\n\n";
            }
        }
        // レイヤーセット
        var length = item.layerSets.length;
        for (var i = 0; i < length; i++) {
            var layerSet = item.layerSets[ i ];
            var layerName = getLayerNameUtil({name:layerSet.name});
            if (layerName.match(/[^0-9A-Za-z_.:-]+/) != null) {
                _errorMsgName += "	レイヤーセット : " + name + "/" + layerSet.name + "\n\n";
            }
            // 再帰
            _checkName({
                item:layerSet,
                name:name + "/" + layerSet.name
            });
        }
    }

    // 表示要素チェック
    function _checkExist(e) {
        var item = e.item;
        var name = e.name;
        var documentHeight = activeDocument.height.value;
        var documentWidth = activeDocument.width.value;
        // レイヤー
        var length = item.artLayers.length;
        for (var i = 0; i < length; i++) {
            var artLayer = item.artLayers[ i ];
            var x1 = parseInt(artLayer.bounds[0]);
            var y1 = parseInt(artLayer.bounds[1]);
            var x2 = parseInt(artLayer.bounds[2]);
            var y2 = parseInt(artLayer.bounds[3]);
            if (( x2 - x1 ) <= 0 || ( y2 - y1 ) <= 0 || x2 <= 0 || y2 <= 0 || documentWidth <= x1 || documentHeight <= y1) {
                _errorMsgExist += "	レイヤー :  " + name + "/" + artLayer.name + "\n\n";
            }
        }
        // レイヤーセット
        var length = item.layerSets.length;
        for (var i = 0; i < length; i++) {
            var layerSet = item.layerSets[ i ];
            // 表示要素チェック
            if (layerSet.artLayers.length <= 0 && layerSet.layerSets.length <= 0) {
                _errorMsgExist += "	レイヤーセット : " + name + "/" + layerSet.name + "\n\n";
            }
            // 再帰
            _checkExist({
                item:layerSet,
                name:name + "/" + layerSet.name
            });
        }
    }

};

//
// ----- 画像出力
//
var ImageExporter = function () {

    // 初期化
    this.init = function () {
    };

    // 出力
    this.export = function (e) {
        // 画像フォルダ作成
        createDirectoryUtil({path:dialogManager.getImageFolderPath()});
        _hideLayers({
            item:activeDocument
        });
        _export({
            item:activeDocument
        });
        _showLayers({
            item:activeDocument
        });
    };

    // レイヤー非表示
    function _hideLayers(e) {
        var item = e.item;
        // レイヤー
        var length = item.artLayers.length;
        for (var i = 0; i < length; i++) {
            var artLayer = item.artLayers[ i ];
            artLayer.visible = false;
        }
        // レイヤーセット
        var length = item.layerSets.length;
        for (var i = 0; i < length; i++) {
            var layerSet = item.layerSets[ i ];
            // 再帰
            _hideLayers({
                item:layerSet
            });
        }
    }

    // レイヤー表示
    function _showLayers(e) {
        var item = e.item;
        // レイヤー
        var length = item.artLayers.length;
        for (var i = 0; i < length; i++) {
            var artLayer = item.artLayers[ i ];
            artLayer.visible = true;
        }
        // レイヤーセット
        var length = item.layerSets.length;
        for (var i = 0; i < length; i++) {
            var layerSet = item.layerSets[ i ];
            // 再帰
            _showLayers({
                item:layerSet
            });
        }
    }

    // 出力
    function _export(e) {
        var item = e.item;
        // レイヤー
        var length = item.artLayers.length;
        for (var i = 0; i < length; i++) {
            var artLayer = item.artLayers[ i ];
            if (artLayer.kind == LayerKind.NORMAL) {
                // 表示
                artLayer.visible = true;
                // マスクが存在するか
                var hasMask = false;
                if (hasChannelMaskByName(artLayer.name) || hasVectorMaskByName(artLayer.name)) {
                    hasMask = true;
                }
                if (hasMask) {
                    // レイヤーをアクティブにする
                    activeDocument.activeLayer = artLayer;
                    // マスクを選択
                    var idslct = charIDToTypeID( "slct" );
                    var desc78 = new ActionDescriptor();
                    var idnull = charIDToTypeID( "null" );
                    var ref49 = new ActionReference();
                    var idChnl = charIDToTypeID( "Chnl" );
                    var idChnl = charIDToTypeID( "Chnl" );
                    var idMsk = charIDToTypeID( "Msk " );
                    ref49.putEnumerated( idChnl, idChnl, idMsk );
                    desc78.putReference( idnull, ref49 );
                    var idMkVs = charIDToTypeID( "MkVs" );
                    desc78.putBoolean( idMkVs, false );
                    executeAction( idslct, desc78, DialogModes.NO );
                    // マスクの範囲を選択
                    var idsetd = charIDToTypeID( "setd" );
                    var desc79 = new ActionDescriptor();
                    var idnull = charIDToTypeID( "null" );
                    var ref50 = new ActionReference();
                    var idChnl = charIDToTypeID( "Chnl" );
                    var idfsel = charIDToTypeID( "fsel" );
                    ref50.putProperty( idChnl, idfsel );
                    desc79.putReference( idnull, ref50 );
                    var idT = charIDToTypeID( "T   " );
                    var ref51 = new ActionReference();
                    var idChnl = charIDToTypeID( "Chnl" );
                    var idOrdn = charIDToTypeID( "Ordn" );
                    var idTrgt = charIDToTypeID( "Trgt" );
                    ref51.putEnumerated( idChnl, idOrdn, idTrgt );
                    desc79.putReference( idT, ref51 );
                    executeAction( idsetd, desc79, DialogModes.NO );
                    // 選択範囲を抽出
                    var arr = activeDocument.selection.bounds;
                    var x1 = arr[0];
                    var y1 = arr[1];
                    var x2 = arr[2];
                    var y2 = arr[3];
                    // 新規保存
                    var imageFilePath = getPathInfoImagesUtil().folderPathFull + "/" + "_" + getLayerNameUtil({name:artLayer.name}) + ".png";
                    var fileObj = new File(imageFilePath);
                    var optionObj = new PNGSaveOptions();
                    optionObj.interlaced = false;
                    activeDocument.saveAs(fileObj, optionObj, true, Extension.LOWERCASE);
                    // 開く
                    open(new File(imageFilePath));
                    // 座標を指定して選択する
                    selReg = [[x1, y1], [x1, y2], [x2, y2], [x2, y1]];
                    activeDocument.selection.select(selReg);
                    // 切り抜き
                    var idCrop = charIDToTypeID( "Crop" );
                    var desc12 = new ActionDescriptor();
                    var idDlt = charIDToTypeID( "Dlt " );
                    desc12.putBoolean( idDlt, true );
                    executeAction( idCrop, desc12, DialogModes.NO );
                } else {
                    // 新規保存
                    var imageFilePath = getPathInfoImagesUtil().folderPathFull + "/" + "_" + getLayerNameUtil({name:artLayer.name}) + ".png";
                    var fileObj = new File(imageFilePath);
                    var optionObj = new PNGSaveOptions();
                    optionObj.interlaced = false;
                    activeDocument.saveAs(fileObj, optionObj, true, Extension.LOWERCASE);
                    // 開いてトリミング
                    open(new File(imageFilePath));
                    activeDocument.trim(TrimType.TRANSPARENT, true, true, true, true);
                    preferences.rulerUnits = Units.PIXELS;
                    activeDocument.resizeCanvas(Math.floor(activeDocument.width.value), Math.floor(activeDocument.height.value), AnchorPosition.MIDDLECENTER);
                    activeDocument.resizeCanvas(activeDocument.width.value, activeDocument.height.value, AnchorPosition.TOPLEFT);
                }
                // Web用保存して閉じる
                var optionObj = new ExportOptionsSaveForWeb();
                var color = getLayerColorUtil({name:artLayer.name});
                if (!color) {
                    color = dialogManager.getOtherBgColor();
                }
                // マットカラー
                optionObj.matteColor = new RGBColor();
                optionObj.matteColor.hexValue = color;
                switch (getFileInfoFromFileNameUtil({name:artLayer.name}).type) {
                    // PNG保存
                    case FILE_KEY_PNG:
                        optionObj.format = SaveDocumentType.PNG;
                        optionObj.PNG8 = false;
                        optionObj.transparency = true;
                        optionObj.interlaced = false;
                        optionObj.optimized = true;
                        break;
                    // JPEG保存
                    case FILE_KEY_JPG:
                        optionObj.format = SaveDocumentType.JPEG;
                        optionObj.interlaced = false;
                        optionObj.optimized = true;
                        optionObj.quality = dialogManager.getJpegCompressRate();
                        break;
                    // GIF保存
                    case FILE_KEY_GIF:
                        optionObj.format = SaveDocumentType.COMPUSERVEGIF;
                        optionObj.transparency = true;
                        optionObj.colorReduction = ColorReductionType.ADAPTIVE;
                        optionObj.colors = 256;
                        optionObj.dither = Dither.DIFFUSION; // ディザーの種類
                        optionObj.ditherAmount = 100; // ディザーの割合
                        break;
                }
                var imageFilePath = getPathInfoImagesUtil().folderPathFull + "/" + getLayerNameUtil({name:artLayer.name}) + getFileInfoFromFileNameUtil({name:artLayer.name}).ext;
                var fileObj = new File(imageFilePath);
                activeDocument.exportDocument(fileObj, ExportType.SAVEFORWEB, optionObj);
                activeDocument.close(SaveOptions.DONOTSAVECHANGES);
                // 不要ファイルを削除
                var imageFilePath = getPathInfoImagesUtil().folderPathFull + "/" + "_" + getLayerNameUtil({name:artLayer.name}) + ".png";
                var fileObj = new File(imageFilePath);
                fileObj.remove();
                // 非表示
                artLayer.visible = false;
            }
        }
        // レイヤーセット
        var length = item.layerSets.length;
        for (var i = 0; i < length; i++) {
            var layerSet = item.layerSets[ i ];
            // 再帰
            _export({
                item:layerSet
            });
        }
    }

};

//
// ==================== Action ==================== //
//

// 定数
var OPTION_KEY_BGIMAGE = "*"; // オプションキー（背景レイヤー）
var OPTION_KEY_ALT = "@"; // オプションキー（ALTタグ）
var OPTION_KEY_COLOR = "#"; // オプションキー（背景色）
var TYPE_KEY_BG = "bg"; // タイプキー（背景レイヤー）
var TYPE_KEY_NORMAL = "normal"; // タイプキー（通常レイヤー）
var FILE_KEY_PNG = "png"; // ファイルキー（PNG）
var FILE_KEY_JPG = "jpg"; // ファイルキー（JPEG）
var FILE_KEY_GIF = "gif"; // ファイルキー（GIF）

// インスタンス
var dialogManager = new DialogManager();
var errorChecker = new ErrorChecker();
var imageExporter = new ImageExporter();

// プロパティ
var exportRoot; // 出力先ルートディレクトリ

// 初期化
initEvent();
// ダイアログ開く
openDialogEvent();

//
// ==================== Event ==================== //
//

//
// ----- 初期化
//
function initEvent(e) {
    // プロパティ初期化
    exportRoot = activeDocument.path + "/" + String(activeDocument.name).substring(0, String(activeDocument.name).length - 4);
    // インスタンス初期化
    dialogManager.init();
    errorChecker.init();
    imageExporter.init();
}

//
// ----- ダイアログ開く
//
function openDialogEvent(e) {
    // ダイアログ開く
    dialogManager.open();
}

//
// ----- エラーチェック
//
function checkErrorEvent(e) {
    // エラーチェック
    errorChecker.check();
}

//
// ----- 書き出し開始
//
function startExportEvent(e) {
    // ルートフォルダ作成
    var folderObj = new Folder(exportRoot);
    folderObj.create();
    if (dialogManager.getIsExportImages()) {
        // 画像出力
        imageExporter.export();
    }

    // 書き出し終了イベント
    completeExportEvent();
}

//
// ----- 書き出し終了
//
function completeExportEvent(e) {
    alert("終了しました。");
}

//
// ==================== Util ==================== //
//

//
// ----- 画像パス情報取得
//
function getPathInfoImagesUtil(e) {
    var folderPathFull = "";
    if (dialogManager.getImageFolderPath() == "") {
        folderPathFull = exportRoot;
    } else {
        folderPathFull = exportRoot + "/" + dialogManager.getImageFolderPath();
    }
    return {
        folderPathFull:folderPathFull
    };
}

//
// ----- レイヤー名取得
//
function getLayerNameUtil(e) {
    var str = (e) ? e.name : "";
    if (String(str).charAt(0) == OPTION_KEY_BGIMAGE) {
        str = String(str).slice(1);
    }
    var index = String(str).indexOf(OPTION_KEY_ALT);
    if (1 <= index) {
        str = String(str).substr(0, index);
    }
    index = String(str).indexOf(OPTION_KEY_COLOR);
    if (1 <= index) {
        str = String(str).substr(0, index);
    }
    str = str.replace(".png", "");
    str = str.replace(".jpg", "");
    str = str.replace(".gif", "");
    return str;
}

//
// ----- 背景色取得
//
function getLayerColorUtil(e) {
    var str = (e) ? e.name : "";
    var index = String(str).indexOf(OPTION_KEY_COLOR);
    if (1 <= index) {
        str = String(str).substr(index + 1, String(str).length - 1);
        index = String(str).indexOf(OPTION_KEY_ALT);
        if (1 <= index) {
            str = String(str).substr(0, index);
        }
        return getHexColorTextUtil(str);
    } else {
        return null;
    }
}

//
// ----- ファイルタイプから拡張子取得
//
function getExtFromFileTypeUtil(e) {
    var str = (e || e.file) ? e.file : dialogManager.getDefaultFileType();
    switch (str) {
        case FILE_KEY_PNG:
            return ".png";
            break;
        case FILE_KEY_JPG:
            return ".jpg";
            break;
        case FILE_KEY_GIF:
            return ".gif";
            break;
    }
}

//
// ----- ファイル名から拡張子取得
//
function getFileInfoFromFileNameUtil(e) {
    var str = String(e.name);
    if (0 < str.lastIndexOf(".png")) {
        return {
            type:FILE_KEY_PNG,
            ext:".png"
        };
    } else if (0 < str.lastIndexOf(".jpg")) {
        return {
            type:FILE_KEY_JPG,
            ext:".jpg"
        };
    } else if (0 < str.lastIndexOf(".gif")) {
        return {
            type:FILE_KEY_GIF,
            ext:".gif"
        };
    } else {
        return {
            type:dialogManager.getDefaultFileType(),
            ext:getExtFromFileTypeUtil({file:dialogManager.getDefaultFileType()})
        };
    }
}

//
// ----- ディレクトリ作成
//
function createDirectoryUtil(e) {
    // 画像フォルダ作成
    var path = e.path;
    var depth = 0;
    var directory = exportRoot;
    var arr = null;
    if (path != "") {
        arr = String(path).split("/");
        depth = arr.length;
    }
    if (0 < depth) {
        for (var i = 0; i < depth; i++) {
            directory += "/" + arr[i];
            var folderObj = new Folder(directory);
            folderObj.create();
        }
    }
    return folderObj;
}

//
// ----- レイヤーにチャンネルマスクが存在するかどうか
//
function hasChannelMaskByName(name){
    var ref = new ActionReference();
    ref.putName(charIDToTypeID("Lyr "), name);
    return executeActionGet(ref).getBoolean(stringIDToTypeID("hasUserMask"));
}

//
// ----- レイヤーにベクターマスクが存在するかどうか
//
function hasVectorMaskByName(name){
    var ref = new ActionReference();
    ref.putName(charIDToTypeID("Lyr "), name);
    return executeActionGet(ref).getBoolean(stringIDToTypeID("hasVectorMask"));
}

//
// ----- HexColorを取り出す
//
function getHexColorTextUtil(value) {
    var str = String(value).replace("#", "");
    str = String(/[0-9A-Fa-f]{6}/g.exec(str));
    if (!str) {
        str = "ffffff";
    }
    return str;
}