function loadPage(){
    //判断预加载动画加载完毕
    var attention = document.querySelector(".main-attention");
    if(window.getComputedStyle(attention).opacity==="1"){
        document.querySelector(".main-overShadow").style.display = "none";
        document.getElementById("self").style.display = "flex";
    }
}

//用于标记鼠标是否进入某pic，如果进入则为true，便于对mouseout判断
let enter_pic1=false;
let enter_pic2=false;
let enter_pic3=false;
let enter_pic4=false;

//用于标记鼠标是否点击过某pic，如果点击，则为true，便于对mouseout和reset的判断
let click_pic1=false;
let click_pic2=false;
let click_pic3=false;
let click_pic4=false;

function picFirstINOver() {
    var pic1 = document.getElementById("pic1");
    var pic2 = document.getElementById("pic2");
    var pic3 = document.getElementById("pic3");
    var pic4 = document.getElementById("pic4");

    //element.style 读取的只是元素的内联样式，即写在元素的 style 属性上的样式；
    // getComputedStyle 读取的样式是最终样式，包括了内联样式、嵌入样式和外部样式。
    var pic4_width = window.getComputedStyle(pic4).width;

    //检测第一次图片滑动动画加载完毕
    if(parseInt(pic4_width)>=0.81*document.body.clientWidth){
        pic1.addEventListener("mouseover",  pic1MouseOver);
        pic1.addEventListener("mouseout", pic1MouseOut);
        pic1.addEventListener("click", pic1Click);

        pic2.addEventListener("mouseover",  pic2MouseOver);
        pic2.addEventListener("mouseout", pic2MouseOut);
        pic2.addEventListener("click", pic2Click);

        pic3.addEventListener("mouseover",  pic3MouseOver);
        pic3.addEventListener("mouseout", pic3MouseOut);
        pic3.addEventListener("click", pic3Click);

        pic4.addEventListener("mouseover",  pic4MouseOver);
        pic4.addEventListener("mouseout", pic4MouseOut);
        //页面第一个无需点击
        // pic4.addEventListener("click", pic4Click);
        console.log("添加事件成功！");

        //第一次触发成功后即需要停止此事件 以防持续触发addEventListener
        document.querySelector(".self-introduce").onmousemove = null;
        console.log(document.querySelector(".self-introduce").onmousemove);
        console.log("picFirstINOver()自动停止成功！")
    }
}

function picBig(pic_number) {
    var pic1 = document.getElementById("pic1");
    var pic2 = document.getElementById("pic2");
    var pic3 = document.getElementById("pic3");
    var pic4 = document.getElementById("pic4");

    if(pic_number==="pic1"){
        enter_pic1 = true;
        //学习疑问，这里用改变className的方式过于累赘繁复，可采用别的方式控制动画
        pic1.className = "pic1-mouse-over-big";
        pic2.className = "pic2-mouse-over";
        pic3.className = "pic3-mouse-over";
        pic4.className = "pic4-mouse-over";
    }else if(pic_number==="pic2"){
        enter_pic2 = true;
        pic2.className = "pic2-mouse-over-big";
        pic3.className = "pic3-mouse-over";
        pic4.className = "pic4-mouse-over";
    }else if(pic_number==="pic3"){
        enter_pic3 = true;
        pic3.className = "pic3-mouse-over-big";
        pic4.className = "pic4-mouse-over";
    }else {
        enter_pic4 = true;
        pic4.className = "pic4-mouse-over-big";
    }
}

