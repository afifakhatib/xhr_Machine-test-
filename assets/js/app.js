let cl = console.log;

const postForm = document.getElementById('postForm')
const postContainer = document.getElementById('postContainer')
const titlecontrol = document.getElementById('titlecontrol')
const bodycontrol = document.getElementById('bodycontrol')
const userIdcontrol = document.getElementById('userIdControl')
const submitBtn = document.getElementById('submitBtn')
const updateBtn = document.getElementById("updateBtn")
const loader = document.getElementById('loader')



//  baseUrl 

const baseUrl = `https://jsonplaceholder.typicode.com`
const postUrl = `${baseUrl}/posts`

// const submitUpdateToggle = () => {
//     submitBtn.classList.toogle('d-none')
//     updateBtn.classList.toggle('d-none')
// }

const loadertoggle = () => {
    loader.classList.toggle('d-none')
}

const snackBar = (msg , icon , timer) => {
    swal.fire({
        title : msg ,
        icon  : icon,
        timer : timer 
    })
}

// generic function for calling api 

const toMakeAPIcall = (methodName , apiUrl, msgbody = null) => {
    let xhr = new XMLHttpRequest()
    xhr.open(methodName , apiUrl)
    xhr.send(JSON.stringify(msgbody))
    xhr.onload = function() {
        // res = gives data from DB or server side 
        let res = JSON.parse(xhr.response)
        cl(res)
        // for GET() CONFIGUARATION 
        if(methodName === 'GET'){
            // if we are have multiple array/data 
            if(Array.isArray(res)){
                loadertoggle()
            // then we have to call templating 
             templating(res.reverse())
             loadertoggle()
            }else{
            //  for patching single obj to input controls 
            titlecontrol.value = res.title;
            bodycontrol.value = res.body;
            userIdcontrol.value = res.userId;
            // submitUpdateToggle()
            submitBtn.classList.add('d-none')
            updateBtn.classList.remove('d-none')
            loadertoggle()
            }
        }
        else if(methodName === 'POST'){
            let card = document.createElement('div')
            card.classList = 'card mt-4'
            card.id = res.id
            cl(card.id)
            card.innerHTML = `
            <div class="card-header">
            <h3>${msgbody.title}</h3>
        </div>
        <div class="card-body">
            <p>${msgbody.body}</p>
        </div>
        <div class="card-footer">
            <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
            <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
        </div>
                          `
           postContainer.prepend(card);
           postForm.reset()
           loadertoggle()
           snackBar('new post is created' , 'success', 2000)
        }
        else if(methodName === 'PATCH'){
            let card = [...document.getElementById(res.id).children]
            card[0].innerHTML =  `<h3>${msgbody.title}</h3>`;
            card[1].innerHTML = `<p>${msgbody.body}</p>`
            
            // submitUpdateToggle()
            submitBtn.classList.remove('d-none')
            updateBtn.classList.add('d-none')
            postForm.reset()
            loadertoggle()
            snackBar('post is updateted successfully !!!', 'success' , 2000)
        }
        else if(methodName === 'DELETE'){
            let id = localStorage.getItem("deleteId")
            cl(id)
            document.getElementById(id).remove()
            loadertoggle()
            snackBar(`post is deleted successully `, 'success', 2000)
        }

    }
}

const templating = (arr) => {
    postContainer.innerHTML = arr.map(obj => {

        return ` 
        <div class="card mt-4" id=${obj.id}>
        <div class="card-header">
            <h3>${obj.title}</h3>
        </div>
        <div class="card-body">
            <p>${obj.body}</p>
        </div>
        <div class="card-footer">
            <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
            <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
        </div>
    </div>
                `
    }).join('')

}

toMakeAPIcall('GET' , postUrl)

const onEdit = (ele) => {
    let editId = ele.closest('.card').id
    //  editUrl 
    localStorage.setItem("editId",editId)
    let editUrl = `${baseUrl}/posts/${editId}`
    loadertoggle()
    toMakeAPIcall('GET',editUrl)
}

const onUpdatePost = () => {
     let updateId = localStorage.getItem('editId')
     cl(updateId)
     let updateUrl = `${baseUrl}/posts/${updateId}`
     let updatedObj = {
        title : titlecontrol.value,
        body : bodycontrol.value,
        userId : userIdcontrol.value
     }
     cl(updatedObj)
     loadertoggle()
     toMakeAPIcall('PATCH', updateUrl ,updatedObj);
     
}

const onDelete = (ele) => {
     let deleteId = ele.closest('.card').id
    //  cl(DeleteId)
    localStorage.setItem('deleteId', deleteId)
    let deleteUrl = `${baseUrl}/posts/${deleteId}`
    Swal.fire({
        title: "Are you sure? do ypu wnat to delete it ",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            loadertoggle()
         toMakeAPIcall('DELETE', deleteUrl)
        }
      });
}

const onAddPost = (e) => {
    e.preventDefault();
    let postObj = {
        title : titlecontrol.value,
        body : bodycontrol.value,
        userId : userIdcontrol.value
    }
    cl(postObj)
    loadertoggle()
    toMakeAPIcall('POST' , postUrl , postObj)
}

postForm.addEventListener('submit', onAddPost)
updateBtn.addEventListener('click' , onUpdatePost);
