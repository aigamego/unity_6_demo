#target photoshop

// 获取当前文档
var doc = app.activeDocument;

// 用于存储图层信息的数组
var layersInfo = [];

// 定义一个函数，用于创建目录
function createFolder(folderPath) {
    var folder = new Folder(folderPath);
    if (!folder.exists) {
        folder.create();
    }
    return folder;
}

// 遍历文档中的所有图层
function getLayerInfo(layer, index) {
    if (layer.isBackgroundLayer) return; // 忽略背景层

    var layerInfo = {
        name: layer.name,
        position: {
            x: layer.bounds[0].as('px'),
            y: layer.bounds[1].as('px')
        },
        size: {
            width: (layer.bounds[2].as('px') - layer.bounds[0].as('px')),
            height: (layer.bounds[3].as('px') - layer.bounds[1].as('px'))
        },
        index: index
    };

    layersInfo.push(layerInfo);
}

// 递归遍历所有子图层
function traverseLayers(layers) {
    for (var i = 0; i < layers.length; i++) {
        var currentLayer = layers[i];
        if (currentLayer.typename === "ArtLayer") {
            getLayerInfo(currentLayer, i);
        } else if (currentLayer.typename === "LayerSet") {
            traverseLayers(currentLayer.layers); // 如果是图层组，递归遍历
        }
    }
}

// 获取图层信息
traverseLayers(doc.layers);

// 创建根对象
var rootObject = {
    layers: layersInfo  // 将图层信息数组作为 "layers" 属性的值
};


// 保存图层信息为 JSON 文件
var jsonFile = File.saveDialog("保存图层数据为 JSON 文件", "*.json");
if (jsonFile) {
    jsonFile.open("w");

    function stringify(obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            if (t == "string") obj = '"' + obj + '"';
            return String(obj);
        } else {
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n];
                t = typeof (v);
                if (obj.hasOwnProperty(n)) {
                    if (t == "string") v = '"' + v + '"';
                    else if (t == "object" && v !== null) v = stringify(v);

                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    }

    jsonFile.write(stringify(rootObject)); // 使用根对象
    jsonFile.close();
    alert("图层信息已保存!");

    // 创建保存 PNG 图片的文件夹
    var folderPath = jsonFile.path + "/png_layers";
    var pngFolder = createFolder(folderPath);

    // 导出 PNG 图片
    for (var i = 0; i < doc.layers.length; i++) {
        var layer = doc.layers[i];
        if (layer.isBackgroundLayer) continue; // 忽略背景层

        layer.visible = true;  // Ensure layer is visible before exporting

        var pngFile = new File(pngFolder + "/" + layer.name + ".png");
        var exportOptions = new ExportOptionsSaveForWeb();
        exportOptions.format = SaveDocumentType.PNG;
        exportOptions.PNG8 = false;  // Use PNG-24
        exportOptions.transparency = true; //保持透明

        doc.activeLayer = layer;  //set the active layer for export

        // 使用 ExportDocument 代替 saveAs
        doc.exportDocument(pngFile, ExportType.SAVEFORWEB, exportOptions);

        layer.visible = true; // Re-enable all layers (if you initially disabled them)

    }

    alert("所有图层已导出到: " + pngFolder);

} else {
    alert("没有选择文件保存路径!");
}