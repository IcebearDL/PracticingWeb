// 全局的存放的数组，即从将fetch到的数据存放进入此数组
let studentsList = [];
const URL = 'http://localhost:3000/contacts';

//这里用typescript的用法，面向对象，定义了一个callRestAPI的函数
//async 声明定义一个异步函数，参数url，opt，opt参数可为空，
//这个函数即将ajax 的 fetch包装起来使用
const callFetchAPI = async (url , opt = {})=>{
    return await fetch(url,opt).then(response =>{
        if(response.ok){
            return response.json();
        }
        return Promise.reject(new Error('Dummy error from server'));
    });
};

// 在网页onload的时候即调用的方法，先get到已经在json的contacts中存放的信息
const getStudents = () => {
    callFetchAPI(URL).then( resp =>{
        studentsList = resp;
        displayStudentsToHTML(studentsList);
    }).catch(error =>{
        let errorEle = document.getElementById('errMessage');
        errorEle.innerText = error.message;
    })
};

//用来将json数据集studentsListResponse display到html界面中
const displayStudentsToHTML = async (studentsList) => {
    let htmlString = '';
    //注意，这里forEach也相当于遍历循环
    studentsList.forEach(student => {
        htmlString += `
        <tr>
            <td style="vertical-align: middle">${student.name}</td>
            <td style="vertical-align: middle">${student.email}</td>
            <td style="vertical-align: middle">${student.studentNum}</td>
            <td style="vertical-align: middle"><button class='btn btn-primary' onclick='showUpdateStudent("${student.id}","${student.name}", "${student.email}","${student.studentNum}")'>Update</button></td>
            <td style="vertical-align: middle"><i class='fa fa-trash' style='color:red;font-size:1.2em;cursor:pointer' onclick='deleteStudent(${student.id})'></i></td>
        </tr>
		`;
        //此时onclick传多个值
    });
    let tableEle = document.getElementsByTagName('table')[0];
    let tbodyEle = tableEle.getElementsByTagName('tbody')[0];
    tbodyEle.innerHTML = htmlString;
};

//adding student to db
function addStudent(event){
    //用event.preventDefault()阻止按下submit时对表单的提交
    event.preventDefault();

  //  console.log('addStudent');
 let name =  document.getElementById('name').value;
 let email = document.getElementById('email').value;
 let studentNum = document.getElementById('studentNum').value;

 //将表单中的三个输入框中的内容打包为一个student对象，这个对象分别有下面三种属性和值
 let student = {
     name : name,
     email : email,
     studentNum: studentNum
 };

 callFetchAPI(URL,{
     //method-get	请求指定的页面信息，并返回实体主体。
     //method-post 向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。
     // POST请求可能会导致新的资源的建立和/或已有资源的修改。
     //method-put 从客户端向服务器传送的数据取代指定的文档的内容。
     // 注意 GET 或 HEAD 方法的请求不能包含 body 信息。

     method: 'POST',
     headers:{
         'content-type': 'application/json'
     },

     //JSON.stringify()把JavaScript对象序列化为JSON字符串
     //body后的为请求参数
     body:JSON.stringify(student)
     //这里请求的body信息是转化为json格式的（原本为js对象）student
     //即将student对象转化为json字符串之后post（添加）到本地的json文件（上方的链接中

 }).then(()=>{
     document.getElementById('InfoText').className = 'text-success';
     document.getElementById("InfoText").innerText = 'Add Successfully!';
     $('#exampleModal1').modal('show');
     getStudents();
 }).catch(error=>{
     //add this error to html
     let errorEle = document.getElementById('errMessage');
     errorEle.innerText = error.message;
 });
}

function deleteStudent(id){
    //第一步，先删现在studentsList数组的值,第二步删后台数据，第三步局部刷新
    //这些都集成到了getStudents中，可直接用

    callFetchAPI(`http://localhost:3000/contacts/${id}`,{
        method:'DELETE'
    }).then(result=>{
        document.getElementById('InfoText').className = 'text-danger';
        document.getElementById("InfoText").innerText = 'Delete Successfully!';
        $('#exampleModal1').modal('show');
        getStudents();
    });
}

// 设置一个全局变量负责id的传参
var id_pass;

function showUpdateStudent(id,name,email,studentNum) {
    //可同时传递多个参数

    $('#Model1').modal('show');

    //这里使用jquery的属性赋值选择
    $('#updateName').attr('value',name);
    $('#updateEmail').attr('value',email);
    $('#updateStudentNum').attr('value',studentNum);

    id_pass = id;
}

