webpackJsonp([3,7],{308:function(e,t,i){function s(e){i(441)}var c=i(114)(i(443),i(444),s,null,null);e.exports=c.exports},311:function(e,t,i){function s(e){i(456)}var c=i(114)(i(458),i(459),s,null,null);e.exports=c.exports},318:function(e,t,i){"use strict";t.__esModule=!0;var s=i(115),c=function(e){return e&&e.__esModule?e:{default:e}}(s);t.default=c.default||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var s in i)Object.prototype.hasOwnProperty.call(i,s)&&(e[s]=i[s])}return e}},441:function(e,t,i){var s=i(442);"string"==typeof s&&(s=[[e.i,s,""]]),s.locals&&(e.exports=s.locals);i(306)("2ba2eb52",s,!0,{})},442:function(e,t,i){t=e.exports=i(305)(!1),t.push([e.i,".icon__send-active{color:#333}",""])},443:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=i(59);t.default={props:["device","activeDevicesID","isDeviceWatched"],data:function(){return{watchTooltip:!1}},computed:{model:function(){return this.activeDevicesID.includes(this.device.id)}},methods:{deviceClickHandler:function(){this.activeDevicesID.includes(this.device.id)?this.unsetActiveDevice():this.setActiveDevice()},setActiveDevice:function(){this.device.messages_ttl&&this.$store.commit("setActiveDevice",this.device.id)},unsetActiveDevice:function(){this.$store.commit("unsetActiveDevice",this.device.id)},watchDeviceHandler:function(){var e=this;if(!this.device.messages_ttl)return!1;this.activeDevicesID.includes(this.device.id)||this.setActiveDevice(),this.isDeviceWatched?this.$emit("update:watch-by-id",null):this.$emit("update:watch-by-id",this.device.id),setTimeout(function(){e.watchTooltip=!1},500)}},components:{QItem:s.k,QItemMain:s.l,QItemSide:s.m,QItemTile:s.n,QIcon:s.i,QTooltip:s.E}}},444:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("q-item",{staticClass:"cursor-pointer",class:[e.model?"active":"",e.device.messages_ttl?"":"disabled"],attrs:{highlight:e.$q.platform.is.desktop},on:{click:e.deviceClickHandler}},[e.device.messages_ttl?e._e():i("q-tooltip",[e._v("You should set messages ttl more than 0")]),e._v(" "),i("q-item-side",{staticClass:"text-center",class:[e.model?"text-primary":""],attrs:{icon:"developer_board"}},[i("q-item-tile",[i("small",[e._v("#"+e._s(e.device.id))])])],1),e._v(" "),i("q-item-main",[i("q-item-tile",{staticClass:"ellipsis",attrs:{label:""}},[e._v(e._s(e.device.name||"<noname>"))]),e._v(" "),i("small",[e.device.ident?i("q-item-tile",{staticClass:"ellipsis",attrs:{sublabel:""}},[i("q-icon",{attrs:{name:"label_outline"}}),e._v(" "+e._s(e.device.ident))],1):e._e(),e._v(" "),e.device.phone?i("q-item-tile",{attrs:{sublabel:""}},[i("q-icon",{attrs:{name:"phone"}}),e._v(" "+e._s(e.device.phone))],1):e._e()],1)],1),e._v(" "),i("q-item-side",{staticClass:"text-center"},[i("q-item-tile",[i("q-icon",{class:[e.isDeviceWatched&&e.activeDevicesID.includes(e.device.id)?"icon__send-active":""],attrs:{size:"1.5rem",name:"gps_fixed"},on:{click:function(t){t.stopPropagation(),e.watchDeviceHandler(t)}}},[e.device.messages_ttl?i("q-tooltip",{model:{value:e.watchTooltip,callback:function(t){e.watchTooltip=t},expression:"watchTooltip"}},[e._v("Show on map")]):e._e()],1)],1)],1)],1)},staticRenderFns:[]}},456:function(e,t,i){var s=i(457);"string"==typeof s&&(s=[[e.i,s,""]]),s.locals&&(e.exports=s.locals);i(306)("3a43886c",s,!0,{})},457:function(e,t,i){t=e.exports=i(305)(!1),t.push([e.i,"",""])},458:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=i(38),c=i.n(s),n=i(39),a=i.n(n),o=i(318),r=i.n(o),l=i(59),v=i(116),d=i(308),u=i.n(d);t.default={name:"DeviceList",data:function(){return{unsubscribeDevices:function(){}}},props:["devices","activeDevicesID","deviceIdForWatch"],components:{QList:l.q,QListHeader:l.r,QIcon:l.i,Device:u.a},methods:r()({},Object(v.c)(["poolDevices"]),{setWatchByDeviceID:function(e){this.$emit("update:watch-by-id",e)}}),created:function(){var e=this;return a()(c.a.mark(function t(){return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(e.$store.state.token){t.next=2;break}return t.abrupt("return",!1);case 2:return t.next=4,e.poolDevices();case 4:e.unsubscribeDevices=t.sent;case 5:case"end":return t.stop()}},t,e)}))()},beforeDestroy:function(){this.unsubscribeDevices()}}},459:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("q-list",{attrs:{separator:""}},[i("q-list-header",[i("big",[e._v("Devices")])],1),e._v(" "),e._l(e.devices,function(t){return i("device",{key:t.id,attrs:{device:t,activeDevicesID:e.activeDevicesID,isDeviceWatched:e.deviceIdForWatch===t.id},on:{"update:watch-by-id":e.setWatchByDeviceID}})})],2)},staticRenderFns:[]}}});