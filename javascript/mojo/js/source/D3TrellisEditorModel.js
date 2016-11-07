(function () { 
    if (!mstrmojo.plugins.D3Trellis) {
        mstrmojo.plugins.D3Trellis = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel",
        "mstrmojo.array"
    );
    var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE;

    mstrmojo.plugins.D3Trellis.D3TrellisEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,
        null,
        {
            scriptClass: "mstrmojo.plugins.D3Trellis.D3TrellisEditorModel",
            cssClass: "d3trelliseditormodel",
            getCustomProperty: function getCustomProperty(){
                var myViz = this.getHost();
                var model = new mstrmojo.models.template.DataInterface(myViz.model.data);
                debugger;
                if (myViz.zonesModel && myViz.zonesModel.getDropZones().zones[0].items[0]) {
                    if (model.getRowHeaders(0).getHeader(0)) {
                        var colorByValues = model.getRowHeaders(0).getHeader(0).t.es;
                    }
                }
                return[
                    {
                        name: "Trellis Chart",
                        value:[
                            {
                                style: $WT.LABEL,
                                labelText: "Number of Rows"
                            },
                            {
                                style: $WT.TEXTBOX,
                                propertyName: "numRows"
                            },
                            {
                                style: $WT.LABEL,
                                labelText: "Number of Columns"
                            },
                            {
                                style: $WT.TEXTBOX,
                                propertyName: "numCols"
                            },
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.LABEL,
                                        labelText: "Color Formatting"
                                    },
                                    {
                                        style: $WT.PULLDOWN,
                                        propertyName: "colorBy",
                                        items: (function () {
                                            var pullDownValues = [
                                                {
                                                    name: "-Select an attribute element-",
                                                    value: "All"
                                                }
                                            ];
                                            for (var i = 0; colorByValues && i < colorByValues.length; i++) {
                                                pullDownValues.push(
                                                    {
                                                        name: colorByValues[i].n,
                                                        value: i.toString()
                                                    }
                                                );
                                            }
                                            return pullDownValues;
                                        })(),
                                        config: {
                                            suppressData: true,
                                            onPropertyChange: function (propertyName, newValue) {
                                                if (newValue) {
                                                    attElementID = newValue;
                                                }
                                                return {};
                                            },
                                            callback: function () {
                                                if (attElementID !== "All")
                                                    myViz.setFillColors(attElementID);
                                            }
                                        }
                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [
                                            {
                                                style: $WT.LABEL,
                                                width: "20%",
                                                labelText: "Fill:"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "80%",
                                                propertyName: "fillColor",
                                                config: {
                                                    suppressData: true,
                                                    onPropertyChange: function (propertyName, newValue) {
                                                        if (newValue) {
                                                            fillColorObj = newValue;
                                                        }
                                                        return {};
                                                    },
                                                    callback: function () {
                                                        if (myViz.getProperty("colorBy") !== "All") {
                                                            myViz.setColorsVar(fillColorObj);
                                                            myViz.refresh();
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]

}
})}());
//@ sourceURL=D3TrellisEditorModel.js