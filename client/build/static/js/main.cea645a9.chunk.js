(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{45:function(e,t,n){e.exports=n(86)},54:function(e,t,n){},55:function(e,t,n){},56:function(e,t,n){},65:function(e,t,n){},66:function(e,t,n){},86:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),l=n(15),o=n.n(l),i=n(22),c=n(19),u=n(10),s=n(36),p=n.n(s),f=n(37),d=n(13),h="SET_FILE",m="REMOVE_FILE",E="DOWNLOAD_SUCCESSFUL",g="FILE_ERROR",v={fileText:null,loading:!0,fileError:null,download:null},C=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:v,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case h:return Object(d.a)({},e,{fileText:t.payload,loading:!1,fileError:null});case m:return Object(d.a)({},e,{fileText:null,loading:!1,fileError:null});case g:return Object(d.a)({},e,{fileText:null,loading:!1,fileError:t.payload});case E:return Object(d.a)({},e,{loading:!1,fileError:null,download:"Download is succesfull"});default:return e}},b=Object(u.c)({file:C}),w=[p.a,f.a],F=Object(u.d)(b,u.a.apply(void 0,w)),O=(n(54),n(9)),T=(n(55),n(17)),j=n(38),x=n(39),y=n(43),k=n(40),R=n(44),S=(n(56),n(14)),W=n(41),N=n.n(W),D=n(18),U=(n(65),function(e){var t=e.handleChange,n=e.label,a=Object(D.a)(e,["handleChange","label"]);return r.a.createElement("div",{className:"group"},r.a.createElement("input",Object.assign({className:"form-input",onChange:t},a)),n?r.a.createElement("label",{className:"".concat(a.value.length>0?"shrink":""," form-input-label")},n):null)}),A=(n(66),function(e){var t=e.children,n=e.handleClick,a=Object(D.a)(e,["children","handleClick"]);return r.a.createElement("button",Object.assign({className:"custom-button",onClick:n},a),t)}),I=n(11),L=n.n(I),_="/api/v1/files",P=function(e){return{type:h,payload:e}},H=function(){return{type:m}},J=function(){return{type:E}},M=function(e){return{type:g,payload:e}},B=function(e){function t(){var e;return Object(j.a)(this,t),(e=Object(y.a)(this,Object(k.a)(t).call(this))).handleChange=function(t){e.setState(Object(T.a)({},t.target.name,t.target.value))},e.selectFile=function(t){e.setState({fileForUpload:t.target.files[0]})},e.replaceTextClient=function(){e.props.replaceInFile(e.state.forReplace,e.state.replaceWith),e.setState({forReplace:"",replaceWith:""})},e.uploadFileClient=function(){var t=new FormData;t.append("wordfile",e.state.fileForUpload),e.props.uploadFile(t)},e.state={fileForUpload:null,forReplace:"",replaceWith:""},e}return Object(R.a)(t,e),Object(x.a)(t,[{key:"componentDidMount",value:function(){this.props.fileText||this.props.getFile()}},{key:"componentDidUpdate",value:function(){this.props.fileError&&("fail"===this.props.fileError.status?S.ToastsStore.info(this.props.fileError.message):S.ToastsStore.error(this.props.fileError.message))}},{key:"render",value:function(){var e,t=this;return this.props.fileText&&(e=(e=this.props.fileText.replace(/<\/p>|<\/strong>|<strong>|<\/a>|<a>|<\/tr>|<tr>|<\/td>|<td>|<table>|<\/table>|<ul>|<\/ul>|<\/li>|<li>/g,"")).split("<p>")),r.a.createElement("div",{className:"main-page"},r.a.createElement("div",{className:"sidebar"},r.a.createElement(U,{type:"file",handleChange:this.selectFile,name:"wordfile"}),r.a.createElement(A,{handleClick:this.uploadFileClient},"Upload File"),r.a.createElement(A,{handleClick:function(){return t.props.removeFile()}},"Remove File"),r.a.createElement(U,{label:"Search Text",handleChange:this.handleChange,name:"forReplace",value:this.state.forReplace}),r.a.createElement(U,{label:"Replace With",name:"replaceWith",handleChange:this.handleChange,value:this.state.replaceWith}),r.a.createElement(A,{handleClick:this.replaceTextClient},"Replace"),r.a.createElement("div",{className:"button-group-download"},r.a.createElement(A,{handleClick:function(){return t.props.downloadAsWord()}},"Save as Word Document"),r.a.createElement(A,{handleClick:function(){return t.props.downloadAsPDF()}},"Save as PDF document"))),r.a.createElement("div",{className:"file-content"},e?e.map((function(e,n){return r.a.createElement("p",{key:n},r.a.createElement(N.a,{highlightClassName:"YourHighlightClass",searchWords:[t.state.forReplace],autoEscape:!0,textToHighlight:e,caseSensitive:!0}))})):r.a.createElement("p",null,"Upload file to continue, once you are done, click on remove file")),r.a.createElement(S.ToastsContainer,{store:S.ToastsStore}))}}]),t}(r.a.Component),V=Object(c.b)((function(e){var t=e.file;return{fileText:t.fileText,fileError:t.fileError}}),(function(e){return{uploadFile:function(t){return e(function(e){return function(t){L.a.post("".concat(_,"/"),e,{withCredentials:!0}).then((function(e){return t(P(e.data.text))})).catch((function(e){return t(M(e.response.data))}))}}(t))},getFile:function(){return e((function(e){L.a.get("".concat(_,"/"),{withCredentials:!0}).then((function(t){return e(P(t.data))})).catch((function(t){return e(M(t.response.data))}))}))},replaceInFile:function(t,n){return e(function(e,t){return function(n){L.a.post("".concat(_,"/text"),{forReplace:e,replaceWith:t},{withCredentials:!0}).then((function(e){return n(P(e.data))})).catch((function(e){return n(M(e.response.data))}))}}(t,n))},downloadAsWord:function(){return e((function(e){L.a.get("".concat(_,"/word"),{withCredentials:!0}).then((function(){window.open("".concat(_,"/word")),e(J())})).catch((function(t){return e(M(t.response.data))}))}))},downloadAsPDF:function(){return e((function(e){L.a.get("".concat(_,"/pdf"),{withCredentials:!0}).then((function(){window.open("".concat(_,"/pdf")),e(J())})).catch((function(t){return e(M(t.response.data))}))}))},removeFile:function(){return e((function(e){L.a.delete("".concat(_,"/"),{withCredentials:!0}).then((function(){return e(H())})).catch((function(t){return e(M(t.response.data))}))}))}}}))(B);var Y=function(){return r.a.createElement("div",{className:"App"},r.a.createElement(O.c,null,r.a.createElement(O.a,{exact:!0,path:"/",component:V})))};o.a.render(r.a.createElement(c.a,{store:F},r.a.createElement(i.a,null,r.a.createElement(Y,null))),document.getElementById("root"))}},[[45,1,2]]]);
//# sourceMappingURL=main.cea645a9.chunk.js.map