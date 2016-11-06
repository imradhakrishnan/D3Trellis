(function () { 
    if (!mstrmojo.plugins.D3Trellis) {
        mstrmojo.plugins.D3Trellis = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface",
        "mstrmojo.vi.models.editors.CustomVisEditorModel"
    );

    mstrmojo.plugins.D3Trellis.D3Trellis = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.D3Trellis.D3Trellis",
            cssClass: "d3trellis",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [{url:"http://d3js.org/d3.v3.min.js"},{url:"http://dimplejs.org/dist/dimple.v2.2.0.min.js"}],
            useRichTooltip: false,
            reuseDOMNode: false,
            plot:function(){
                debugger;
                var me = this;
                var is10point3 = typeof this.addThresholdMenuItem === 'function'; //true if it's MSTR 10.3 or above
                var isDocument = typeof me.zonesModel === "undefined";  //true if it's a document
                var total_width = parseInt(me.width, 10);
                var total_height = parseInt(me.height, 10);
                var margin = {top: 50, right: 40, bottom: 40, left: 60};
                var legendPos = {x: 240, y: 10, width: (total_width - margin.right - margin.left), height: 20, align: "left"}; //Increase the width to see more elements in legend
                var selectedRect; //to store the current rect selected by the user
                var selectedStrokeWidth = "4"; //if a rect is selected, inc its stroke width
                var dataConfig = {hasSelection: true}; //parameter to be passed to dataInterface API while importing data


                if (is10point3) {
                    me.addThresholdMenuItem(); // to enable thresholding option for metric
                    dataConfig.hasThreshold = true;
                    me.setDefaultPropertyValues({
                            numRows: 4,
                            numCols: 2
                        }
                    );

                    properties = me.getProperties(); //reference to custom properties
                }
                me.addUseAsFilterMenuItem(); //to use this visualization as a filter or selector
                //with rawDRows - get the rows in almost a flat JSON format, some modifications will be necessary before passing to library
                var rawDRows = me.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ROWS);
                var model; //var to store data model created from zonesModel (drop zones)
                if(is10point3 && !isDocument){
                    model = new mstrmojo.models.template.DataInterface(me.model.data);
                }
                var rawD = me.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ADV, dataConfig); //to get the data along with attribute selector and threshold info

                var dataS = []; //data to be passed to the Dimple library
                debugger;
                var nCols = !is10point3 ? 2 : me.getProperty("numCols");
                var nRows = !is10point3 ? 4 : me.getProperty("numRows");

                //to populate dataS var - flattening the data to make it usable with the library
                for (var i = 0; i < rawDRows.length; i++) {
                    var object = rawDRows[i];
                    for (var name in object) {
                        if (typeof object[name] === "object")
                            object[name] = object[name].v;
                    }
                    dataS.push(object);
                }
                debugger;
                var rowTitles = me.dataInterface.getRowTitles();
                var colTitles = me.dataInterface.getColTitles();
                //If we are using in document, since drop zones are not available, get the attribute names from dataInterface API..
                // In case of dashboard, use the zonesModel to get the correct attribute names from each drop zone.
                var horMetric =  me.zonesModel.getDropZones().zones[0].items[0].n;
                var verMetric = me.zonesModel.getDropZones().zones[1].items[0].n;
                var groupby = me.zonesModel.getDropZones().zones[2].items[0].n;
              //  var subset = me.zonesModel.getDropZones().zones[2].items[1].n;

                //  var rawD = me.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ADV, dataConfig);
                var chart = d3.select(me.domNode).select("svg");
                if (!chart.empty()) {
                    var e = me.domNode.querySelector("svg");
                    me.domNode.removeChild(e);
                }

                var svg = dimple.newSvg(me.domNode, total_width, total_height);




             //   d3.tsv("https://raw.githubusercontent.com/PMSI-AlignAlytics/dimple/master/data/example_data.tsv", function (data) {
                  //  console.log(dataS);
                    // Get a unique list of dates
                    var categories = dimple.getUniqueValues(dataS, groupby);
                    var horValues = dimple.getUniqueValues(dataS, horMetric);
                    console.log("Months" + categories);
                    debugger;
                    // Set the bounds for the charts
                    var row = 0,
                        col = 0,
                        top = 15,
                        left = 60,
                        inMarg = 15,
                        width = (total_width - inMarg - left - 100) / nCols,
                        height = (total_height - top - 120) / nRows,
                        totalWidth = parseFloat(svg.attr("width"));

                    // Pick the latest 12 dates
                  //  months = months.slice(months.length - 12);

                    // Draw a chart for each of the 12 dates
                    categories.forEach(function (category) {

                        // Wrap to the row above
                        if (left + ((col + 1) * (width + inMarg)) > totalWidth) {
                            row += 1;
                            col = 0;
                        }

                        // Filter for the month in the iteration
                        var chartData = dimple.filterData(dataS, groupby, category);
                            console.log(chartData);
                        // Use d3 to draw a text label for the month

                        svg
                            .append("text")
                            .attr("x", left + (col * (width + inMarg)) + (width / 2))
                            .attr("y", top + (row * (height + inMarg)) + (height / 2) + 12)
                            .style("font-family", "sans-serif")
                            .style("text-anchor", "middle")
                            .style("font-size", "28px")
                            .style("opacity", 0.2)
                            .text(chartData[0][groupby].substring(0, 3));

                        // Create a chart at the correct point in the trellis
                        var myChart = new dimple.chart(svg, chartData);
                        myChart.setBounds(
                            left + (col * (width + inMarg)),
                            top + (row * (height + inMarg)),
                            width,
                            height);

                        // Add x and fix ordering so that all charts are the same
                        var x = myChart.addCategoryAxis("x", horMetric);
                        x.addOrderRule(horValues);

                        // Add y and fix scale so that all charts are the same
                        var y = myChart.addMeasureAxis("y", verMetric);
                    //    y.overrideMax = 16000000;

                        // Draw the bars.  Passing null here would draw all bars with
                        // the same color.  Passing owner second colors by owner, which
                        // is normally bad practice in a bar chart but works in a trellis.
                        // Month is only passed here so that it shows in the tooltip.
                        myChart.addSeries([groupby, horMetric], dimple.plot.bar);

                        // Draw the chart
                        myChart.draw();

                        // Once drawn we can access the shapes
                        // If this is not in the first column remove the y text
                        if (col > 0) {
                            y.shapes.selectAll("text").remove();
                        }
                        // If this is not in the last row remove the x text
                        if (row < nRows-1) {
                            x.shapes.selectAll("text").remove();
                        }
                        // Remove the axis labels
                        y.titleShape.remove();
                        x.titleShape.remove();

                        // Move to the next column
                        col += 1;

                    }//, this);
                //}
                );
            







}})}());
//@ sourceURL=D3Trellis.js