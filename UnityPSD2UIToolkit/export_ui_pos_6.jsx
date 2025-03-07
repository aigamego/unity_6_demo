//
// ==================== 类 ==================== //
//

//
// ----- 对话框
//
var DialogManager = function () {

    var _window;
    var _imageCheckboxExport; // 导出图片复选框
    var _imageEdittextDirectory; // 图片目录编辑框
    var _imageRadiobuttonPng; // PNG单选按钮
    var _imageRadiobuttonJpg; // JPEG单选按钮
    var _imageRadiobuttonGif; // GIF单选按钮
    var _imageDropdownlistJpgCompress; // JPEG压缩率下拉列表
    var _okBtn; // 确定按钮
    var _cancelBtn; // 取消按钮
    var _isExportImages = true; // 是否导出图片
    var _imageFolderPath = null; // 图片文件夹路径
    var _jpegCompressRate = null; // JPEG压缩率
    var _defaultFileType = null; // 默认文件类型
    var _otherEdittextColor; // 其他颜色编辑框

    // 初始化
    this.init = function () {
        var totalY = 0;
        // 创建窗口
        _window = new Window("dialog", "图片 and JSON", _getPosition({x:200, y:200, w:390, h:400}));
        // 图片文件设置
        totalY = 20;
        _imageCheckboxExport = _window.add("checkbox", _getPosition({x:20, y:totalY, w:320, h:40}), "导出图片文件");
        _imageCheckboxExport.value = true;
        imagePanel = _window.add("panel", _getPosition({x:20, y:totalY + 40, w:350, h:130}), "图片文件设置");
        imagePanel.add("statictext", _getPosition({x:20, y:20, w:100, h:20}), "目录 :").justify = "right";
        _imageEdittextDirectory = imagePanel.add("edittext", _getPosition({x:130, y:20, w:200, h:20}), "images");
        imagePanel.add("statictext", _getPosition({x:20, y:50, w:100, h:20}), "文件格式 :").justify = "right";
        _imageRadiobuttonPng = imagePanel.add("radiobutton", _getPosition({x:130, y:50, w:50, h:20}), "PNG");
        _imageRadiobuttonPng.value = true;
        _imageRadiobuttonJpg = imagePanel.add("radiobutton", _getPosition({x:190, y:50, w:50, h:20}), "JPEG");
        _imageRadiobuttonJpg.value = false;
        _imageRadiobuttonGif = imagePanel.add("radiobutton", _getPosition({x:250, y:50, w:50, h:20}), "GIF");
        _imageRadiobuttonGif.value = false;
        imagePanel.add("statictext", _getPosition({x:20, y:80, w:100, h:20}), "JPEG画质 :").justify = "right";
        _imageDropdownlistJpgCompress = imagePanel.add("dropdownlist", _getPosition({x:130, y:80, w:200, h:20}), ["100 （最高画质）", "90", "80 （高画质）", "70", "60 （やや高画质）", "50", "40", "30 （中画质）", "20", "10 （低画质）"]);
        _imageDropdownlistJpgCompress.selection = 2; // 默认选择 "80 （高画质）"

        // 其他选项
        totalY = 200;
        _window.add("statictext", _getPosition({x:20, y:totalY, w:90, h:20}), "背景色 :").justify = "right";
        _otherEdittextColor = _window.add("edittext", _getPosition({x:120, y:totalY, w:200, h:20}), "#ffffff");

        // 确定按钮
        totalY = 300;
        _okBtn = _window.add("button", _getPosition({x:90, y:totalY, w:100, h:30}), "OK", { name:"ok" });
        _okBtn.onClick = function () {
            _close({flg:true});
        };
        // 取消按钮
        _cancelBtn = _window.add("button", _getPosition({x:200, y:totalY, w:100, h:30}), "Cancel", { name:"cancel" });
        _cancelBtn.onClick = function () {
            _close({flg:false});
        };
       
    };

    // 打开
    this.open = function () {
        _window.show();
    };

    // 是否导出图片
    this.getIsExportImages = function () {
        return _isExportImages;
    };

    // 图片文件夹路径
    this.getImageFolderPath = function () {
        return _imageFolderPath;
    };

    // JPEG压缩率
    this.getJpegCompressRate = function () {
        return _jpegCompressRate;
    };

    // 默认图片格式
    this.getDefaultFileType = function () {
        return _defaultFileType;
    };

    // 背景颜色
    this.getOtherBgColor = function () {
        return _otherBgColor;
    };

    // 关闭
    function _close(e) {
        if (e.flg) { // 如果点击了确定按钮
            var str = "";
            var selection = "";
            // 是否导出图片
            _isExportImages = _imageCheckboxExport.value;
            // 图片文件夹路径
            _imageFolderPath = _setDirectoryText({str:_imageEdittextDirectory.text});
            // 背景颜色
            _otherBgColor = getHexColorTextUtil(_otherEdittextColor.text);

            // JPEG压缩率
            _jpegCompressRate = 80;
            selection = String(_imageDropdownlistJpgCompress.selection);
            switch (selection) {
                case "100 （最高画质）":
                    _jpegCompressRate = 100;
                    break;
                case "90":
                    _jpegCompressRate = 90;
                    break;
                case "80 （高画质）":
                    _jpegCompressRate = 80;
                    break;
                case "70":
                    _jpegCompressRate = 70;
                    break;
                case "60 （高画质）":
                    _jpegCompressRate = 60;
                    break;
                case "50":
                    _jpegCompressRate = 50;
                    break;
                case "40":
                    _jpegCompressRate = 40;
                    break;
                case "30 （中画质）":
                    _jpegCompressRate = 30;
                    break;
                case "20":
                    _jpegCompressRate = 20;
                    break;
                case "10 （低画质）":
                    _jpegCompressRate = 10;
                    break;
            }

            // 默认图片格式
            _defaultFileType = FILE_KEY_PNG;
            if (_imageRadiobuttonPng.value) {
                _defaultFileType = FILE_KEY_PNG;
            } else if (_imageRadiobuttonJpg.value) {
                _defaultFileType = FILE_KEY_JPG;
            } else if (_imageRadiobuttonGif.value) {
                _defaultFileType = FILE_KEY_GIF;
            }

            _window.close();
            // 错误检查事件
            checkErrorEvent();
        } else { // 如果点击了取消按钮
            _window.close();
            alert("取消了");
        }
    }

    // 获取项目位置信息
    function _getPosition(e) {
        return [ e.x, e.y, e.w + e.x, e.h + e.y ];
    }

    // 创建目录文本
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
// ----- 错误管理
//
var ErrorChecker = function () {

    var _errorMsgSave; // 保存错误信息
    var _errorMsgDuplicate; // 重复错误信息
    var _errorMsgName; // 名称错误信息
    var _errorMsgExist; // 存在错误信息

    var _layerName; // 图层名称

    // 初始化
    this.init = function () {
        _errorMsgSave = "";
        _errorMsgDuplicate = "";
        _errorMsgName = "";
        _errorMsgExist = "";
        _layerName = "";
    };

    // 检查
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
            msg = "存在以下错误。\n\n";
            if (_errorMsgSave != "") msg += _errorMsgSave;
            if (_errorMsgDuplicate != "") msg += "■图层和图层集的名称中ID有重复的。\n\n" + _errorMsgDuplicate;
            if (_errorMsgName != "") msg += "■图层和图层集的名称中ID有不能使用的字符串。\n\n" + _errorMsgName;
            if (_errorMsgExist != "") msg += "■存在显示范围内没有要素的图层和图层集。\n\n" + _errorMsgExist;
        }
        if (msg != "") {
            alert(msg);
        } else {
            // 开始导出事件
            startExportEvent();
        }
    };

    // 保存检查
    function _checkSave() {
        if (!activeDocument || !activeDocument.path) {
            _errorMsgSave += "■要执行此操作，需要保存 PSD 文档。\n\n";
        }
        var fileName = String(activeDocument.fullName);
        fileName = fileName.substring(fileName.lastIndexOf("/") + 1, fileName.length);
        if (fileName.match(/[^0-9A-Za-z_.:-]+/) != null) {
            _errorMsgSave += "■PSD文档需要以半角英数保存。\n\n";
        }
    }

    // 重复检查
    function _checkDuplicate(e) {
        var item = e.item;
        var name = e.name;
        // 图层
        var length = item.artLayers.length;
        for (var i = 0; i < length; i++) {
            var artLayer = item.artLayers[ i ];
            var layerName = getLayerNameUtil({name:artLayer.name});
            if (_layerName == layerName) {
                _errorMsgDuplicate += "	图层 :  " + name + "/" + artLayer.name + "\n\n";
            }
            _layerName += layerName + "@";
        }
        // 图层集
        var length = item.layerSets.length;
        for (var i = 0; i < length; i++) {
            var layerSet = item.layerSets[ i ];
            var layerName = getLayerNameUtil({name:layerSet.name});
            if (_layerName == layerName) {
                _errorMsgDuplicate += "	图层集 : " + name + "/" + layerSet.name + "\n\n";
            }
            _layerName += layerName + "@";
            // 递归
            _checkDuplicate({
                item:layerSet,
                name:name + "/" + layerSet.name
            });
        }
    }

    // ID检查
    function _checkName(e) {
        var item = e.item;
        var name = e.name;
        // 图层
        var length = item.artLayers.length;
        for (var i = 0; i < length; i++) {
            var artLayer = item.artLayers[ i ];
            var layerName = getLayerNameUtil({name:artLayer.name});
            if (layerName.match(/[^0-9A-Za-z_.:-]+/) != null) {
                _errorMsgName += "	图层 :  " + name + "/" + artLayer.name + "\n\n";
            }
        }
        // 图层集
        var length = item.layerSets.length;
        for (var i = 0; i < length; i++) {
            var layerSet = item.layerSets[ i ];
            var layerName = getLayerNameUtil({name:layerSet.name});
            if (layerName.match(/[^0-9A-Za-z_.:-]+/) != null) {
                _errorMsgName += "	图层集 : " + name + "/" + layerSet.name + "\n\n";
            }
            // 递归
            _checkName({
                item:layerSet,
                name:name + "/" + layerSet.name
            });
        }
    }

    // 显示要素检查
    function _checkExist(e) {
        var item = e.item;
        var name = e.name;
        var documentHeight = activeDocument.height.value;
        var documentWidth = activeDocument.width.value;
        // 图层
        var length = item.artLayers.length;
        for (var i = 0; i < length; i++) {
            var artLayer = item.artLayers[ i ];
            var x1 = parseInt(artLayer.bounds[0]);
            var y1 = parseInt(artLayer.bounds[1]);
            var x2 = parseInt(artLayer.bounds[2]);
            var y2 = parseInt(artLayer.bounds[3]);
            if (( x2 - x1 ) <= 0 || ( y2 - y1 ) <= 0 || x2 <= 0 || y2 <= 0 || documentWidth <= x1 || documentHeight <= y1) {
                _errorMsgExist += "	图层 :  " + name + "/" + artLayer.name + "\n\n";
            }
        }
        // 图层集
        var length = item.layerSets.length;
        for (var i = 0; i < length; i++) {
            var layerSet = item.layerSets[ i ];
            // 显示要素检查
            if (layerSet.artLayers.length <= 0 && layerSet.layerSets.length <= 0) {
                _errorMsgExist += "	图层集 : " + name + "/" + layerSet.name + "\n\n";
            }
            // 递归
            _checkExist({
                item:layerSet,
                name:name + "/" + layerSet.name
            });
        }
    }

};

