// 全局的存放的数组，即从将fetch到的数据存放进入此数组
let studentsList = [];

// 在网页onload的时候即调用的方法，先get到已经在json的contacts中存放的信息
function getStudents(){

    //FetchAPI
    //Fetch always return Promise with resolve

    //fetch到json-server所创建的本地数据集
    fetch('http://localhost:3000/contacts').then(response =>{
        //console.log(response);
        if(response.ok){
            //response是只能被读取一次的,console.log取一次，return取一次，会报错
            // console.log(response.json());

            // 如果fetch成功，则return json的数据
            return response.json();

        }
        // 对fetch失败的情况的判断反馈
        else{
            if(response.status === 404){
                return Promise.reject(new Error('InValid URL..'))
            }
            else if(response.status === 500){
                return Promise.reject(new Error('Some Internal Error Occured...'));
            }
            else if(response.status === 401){
                return Promise.reject(new Error('UnAuthorized User..'));
            }
        }

        // fetch成功后将反馈回的数组存入studentsList中
    }).then(studentsListResponse =>{
        //studentsListResponse是上一个then()return的promise的对象
        studentsList = studentsListResponse;
        // console.log('studentsList', studentsList);


        displayReposToHTML(studentsListResponse);
    }).catch(error =>{
        //错误处理，这里有一个疑问，上面的response.ok==false跟下面的error有什么区别呢？
        let errorEle = document.getElementById('errMessage');
        errorEle.innerText = error.message;
    })

}

//用来将json数据集studentsListResponse display到html界面中
function displayReposToHTML(studentsListResponse){
    //logic
    //console.log('Response',repositoriesList);
  // let tableEle =  document.getElementById('repo-list-table');

    //tableEle代表获取了html中的所有table标签的元素，但此html只有一个table，所以只需要返回数组第【0】个table
    let tableEle = document.getElementsByTagName('table')[0];

    //tbodyEle又代表获取table中的第一个tbody
    let tbodyEle = tableEle.getElementsByTagName('tbody')[0];
  //console.log(tbodyEle);
    let tbodyEleInnerHTMLString = '';

    //studentsListResponse即是一个数据集合，包含了json中contacts的所有数组元素，每一个数组元素由name，email，contactno属性组成
    //.forEach是一个集合列举函数，这里student即一个代称，每一个元素即传递给student
    //元素的属性也相应的传递给了student，则student.name；student.email；student.contactno即对应数据

    //注意，这里forEach也相当于遍历循环
    studentsListResponse.forEach(student =>{
   //     console.log(repo.web_url + '--'+repo.owner.username );
     tbodyEleInnerHTMLString += `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.contactno}</td>
                    <td><button class='btn btn-primary' onclick='showUpdateStudent(${student.id})'>Update</button></td>
                    <td ><i class='fa fa-trash' style='color:red;font-size:1.2em;cursor:pointer' onclick='deleteStudent(${student.id})'></i></td>
                </tr>
     `;   
    });

    // 将多个<tr>组成的html表单打印到上面get到的html的tbody处
    tbodyEle.innerHTML = tbodyEleInnerHTMLString;
}


//adding student to db
function addStudent(event){
    //用event.preventDefault()阻止按下submit时对表单的提交
    event.preventDefault();

  //  console.log('addStudent');
 let name =  document.getElementById('name').value;
 let email = document.getElementById('email').value;
 let contactno = document.getElementById('contactno').value;

 //将表单中的三个输入框中的内容打包为一个student对象，这个对象分别有下面三种属性和值
 let student = {
     name : name,
     email : email,
     contactno: contactno
 }

 //console.log(name + ' --' + email + " ---" + contactno);

    //fetch到本地json，参数method，post指提交；headers？？头定义
    //'content-type': 'application/json'这里的意思即post格式为json
  fetch('http://localhost:3000/contacts',{
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

  }).then(response =>{
      //response.ok即表示响应是否成功，布尔值
      if(response.ok){
          //成功即return回刚才的json文件（add student之后的）
          alert('Submit successfully!');
          self.location.href = "index.html";
          return response.json();
      }
      else{
          return Promise.reject(new Error('Some internal error occured...'))
      }
  }).then(addedStudent =>{
      //向console输出本次添加的student对象信息
      console.log('addedStudent -->', addedStudent);
    //   let tableEle = document.getElementsByTagName('table')[0];

    //   let tbodyEle = tableEle.getElementsByTagName('tbody')[0];

    //   console.log(tbodyEle.innerHTML);
        let tbodyEle = document.getElementById('table-body');
        // 输出已有的所有的student信息
        console.log(tbodyEle);
        
      
      
  }).catch(error=>{
    //ADd this to html
    let errorEle = document.getElementById('errMessage');
        errorEle.innerText = error.message;
  })
}

function deleteStudent(id){
    console.log('delete Student--',id);
    
    fetch(`http://localhost:3000/contacts/${id}`,{
        method:'DELETE'
    }).then(response =>{
        if(response.ok){
            alert('Delete successfully!');
            self.location.href = 'index.html';
            return response.json();
        }
    }).then(result =>{
        console.log('result from delete',result);
        //write the code for DOM manipulation
    })
}

// 设置一个全局变量负责id的传参
var id_pass;

