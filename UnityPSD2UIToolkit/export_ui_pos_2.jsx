#target photoshop

// 获取当前文档
var doc = app.activeDocument;

// 用于存储图层信息的数组
var layersInfo = [];

// 遍历文档中的所有图层
function getLayerInfo(layer) {
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
        }
    };

    layersInfo.push(layerInfo);
}

// 递归遍历所有子图层
function traverseLayers(layers) {
    for (var i = 0; i < layers.length; i++) {
        var currentLayer = layers[i];
        if (currentLayer.typename === "ArtLayer") {
            getLayerInfo(currentLayer);
        } else if (currentLayer.typename === "LayerSet") {
            traverseLayers(currentLayer.layers); // 如果是图层组，递归遍历
        }
    }
}

// 获取图层信息
traverseLayers(doc.layers);

// 保存图层信息为 JSON 文件
var jsonFile = File.saveDialog("保存图层数据为 JSON 文件", "*.json");
if (jsonFile) {
    jsonFile.open("w");

    // Photoshop ExtendScript does not have a built-in JSON object.
    // We need to use the JavaScript eval() function and a custom function to stringify the object.

    function stringify(obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"' + obj + '"';
            return String(obj);
        } else {
            // recurse array or object
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

    jsonFile.write(stringify(layersInfo)); // 使用自定义的 stringify 函数
    jsonFile.close();
    alert("图层信息已保存!");
} else {
    alert("没有选择文件保存路径!");
}