//
// ----- 图片导出
//
var ImageExporter = function () {

    // 初始化
    this.init = function () {
    };

    // 导出
    this.export = function (e) {
        // 创建图片文件夹
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

    // 隐藏图层
    function _hideLayers(e) {
        var item = e.item;
        // 图层
        var length = item.artLayers.length;
        for (var i = 0; i < length; i++) {
            var artLayer = item.artLayers[ i ];
            artLayer.visible = false;
        }
        // 图层集
        var length = item.layerSets.length;
        for (var i = 0; i < length; i++) {
            var layerSet = item.layerSets[ i ];
            // 递归
            _hideLayers({
                item:layerSet
            });
        }
    }

    // 显示图层
    function _showLayers(e) {
        var item = e.item;
        // 图层
        var length = item.artLayers.length;
        for (var i = 0; i < length; i++) {
            var artLayer = item.artLayers[ i ];
            artLayer.visible = true;
        }
        // 图层集
        var length = item.layerSets.length;
        for (var i = 0; i < length; i++) {
            var layerSet = item.layerSets[ i ];
            // 递归
            _showLayers({
                item:layerSet
            });
        }
    }

    // 导出
    function _export(e) {
        var item = e.item;
        // 图层
        var length = item.artLayers.length;
        for (var i = 0; i < length; i++) {
            var artLayer = item.artLayers[ i ];
            if (artLayer.kind == LayerKind.NORMAL) { // 如果是普通图层
                // 显示
                artLayer.visible = true;
                // 是否存在蒙版
                var hasMask = false;
                if (hasChannelMaskByName(artLayer.name) || hasVectorMaskByName(artLayer.name)) {
                    hasMask = true;
                }
                if (hasMask) {
                    // 激活图层
                    activeDocument.activeLayer = artLayer;
                    // 选择蒙版
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
                    // 选择蒙版范围
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
                    // 提取选择范围
                    var arr = activeDocument.selection.bounds;
                    var x1 = arr[0];
                    var y1 = arr[1];
                    var x2 = arr[2];
                    var y2 = arr[3];
                    // 新建保存
                    var imageFilePath = getPathInfoImagesUtil().folderPathFull + "/" + "_" + getLayerNameUtil({name:artLayer.name}) + ".png";
                    var fileObj = new File(imageFilePath);
                    var optionObj = new PNGSaveOptions();
                    optionObj.interlaced = false;
                    activeDocument.saveAs(fileObj, optionObj, true, Extension.LOWERCASE);
                    // 打开
                    open(new File(imageFilePath));
                    // 指定坐标选择
                    selReg = [[x1, y1], [x1, y2], [x2, y2], [x2, y1]];
                    activeDocument.selection.select(selReg);
                    // 裁剪
                    var idCrop = charIDToTypeID( "Crop" );
                    var desc12 = new ActionDescriptor();
                    var idDlt = charIDToTypeID( "Dlt " );
                    desc12.putBoolean( idDlt, true );
                    executeAction( idCrop, desc12, DialogModes.NO );
                } else {
                    // 新建保存
                    var imageFilePath = getPathInfoImagesUtil().folderPathFull + "/" + "_" + getLayerNameUtil({name:artLayer.name}) + ".png";
                    var fileObj = new File(imageFilePath);
                    var optionObj = new PNGSaveOptions();
                    optionObj.interlaced = false;
                    activeDocument.saveAs(fileObj, optionObj, true, Extension.LOWERCASE);
                    // 打开并裁剪
                    open(new File(imageFilePath));
                    activeDocument.trim(TrimType.TRANSPARENT, true, true, true, true);
                    preferences.rulerUnits = Units.PIXELS;
                    activeDocument.resizeCanvas(Math.floor(activeDocument.width.value), Math.floor(activeDocument.height.value), AnchorPosition.MIDDLECENTER);
                    activeDocument.resizeCanvas(activeDocument.width.value, activeDocument.height.value, AnchorPosition.TOPLEFT);
                }
                // 保存为Web格式并关闭
                var optionObj = new ExportOptionsSaveForWeb();
                var color = getLayerColorUtil({name:artLayer.name});
                if (!color) {
                    color = dialogManager.getOtherBgColor();
                }
                // 蒙版颜色
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
                        optionObj.dither = Dither.DIFFUSION; // 抖动类型
                        optionObj.ditherAmount = 100; // 抖动量
                        break;
                }
                var imageFilePath = getPathInfoImagesUtil().folderPathFull + "/" + getLayerNameUtil({name:artLayer.name}) + getFileInfoFromFileNameUtil({name:artLayer.name}).ext;
                var fileObj = new File(imageFilePath);
                activeDocument.exportDocument(fileObj, ExportType.SAVEFORWEB, optionObj);
                activeDocument.close(SaveOptions.DONOTSAVECHANGES);
                // 删除不需要的文件
                var imageFilePath = getPathInfoImagesUtil().folderPathFull + "/" + "_" + getLayerNameUtil({name:artLayer.name}) + ".png";
                var fileObj = new File(imageFilePath);
                fileObj.remove();
                // 隐藏
                artLayer.visible = false;
            }
        }
        // 图层集
        var length = item.layerSets.length;
        for (var i = 0; i < length; i++) {
            var layerSet = item.layerSets[ i ];
            // 递归
            _export({
                item:layerSet
            });
        }
    }

};