function updateStudent(event) {

    event.preventDefault();

    //更新的数据
    let updateName =  document.getElementById('updateName').value;
    let updateEmail = document.getElementById('updateEmail').value;
    let updateStudentNum = document.getElementById('updateStudentNum').value;

    //更新的数据块
    let student = {
        name : updateName,
        email : updateEmail,
        studentNum: updateStudentNum
    };

    //fetch 到当前点击更新的这一列数据，并取到它的值
    callFetchAPI(`http://localhost:3000/contacts/${id_pass}`).then(date=>{
        if (updateName === date.name &&
            updateEmail === date.email &&
            updateStudentNum === date.studentNum) {
            document.getElementById('InfoText').className = 'text-danger';
            document.getElementById("InfoText").innerText = 'Please enter different data twice!';
            $('#exampleModal1').modal('show');
        }else {
            callFetchAPI(`http://localhost:3000/contacts/${id_pass}`,{
                method:'put',
                headers:{
                    'content-type': 'application/json'
                },
                body:JSON.stringify(student)
            }).then(()=>{
                document.getElementById('InfoText').className = 'text-success';
                document.getElementById("InfoText").innerText = 'Update Successfully!';
                $('#exampleModal1').modal('show');
                $('#Model1').modal('hide');
                getStudents();
            })
        }
    });
}

let searchType = null;

function setSearchType(type) {
    searchType = type;
    document.getElementById('searchTips').innerText = 'The searchType is ' + type;
    document.getElementById('searchInput').placeholder = 'Your searchType is ' + type;
}

function searchStudent(event) {
    //表单提交会默认刷新，阻止提交刷新
    event.preventDefault();

    let searchList = [];
    let searchValue = document.getElementById('searchInput').value;
    switch (searchType) {
        case null:
            document.getElementById('InfoText').className = 'text-danger';
            document.getElementById("InfoText").innerText = 'Please pick your Search category first！';
            $('#exampleModal1').modal('show');
            break;
        case 'typeName':
            callFetchAPI(URL).then(studentsList=> {
                searchList = studentsList.filter(student => {
                    return student.name.indexOf(searchValue) > -1;
                });
                if(searchList.length === 0){
                    document.getElementById('InfoText').className = 'text-danger';
                    document.getElementById("InfoText").innerText = 'Query results do not exist!';
                    $('#exampleModal1').modal('show');
                    document.getElementById('searchWarning').innerText = 'Query results do not exist,Please search again!';
                }else {
                    document.getElementById('InfoText').className = 'text-success';
                    document.getElementById("InfoText").innerText = 'Search Successfully!';
                    $('#exampleModal1').modal('show');
                    displayStudentsToHTML(searchList);
                }
            });
            break;
        case 'typeEmail':
            callFetchAPI(URL).then(studentsList=> {
                searchList = studentsList.filter(student => {
                    return student.email.indexOf(searchValue) > -1;
                });
                if(searchList.length === 0){
                    document.getElementById('InfoText').className = 'text-danger';
                    document.getElementById("InfoText").innerText = 'Query results do not exist!';
                    $('#exampleModal1').modal('show');
                    document.getElementById('searchWarning').innerText = 'Query results do not exist,Please search again!';
                }else {
                    document.getElementById('InfoText').className = 'text-success';
                    document.getElementById("InfoText").innerText = 'Search Successfully!';
                    $('#exampleModal1').modal('show');
                    displayStudentsToHTML(searchList);
                }
            });
            break;
        case 'typeStudentNum':
            //利用数组filter遍历方法返回相应值的student
            callFetchAPI(URL).then(studentsList=> {
                searchList = studentsList.filter(student => {
                    return student.studentNum.indexOf(searchValue) > -1;
                });
                if(searchList.length === 0){
                    document.getElementById('InfoText').className = 'text-danger';
                    document.getElementById("InfoText").innerText = 'Query results do not exist!';
                    $('#exampleModal1').modal('show');
                    document.getElementById('searchWarning').innerText = 'Query results do not exist,Please search again!';
                }else {
                    document.getElementById('InfoText').className = 'text-success';
                    document.getElementById("InfoText").innerText = 'Search Successfully!';
                    $('#exampleModal1').modal('show');
                    displayStudentsToHTML(searchList);
                }
            });
            break;
    }
}