function picNormal(pic_number) {
    //用于标记出入逻辑

    // 这里的pic_number转化之后是字符串1，不能直接与1作比较
    if(pic_number.slice(-1)==="1"){
        enter_pic1 = false;
        console.log("移出pic1");
    }else if(pic_number.slice(-1)==="2"){
        enter_pic2 = false;
        console.log("移出pic2");
    }else if(pic_number.slice(-1)==="3"){
        enter_pic3 = false;
        console.log("移出pic3");
    }else{
        enter_pic4 = false;
        console.log("移出pic4");
    }

    var pic1 = document.getElementById("pic1");
    var pic2 = document.getElementById("pic2");
    var pic3 = document.getElementById("pic3");
    var pic4 = document.getElementById("pic4");

    //这里存在歧义问题，移入2的同时移出了1，那么就会触发不同函数
    if(pic_number==="pic1"&&(!enter_pic2)&&(!enter_pic3)&&(!enter_pic4)&&(!click_pic1)){
        pic1.className = "pic1-mouse-out";
        pic2.className = "pic2-mouse-over-back";
        pic3.className = "pic3-mouse-over-back";
        pic4.className = "pic4-mouse-over-back";
    }else if(pic_number==="pic2"&&(!enter_pic1)&&(!enter_pic3)&&(!enter_pic4)&&(!click_pic2)){
        pic2.className = "pic2-mouse-out";
        pic3.className = "pic3-mouse-over-back";
        pic4.className = "pic4-mouse-over-back";
    }else if(pic_number==="pic3"&&(!enter_pic1)&&(!enter_pic2)&&(!enter_pic4)&&(!click_pic3)){
        pic3.className = "pic3-mouse-out";
        pic4.className = "pic4-mouse-over-back";
    }else if(pic_number==="pic4"&&(!enter_pic1)&&(!enter_pic2)&&(!enter_pic3)&&(!click_pic4)){
        pic4.className = "pic4-mouse-out";
    }
}

function pic1MouseOver () {
    picBig('pic1')
}
function pic1MouseOut (){
    picNormal('pic1')
}
function pic1Click (){
    showPic('pic1')
}
function pic2MouseOver () {
    picBig('pic2')
}
function pic2MouseOut (){
    picNormal('pic2')
}
function pic2Click (){
    showPic('pic2')
}
function pic3MouseOver () {
    picBig('pic3')
}
function pic3MouseOut (){
    picNormal('pic3')
}
function pic3Click (){
    showPic('pic3')
}
function pic4MouseOver () {
    picBig('pic4')
}
function pic4MouseOut (){
    picNormal('pic4')
}
function pic4Click (){
    showPic('pic4')
}

function resetPlace() {
    //隐藏返回按钮
    document.getElementById("back-button").style.display = "none";

    var pic1 = document.getElementById("pic1");
    var pic2 = document.getElementById("pic2");
    var pic3 = document.getElementById("pic3");
    var pic4 = document.getElementById("pic4");
    
    if(click_pic1){
        click_pic1 = false;
        pic1.style.zIndex = "1";

        pic1.className = "pic1-mouse-out";
        pic2.className = "pic2-mouse-over-back";
        pic3.className = "pic3-mouse-over-back";
        pic4.className = "pic4-mouse-over-back";

        pic2.addEventListener("mouseover",  pic2MouseOver);
        pic2.addEventListener("mouseout", pic2MouseOut);
        pic2.addEventListener("click", pic2Click);
        pic3.addEventListener("mouseover",  pic3MouseOver);
        pic3.addEventListener("mouseout", pic3MouseOut);
        pic3.addEventListener("click", pic3Click);
        pic4.addEventListener("mouseover",  pic4MouseOver);
        pic4.addEventListener("mouseout", pic4MouseOut);
        // pic4.addEventListener("click", pic4Click);

        console.log("添加成功");
    }else if(click_pic2){
        click_pic2 = false;
        pic2.style.zIndex = "2";

        pic2.className = "pic2-mouse-out";
        pic3.className = "pic3-mouse-over-back";
        pic4.className = "pic4-mouse-over-back";

        pic1.addEventListener("mouseover",  pic1MouseOver);
        pic1.addEventListener("mouseout", pic1MouseOut);
        pic1.addEventListener("click", pic1Click);
        pic3.addEventListener("mouseover",  pic3MouseOver);
        pic3.addEventListener("mouseout", pic3MouseOut);
        pic3.addEventListener("click", pic3Click);
        pic4.addEventListener("mouseover",  pic4MouseOver);
        pic4.addEventListener("mouseout", pic4MouseOut);
        // pic4.addEventListener("click", pic4Click);
    }else if(click_pic3){
        click_pic3 = false;
        pic3.style.zIndex = "3";

        pic3.className = "pic3-mouse-out";
        pic4.className = "pic4-mouse-over-back";

        pic1.addEventListener("mouseover",  pic1MouseOver);
        pic1.addEventListener("mouseout", pic1MouseOut);
        pic1.addEventListener("click", pic1Click);
        pic2.addEventListener("mouseover",  pic2MouseOver);
        pic2.addEventListener("mouseout", pic2MouseOut);
        pic2.addEventListener("click", pic2Click);
        pic4.addEventListener("mouseover",  pic4MouseOver);
        pic4.addEventListener("mouseout", pic4MouseOut);
        // pic4.addEventListener("click", pic4Click);
    }else if(click_pic4){
        click_pic4 = false;
        pic4.style.zIndex = "4";

        pic4.className = "pic4-mouse-out";

        pic1.addEventListener("mouseover",  pic1MouseOver);
        pic1.addEventListener("mouseout", pic1MouseOut);
        pic1.addEventListener("click", pic1Click);
        pic2.addEventListener("mouseover",  pic2MouseOver);
        pic2.addEventListener("mouseout", pic2MouseOut);
        pic2.addEventListener("click", pic2Click);
        pic3.addEventListener("mouseover",  pic3MouseOver);
        pic3.addEventListener("mouseout", pic3MouseOut);
        pic3.addEventListener("click", pic3Click);
    }
}

