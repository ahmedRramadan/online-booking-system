(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[616],{8588:function(e,s,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/signup",function(){return a(4274)}])},2024:function(e,s){"use strict";s.Z={src:"/_next/static/media/account-bg.a7eb5075.jpg",height:1080,width:1920,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAUACAMBIgACEQEDEQH/xAAnAAEBAAAAAAAAAAAAAAAAAAAABwEBAAAAAAAAAAAAAAAAAAAABP/aAAwDAQACEAMQAAAAkweb/8QAFxAAAwEAAAAAAAAAAAAAAAAAAAERUf/aAAgBAQABPwCrD//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Af//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Af//Z",blurWidth:8,blurHeight:5}},4409:function(e,s,a){"use strict";a.d(s,{I:function(){return t}});var r=a(3977);a(3059);var n=a(1259);let i=(0,r.ZF)({apiKey:"AIzaSyBXdb-u5mhZ4RX_Iuqdcukad8VBr9MV0wM",authDomain:"online-booking-system-1.firebaseapp.com",projectId:"online-booking-system-1",storageBucket:"online-booking-system-1.appspot.com",messagingSenderId:"255249528767",appId:"1:255249528767:web:3fed96a474a33603b2530a",measurementId:"G-M7XQ2D3X0X"}),t=(0,n.v0)(i)},4274:function(e,s,a){"use strict";a.r(s),a.d(s,{default:function(){return d}});var r=a(5893);a(9182);var n=a(7294),i=a(9603),t=a(3024);a(9260);var A=a(2024);a(9102);var c=a(4409),l=a(1259),o=a(1163);function d(){let e=new l.hJ,s=new l._O,[a,d]=(0,n.useState)(""),[h,u]=(0,n.useState)(""),[m,g]=(0,n.useState)(""),[p,x]=(0,n.useState)(""),[j,f]=(0,n.useState)(!1),w=(0,o.useRouter)(),[b,v]=(0,n.useState)(!1),[N,y]=(0,n.useState)(""),[C,E]=(0,n.useState)(""),I=async e=>{if(e.preventDefault(),v(!0),y(""),E(""),m!==p){y("Passwords don't match."),v(!1);return}if(!j){y("You must agree to the terms and conditions."),v(!1);return}try{let e=await (0,l.Xb)(c.I,h,m);await (0,l.w$)(e.user),E("Verification email sent. Please check your inbox."),w.push("/login")}catch(e){y(e.message)}finally{v(!1)}},k=async()=>{v(!0),y(""),E("");try{await (0,l.rh)(c.I,e),E("Successfully signed in with Google."),w.push("/")}catch(e){console.error("Error signing in with Google:",e.message),y(e.message)}finally{v(!1)}},Q=async()=>{v(!0),y(""),E("");try{await (0,l.rh)(c.I,s),E("Successfully signed in with Facebook."),w.push("/")}catch(e){console.error("Error signing in with Facebook:",e.message),y(e.message)}finally{v(!1)}};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("div",{className:"preloader",children:(0,r.jsx)("div",{className:"preloader-inner",children:(0,r.jsxs)("div",{className:"preloader-icon",children:[(0,r.jsx)("span",{}),(0,r.jsx)("span",{})]})})}),(0,r.jsx)("section",{className:"account-section bg_img",style:{backgroundImage:"url(".concat(A.Z.src,")")},children:(0,r.jsx)("div",{className:"container",children:(0,r.jsx)("div",{className:"padding-top padding-bottom",children:(0,r.jsxs)("div",{className:"account-area",children:[(0,r.jsxs)("div",{className:"section-header-3",children:[(0,r.jsx)("span",{className:"cate",children:"welcome"}),(0,r.jsx)("h2",{className:"title text-white",children:"to TakeIt"})]}),N&&(0,r.jsx)("div",{className:"alert alert-danger",role:"alert",children:N}),C&&(0,r.jsx)("div",{className:"alert alert-success",role:"alert",children:C}),(0,r.jsxs)("form",{className:"account-form",onSubmit:I,children:[(0,r.jsxs)("div",{className:"form-group",children:[(0,r.jsxs)("label",{htmlFor:"name",children:["Name",(0,r.jsx)("span",{children:"*"})]}),(0,r.jsx)("input",{type:"text",placeholder:"Enter Your Name",id:"name",required:!0,onChange:e=>d(e.target.value)})]}),(0,r.jsxs)("div",{className:"form-group",children:[(0,r.jsxs)("label",{htmlFor:"email1",children:["Email",(0,r.jsx)("span",{children:"*"})]}),(0,r.jsx)("input",{type:"text",placeholder:"Enter Your Email",id:"email1",required:!0,onChange:e=>u(e.target.value)})]}),(0,r.jsxs)("div",{className:"form-group",children:[(0,r.jsxs)("label",{htmlFor:"pass1",children:["Password",(0,r.jsx)("span",{children:"*"})]}),(0,r.jsx)("input",{type:"password",placeholder:"Password",id:"pass1",required:!0,onChange:e=>g(e.target.value)})]}),(0,r.jsxs)("div",{className:"form-group",children:[(0,r.jsxs)("label",{htmlFor:"pass2",children:["Confirm Password",(0,r.jsx)("span",{children:"*"})]}),(0,r.jsx)("input",{type:"password",placeholder:"Confirm Password",id:"pass2",required:!0,onChange:e=>x(e.target.value)})]}),(0,r.jsxs)("div",{className:"form-group checkgroup",children:[(0,r.jsx)("input",{type:"checkbox",id:"bal",required:!0,checked:j,onChange:e=>f(e.target.checked)}),(0,r.jsxs)("label",{htmlFor:"bal",children:["I agree to the ",(0,r.jsx)("a",{href:"#0",children:"Terms, Privacy Policy"})," and ",(0,r.jsx)("a",{href:"#0",children:"Fees"})]})]}),(0,r.jsx)("div",{className:"form-group text-center",children:(0,r.jsx)("input",{type:"submit",value:"Sign Up"})})]}),(0,r.jsxs)("div",{className:"option text-white",children:["Already have an account? ",(0,r.jsx)("a",{href:"/login",children:"Login"})," "]}),(0,r.jsx)("div",{className:"or",children:(0,r.jsx)("span",{children:"Or"})}),(0,r.jsxs)("ul",{className:"social-icons px-0",children:[(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:"#",onClick:Q,children:(0,r.jsx)(i.G,{icon:t.AYu})})}),(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:"#",onClick:k,children:(0,r.jsx)(i.G,{icon:t.xYR})})})]})]})})})})]})}},9182:function(){}},function(e){e.O(0,[271,681,948,167,303,888,774,179],function(){return e(e.s=8588)}),_N_E=e.O()}]);