(function () { 
    if (!mstrmojo.plugins.D3Trellis) {
        mstrmojo.plugins.D3Trellis = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    mstrmojo.plugins.D3Trellis.D3TrellisDropZones = mstrmojo.declare(
        mstrmojo.vi.models.CustomVisDropZones,
        null,
        {
            scriptClass: "mstrmojo.plugins.D3Trellis.D3TrellisDropZones",
            cssClass: "d3trellisdropzones",
            getCustomDropZones: function getCustomDropZones(){
                var ENUM_ALLOW_DROP_TYPE = mstrmojo.vi.models.CustomVisDropZones.ENUM_ALLOW_DROP_TYPE;

                return [
                    {
                        name: 'Horizontal Axis Metric',
                        title: mstrmojo.desc(13827, 'Drag Attribute here'),
                        maxCapacity: 1,
                        allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE
                    },
                    {
                        name: 'Vertical Axis Metric',
                        title: mstrmojo.desc(13827, 'Drag metric here'),
                        maxCapacity: 1,
                        allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC
                    },
                    {
                        name: 'Group By',
                        title: mstrmojo.desc(13827, 'Drag attribute here'),
                        minCapacity: 1,
                        maxCapacity: 4,
                        allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE
                    }

                ];
 },
            shouldAllowObjectsInDropZone: function shouldAllowObjectsInDropZone(zone, dragObjects, idx, edge, context) {

                var me = this;
                return {
                    allowedItems: mstrmojo.array.filter(dragObjects, function (object) {
                        var isMetric = me.isMetric(object);
                        switch (zone.n) {
                            case 'Horizontal Axis Metric':
                                return !(me.isObjectInZone(object, 'Group By') || me.isObjectInZone(object, 'Vertical Axis Metric')); // Can't have same unit from other drop zones
                            case 'Group By':
                                return !(me.isObjectInZone(object, 'Horizontal Axis Metric') || me.isObjectInZone(object, 'Vertical Axis Metric'));
                            case 'Vertical Axis Metric':
                                return !(me.isObjectInZone(object, 'Horizontal Axis Metric') || me.isObjectInZone(object, 'Group By'));
                        }
                        return true;
                    })
                };







},
            getActionsForObjectsDropped: function getActionsForObjectsDropped(zone, droppedObjects, idx, replaceObject, extras) {
 








},
            getActionsForObjectsRemoved: function getActionsForObjectsRemoved(zone, objects) { 
 








},
            getDropZoneContextMenuItems: function getDropZoneContextMenuItems(cfg, zone, object, el) {
 








}
})}());
//@ sourceURL=D3TrellisDropZones.js