//
// ==================== 操作 ==================== //
//

// 常量
var OPTION_KEY_BGIMAGE = "*"; // 选项键（背景图层）
var OPTION_KEY_ALT = "@"; // 选项键（ALT标签）
var OPTION_KEY_COLOR = "#"; // 选项键（背景色）
var TYPE_KEY_BG = "bg"; // 类型键（背景图层）
var TYPE_KEY_NORMAL = "normal"; // 类型键（普通图层）
var FILE_KEY_PNG = "png"; // 文件键（PNG）
var FILE_KEY_JPG = "jpg"; // 文件键（JPEG）

// 实例
var dialogManager = new DialogManager();
var errorChecker = new ErrorChecker();
var imageExporter = new ImageExporter();

// 属性
var exportRoot; // 输出根目录

// 初始化
initEvent();
// 打开对话框
openDialogEvent();

//
// 事件

//
// ----- 初始化
//
function initEvent(e) {
    // 初始化属性
    exportRoot = activeDocument.path + "/" + String(activeDocument.name).substring(0, String(activeDocument.name).length - 4);
    // 初始化实例
    dialogManager.init();
    errorChecker.init();
    imageExporter.init();
}

//
// ----- 打开对话框
//
function openDialogEvent(e) {
    // 打开对话框
    dialogManager.open();
}