function showPic(pic_number) {
    //显现出返回按钮
    document.getElementById("back-button").style.display = "block";

    var pic1 = document.getElementById("pic1");
    var pic2 = document.getElementById("pic2");
    var pic3 = document.getElementById("pic3");
    var pic4 = document.getElementById("pic4");

    if (pic_number==="pic1") {
        if(!(click_pic1)){
            click_pic1 = true;
            pic1.style.zIndex = "99";
            console.log("点击了pic1");
            // pic2.removeEventListener("mouseover");
            pic2.removeEventListener("mouseover", pic2MouseOver);
            pic2.removeEventListener("mouseout", pic2MouseOut);
            pic2.removeEventListener("click", pic2Click);
            pic3.removeEventListener("mouseover", pic3MouseOver);
            pic3.removeEventListener("mouseout", pic3MouseOut);
            pic3.removeEventListener("click", pic3Click);
            pic4.removeEventListener("mouseover", pic4MouseOver);
            pic4.removeEventListener("mouseout", pic4MouseOut);
            // pic4.removeEventListener("click", pic4Click);
        }
    }else if(pic_number==="pic2"){
        if(!(click_pic2)){
            click_pic2 = true;
            pic2.style.zIndex = "99";
            console.log("点击了pic2");
            pic1.removeEventListener("mouseover", pic1MouseOver);
            pic1.removeEventListener("mouseout", pic1MouseOut);
            pic1.removeEventListener("click", pic1Click);
            pic3.removeEventListener("mouseover", pic3MouseOver);
            pic3.removeEventListener("mouseout", pic3MouseOut);
            pic3.removeEventListener("click", pic3Click);
            pic4.removeEventListener("mouseover", pic4MouseOver);
            pic4.removeEventListener("mouseout", pic4MouseOut);
            // pic4.removeEventListener("click", pic4Click);
        }
    }else if(pic_number==="pic3"){
        if(!(click_pic3)){
            click_pic3 = true;
            pic3.style.zIndex = "99";
            console.log("点击了pic3");
            pic1.removeEventListener("mouseover", pic1MouseOver);
            pic1.removeEventListener("mouseout", pic1MouseOut);
            pic1.removeEventListener("click", pic1Click);
            pic2.removeEventListener("mouseover", pic2MouseOver);
            pic2.removeEventListener("mouseout", pic2MouseOut);
            pic2.removeEventListener("click", pic2Click);
            pic4.removeEventListener("mouseover", pic4MouseOver);
            pic4.removeEventListener("mouseout", pic4MouseOut);
            // pic4.removeEventListener("click", pic4Click);
        }
    }else if(pic_number==="pic4"){
        //if判断pic4是否已经点击过，没有点击过则执行，点击过，则跳过
        if(!(click_pic4)){
            click_pic4 = true;
            pic4.style.zIndex = "99";
            console.log("点击了pic4");
            pic1.removeEventListener("mouseover", pic1MouseOver);
            pic1.removeEventListener("mouseout", pic1MouseOut);
            pic1.removeEventListener("click", pic1Click);
            pic2.removeEventListener("mouseover", pic2MouseOver);
            pic2.removeEventListener("mouseout", pic2MouseOut);
            pic2.removeEventListener("click", pic2Click);
            pic3.removeEventListener("mouseover", pic3MouseOver);
            pic3.removeEventListener("mouseout", pic3MouseOut);
            pic3.removeEventListener("click", pic3Click);
        }
    }
}