function showUpdateStudent(id) {

    //每次清空用于选出 放置placeholder 的数组中的 指定id的内容 的数组
    let showUpdateStudentsList = [];

    var div1 = document.getElementById("update");

    div1.style.display = "block";

    document.getElementById('body').style.overflow = "hidden";
    // document.getElementById('body').style.height = "100%";

    //用于传参给updateStudent（）
    id_pass = id;

    fetch('http://localhost:3000/contacts').then(response =>{
        //console.log(response);
        if(response.ok){
            // console.log(response.json());

            // 如果fetch成功，则return json的数据
            return response.json();
        }
        // 对fetch失败的情况的判断反馈
        else{
            if(response.status === 404){
                return Promise.reject(new Error('InValid URL..'))
            }
            else if(response.status === 500){
                return Promise.reject(new Error('Some Internal Error Occured...'));
            }
            else if(response.status === 401){
                return Promise.reject(new Error('UnAuthorized User..'));
            }
        }

        // fetch成功后将反馈回的数组存入studentsList中
    }).then(studentsListResponse =>{
        showUpdateStudentsList = studentsListResponse;
        // console.log('studentsList', studentsList);
        // console.log(showUpdateStudentsList.length);

        //要对showUpdateStudentsList的内容进行选择
        for(let i = 0 ; i<showUpdateStudentsList.length ; i++){
            if(id === showUpdateStudentsList[i].id){
                document.getElementById("updateName").value = showUpdateStudentsList[i].name;
                document.getElementById("updateEmail").value  = showUpdateStudentsList[i].email;
                document.getElementById("updateContactno").value  = showUpdateStudentsList[i].contactno;
            }
        }
    })


}

function updateStudent(event) {

    event.preventDefault();

    //更新的数据
    let updateName =  document.getElementById('updateName').value;
    let updateEmail = document.getElementById('updateEmail').value;
    let updateContactno = document.getElementById('updateContactno').value;

    //更新的数据块
    let student = {
        name : updateName,
        email : updateEmail,
        contactno: updateContactno
    }

    //fetch 到当前点击更新的这一列数据，并取到它的值


    fetch(`http://localhost:3000/contacts/${id_pass}`).then(response =>{
        //console.log(response);
        if(response.ok){
            response.json().then(date => {
                // console.log('this is',date.email);

                // 对提交的数据进行判断是否前后相同
                if (updateName === date.name &&
                    updateEmail === date.email &&
                    updateContactno === date.contactno) {
                    alert('请输入两次不一样的数据！')
                } else {

                    fetch(`http://localhost:3000/contacts/${id_pass}`,{
                        method:'put',
                        headers:{
                            'content-type': 'application/json'
                        },
                        body:JSON.stringify(student)
                    }).then(response =>{
                        //console.log(response);
                        if(response.ok){
                            alert("更新完成！");
                            //刷新之后更新此页面
                            self.location.href="index.html";
                            return response.json();
                        }
                        else{
                            return Promise.reject(new Error('Some internal error occured...'))
                        }
                    })

                }
            })
        }
    })
}

function cancelUpdate() {
    var div1 = document.getElementById("update");

    div1.style.display = "none";

    document.getElementById('body').style.overflow = "scroll";
}
    // fetch(`http://localhost:3000/contacts/${id_pass}`,{
    //     method:'put',
    //     headers:{
    //         'content-type': 'application/json'
    //     },
    //     body:JSON.stringify(student)
    // }).then(response =>{
    //     //console.log(response);
    //     if(response.ok){
    //         response.json().then(date =>{
    //             // console.log('this is',date.email);
    //
    //             // 对提交的数据进行判断是否前后相同
    //             if(updateName === date.name &&
    //                 updateEmail === date.email &&
    //                 updateContactno === date.contactno){
    //                 alert('请输入两次不一样的数据！')
    //             }else {
    //
    //                 // 这里直接修改fetch到的数据是不可以的，这里fetch的数据是只读流
    //                 // body stream is locked
    //                 date.name = updateName;
    //                 date.email = updateEmail;
    //                 date.contactno = updateContactno;
    //
    //
    //                 //将更新的数据post上去
    //
    //                 //更新的数据块
    //                 let student = {
    //                     name : updateName,
    //                     email : updateEmail,
    //                     contactno: updateContactno
    //                 }
    //                 //
    //                 // // 刷新页面即可，刷新会触发Onload()的getStudents(),则就显示出update的数据
    //                 // fetch('http://localhost:3000/contacts',{
    //                 //     method: 'POST',
    //                 //     headers:{
    //                 //         'content-type': 'application/json'
    //                 //     },
    //                 //
    //                 //     //JSON.stringify()把JavaScript对象序列化为JSON字符串
    //                 //     //body后的为请求参数
    //                 //     body:JSON.stringify(student)
    //                 //     //即将student对象转化为json字符串之后post（添加）到本地的json文件（上方的链接中
    //                 //
    //                 // }).then(response =>{
    //                 //     //console.log(response);
    //                 //     if(response.ok) {
    //                 //         alert('更新成功！');
    //                 //
    //                 //         //删掉之前的数据流
    //                 //         deleteStudent(id_pass);
    //                 //     }
    //                 // })
    //             }//else结束，即更新结束
    //
    //         });
    //
    //         // console.log(response.json());
    //         // return response.json();
    //     }
    // }).catch(error =>{
    //     let errorEle = document.getElementById('errMessage');
    //     errorEle.innerText = error.message;
    // })