//
// ----- 错误检查
//
function checkErrorEvent(e) {
    // 错误检查
    errorChecker.check();
}

//
// ----- 开始导出
//
function startExportEvent(e) {
    // 创建根文件夹
    var folderObj = new Folder(exportRoot);
    folderObj.create();
    if (dialogManager.getIsExportImages()) {
        // 图片导出
        imageExporter.export();
    }

    // 完成导出事件
    completeExportEvent();
}

//
// ----- 完成导出
//
function completeExportEvent(e) {
    alert("完成了。");
}

//
// ==================== 工具 ==================== //
//

//
// ----- 获取图片路径信息
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
// ----- 获取图层名称
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
    return str;
}

//
// ----- 获取背景色
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
// ----- 从文件类型获取扩展名
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
    }
}

//
// ----- 从文件名获取扩展名
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
    } else {
        return {
            type:dialogManager.getDefaultFileType(),
            ext:getExtFromFileTypeUtil({file:dialogManager.getDefaultFileType()})
        };
    }
}

//
// ----- 创建目录
//
function createDirectoryUtil(e) {
    // 创建图片文件夹
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
// ----- 图层是否存在通道蒙版
//
function hasChannelMaskByName(name){
    var ref = new ActionReference();
    ref.putName(charIDToTypeID("Lyr "), name);
    return executeActionGet(ref).getBoolean(stringIDToTypeID("hasUserMask"));
}

//
// ----- 图层是否存在矢量蒙版
//
function hasVectorMaskByName(name){
    var ref = new ActionReference();
    ref.putName(charIDToTypeID("Lyr "), name);
    return executeActionGet(ref).getBoolean(stringIDToTypeID("hasVectorMask"));
}

//
// ----- 取出HexColor
//
function getHexColorTextUtil(value) {
    var str = String(value).replace("#", "");
    str = String(/[0-9A-Fa-f]{6}/g.exec(str));
    if (!str) {
        str = "ffffff";
    }
    return str;
}