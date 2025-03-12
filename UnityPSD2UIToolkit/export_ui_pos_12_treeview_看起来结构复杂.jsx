#target photoshop

// =====================================================
// 对话框：选择是否导出图片以及图片存放文件夹
// Dialog: Choose whether to export images and specify folder name
// =====================================================
function showDialog() {
    var dlg = new Window("dialog", "导出图片和图层信息 JSON / Export Images & Layer JSON");
    dlg.orientation = "column";
    dlg.alignChildren = ["fill", "top"];

    // 导出图片选项 / Export images option
    dlg.exportImagesCheckbox = dlg.add("checkbox", undefined, "导出图片 (Export Images)");
    dlg.exportImagesCheckbox.value = true;

    // 图片目录设置 / Specify image folder name
    var folderGroup = dlg.add("group");
    folderGroup.add("statictext", undefined, "图片目录 (Folder):");
    dlg.folderEdit = folderGroup.add("edittext", undefined, "images");
    dlg.folderEdit.characters = 20;

    // 确定和取消按钮 / OK and Cancel buttons
    var btnGroup = dlg.add("group");
    btnGroup.alignment = "center";
    dlg.okButton = btnGroup.add("button", undefined, "OK", {name:"ok"});
    dlg.cancelButton = btnGroup.add("button", undefined, "Cancel", {name:"cancel"});

    dlg.okButton.onClick = function() { dlg.close(1); };
    dlg.cancelButton.onClick = function() { dlg.close(0); };

    var ret = dlg.show();
    if(ret === 1) {
        return {
            exportImages: dlg.exportImagesCheckbox.value,
            folder: dlg.folderEdit.text
        };
    } else {
        throw new Error("用户取消导出 / Export canceled by user.");
    }
}

// =====================================================
// 创建文件夹（如果不存在则创建）
// Create folder if it does not exist
// =====================================================
function createFolder(folderPath) {
    var folder = new Folder(folderPath);
    if (!folder.exists) {
        folder.create();
    }
    return folder;
}

// =====================================================
// 图片导出：复制文档、隐藏其他图层、裁剪后导出为 PNG
// Image export: Duplicate document, hide other layers, trim, and export as PNG
// =====================================================
function exportLayerAsPNG(layer, folder) {
    // 复制当前文档（不影响原始文档）/ Duplicate current document (without affecting the original)
    var dupDoc = app.activeDocument.duplicate();

    // 隐藏所有图层 / Hide all layers
    function hideAll(docLayers) {
        for (var i = 0; i < docLayers.length; i++) {
            var lyr = docLayers[i];
            if (lyr.typename === "ArtLayer") {
                lyr.visible = false;
            } else if (lyr.typename === "LayerSet") {
                hideAll(lyr.layers);
            }
        }
    }
    hideAll(dupDoc.layers);

    // 在复制文档中查找与原图层同名的目标图层 / Find the target layer with the same name in the duplicate document
    function findLayer(layers, name) {
        for (var i = 0; i < layers.length; i++) {
            var lyr = layers[i];
            if (lyr.typename === "ArtLayer" && lyr.name === name) {
                return lyr;
            } else if (lyr.typename === "LayerSet") {
                var result = findLayer(lyr.layers, name);
                if (result != null) return result;
            }
        }
        return null;
    }
    var targetLayer = findLayer(dupDoc.layers, layer.name);
    if (targetLayer == null) {
        dupDoc.close(SaveOptions.DONOTSAVECHANGES);
        return;
    }
    // 仅显示目标图层 / Only show the target layer
    targetLayer.visible = true;

    // 裁剪文档至图层内容（剔除透明边界）/ Trim document to layer content (remove transparent borders)
    dupDoc.trim(TrimType.TRANSPARENT, true, true, true, true);

    // 清理图层名称中的非法字符 / Sanitize layer name by removing illegal characters
    var sanitizedName = layer.name.replace(/[\\\/:\*\?"<>\|]/g, "");
    var pngFile = new File(folder + "/" + sanitizedName + ".png");

    var opts = new ExportOptionsSaveForWeb();
    opts.format = SaveDocumentType.PNG;
    opts.PNG8 = false;
    opts.transparency = true;

    dupDoc.exportDocument(pngFile, ExportType.SAVEFORWEB, opts);
    dupDoc.close(SaveOptions.DONOTSAVECHANGES);
}

// 递归遍历所有图层，导出 ArtLayer 为 PNG
// Recursively traverse layers and export ArtLayers as PNG
function exportArtLayers(layers, folder) {
    for (var i = 0; i < layers.length; i++) {
        var lyr = layers[i];
        if (lyr.typename === "ArtLayer") {
            exportLayerAsPNG(lyr, folder);
        } else if (lyr.typename === "LayerSet") {
            exportArtLayers(lyr.layers, folder);
        }
    }
}

// =====================================================
// 图层信息导出：构建树形结构的 JSON
// Layers JSON export: Build a tree-structured JSON
// =====================================================
function buildLayersTree(layers, parentName) {
    var tree = [];

    for (var i = 0; i < layers.length; i++) {
        var lyr = layers[i];
        if (lyr.isBackgroundLayer) continue;

        var layerNode = {
            name: lyr.name
        };

        if (lyr.typename === "ArtLayer") {
            var b = lyr.bounds;

            layerNode.type = "layer";
            layerNode.position = {
                x: parseFloat(b[0].as('px')),
                y: parseFloat(b[1].as('px'))
            };
            layerNode.size = {
                width: parseFloat(b[2].as('px')) - parseFloat(b[0].as('px')),
                height: parseFloat(b[3].as('px')) - parseFloat(b[1].as('px'))
            };
        } else if (lyr.typename === "LayerSet") {
            layerNode.type = "group";
            layerNode.children = buildLayersTree(lyr.layers, lyr.name); // Recursive call, passing the current layer's name as the parent name
        }

        tree.push(layerNode);
    }

    return tree;
}


// 简单的 JSON 序列化函数（支持字符串、数字、布尔值、数组和对象）
// Simple JSON serialization function for strings, numbers, booleans, arrays and objects
function serializeJSON(obj) {
    if (typeof obj === "string") {
        return '"' + obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
    } else if (typeof obj === "number" || typeof obj === "boolean") {
        return obj.toString();
    } else if (obj instanceof Array) {
        var items = [];
        for (var i = 0; i < obj.length; i++) {
            items.push(serializeJSON(obj[i]));
        }
        return "[" + items.join(",") + "]";
    } else if (typeof obj === "object" && obj !== null) {
        var items = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                items.push(serializeJSON(key) + ":" + serializeJSON(obj[key]));
            }
        }
        return "{" + items.join(",") + "}";
    }
    return "null";
}

