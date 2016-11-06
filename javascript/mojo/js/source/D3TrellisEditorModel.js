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
                            }
                        ]
                    }
                ]

}
})}());
//@ sourceURL=D3TrellisEditorModel.js