// 导出 JSON 文件，将图层信息写入 layers.json
// Export JSON file with layers info
function exportLayersJSON(doc, exportFolder) {
    var layersTree = buildLayersTree(doc.layers, null); // Initial call with no parent name
    var jsonObj = { layers: layersTree };
    var jsonString = serializeJSON(jsonObj);
    var jsonFile = new File(exportFolder + "/layers.json");
    if (jsonFile.open("w")) {
        jsonFile.write(jsonString);
        jsonFile.close();
        alert("JSON 文件已导出: " + jsonFile.fsName);
    } else {
        alert("无法写入 JSON 文件: " + jsonFile.fsName);
    }
}
// =====================================================
// 主函数：整体流程控制
// Main function: overall control flow
// =====================================================
function main() {
    if (app.documents.length === 0) {
        alert("请打开一个 PSD 文件! / Please open a PSD file!");
        return;
    }
    var doc = app.activeDocument;

    // 构造导出根目录：PSD所在目录 + PSD文件名（不含扩展名）
    // Build export root: document path + document name (without extension)
    var docName = doc.name;
    var baseName = docName.substring(0, docName.lastIndexOf("."));
    var exportRoot = doc.path + "/" + baseName;
    createFolder(exportRoot);

    // 弹出对话框，获取导出选项 / Show dialog to get export options
    var options = showDialog(); // 返回 { exportImages, folder }

    // 根据对话框设置确定图片导出文件夹 / Determine image export folder based on dialog options
    var imagesFolder = exportRoot;
    if (options.folder && options.folder !== "") {
        imagesFolder = exportRoot + "/" + options.folder;
        createFolder(imagesFolder);
    }

    // 如果选择导出图片，则递归导出所有 ArtLayer 为 PNG
    // If exportImages is selected, recursively export all ArtLayers as PNG
    if (options.exportImages) {
        exportArtLayers(doc.layers, imagesFolder);
        alert("图片导出完毕! / Images export complete.");
    }

    // 导出图层信息 JSON 文件 / Export JSON file with layers info
    exportLayersJSON(doc, exportRoot);

    alert("全部导出完成! / Export complete!");
}

try {
    main();
} catch(e) {
    alert("错误 / Error: " + e.message);
}