let selectedBg = ""
let posts = []
let editingId = null

function selectImg(path) {
  selectedBg = path
  let images = document.getElementsByClassName("bgImg")
  for (let i = 0; i < images.length; i++) {
    images[i].className = "bgImg" 
  }
  event.target.classList.add("selectedImg")
}

function post() {
  let title = document.getElementById("title").value
  let desc = document.getElementById("description").value
  let color = document.getElementById("textColor").value
  let font = document.getElementById("fontFamily").value
  let size = document.getElementById("fontSize").value

  if (!title || !desc) {
    Swal.fire('Oops!', 'Title and description are required', 'warning')
    return
  }
    let newPost = {
      id: Date.now(),
      title, desc, color, font, size,
      bg: selectedBg
    }
    posts.push(newPost)

  savePosts()
  renderPosts()
  clearForm()
}

function savePosts() {
  localStorage.setItem("posts", JSON.stringify(posts))
}

function loadPosts() {
  let saved = localStorage.getItem("posts")
  if (saved) {
    posts = JSON.parse(saved)
  }
}

function renderPosts() {
  let container = document.getElementById('posts')
  container.innerHTML = ""

  for (let i = posts.length - 1; i >= 0; i--) {
    let p = posts[i]
    container.innerHTML += `
      <div class="post-card">
        <div class="post-card-bg" 
             style="background-image: url('${p.bg}')">
        </div>
        <div class="post-card-body">
          <p class="post-card-title"
             style="color:${p.color}; 
                    font-family:${p.font}; 
                    font-size:${p.size}px;">
            ${p.title}
          </p>
          <p class="post-card-desc">${p.desc}</p>
          <div class="post-card-actions">
            <button class="btn-edit" 
                    onclick="editPost(${p.id})">Edit</button>
            <button class="btn-delete" 
                    onclick="deletePost(${p.id})">Delete</button>
          </div>
        </div>
      </div>
    `
  }
}

function editPost(id) {
  let allPosts = JSON.parse(localStorage.getItem('posts')) || []
  let post = null

  for (let i = 0; i < allPosts.length; i++) {
    if (allPosts[i].id === id) {
      post = allPosts[i]
      allPosts.splice(i, 1)  
      break
    }
  }

  document.getElementById('title').value = post.title
  document.getElementById('description').value = post.desc
  document.getElementById('textColor').value = post.color
  document.getElementById('fontFamily').value = post.font
  document.getElementById('fontSize').value = post.size
  selectedBg = post.bg

  localStorage.setItem('posts', JSON.stringify(allPosts))  
  posts = allPosts                                         

  document.getElementById('postbtn').innerText = 'Update'
  renderPosts() 
}

function deletePost(id) {
  Swal.fire({
    title: 'Are you sure you want to delete this post?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it'
  }).then(result => {
    if (result.isConfirmed) {
      let newPosts = []
      for (let i = 0; i < posts.length; i++) {
        if (posts[i].id !== id) {
          newPosts.push(posts[i])
        }
      }
      posts = newPosts
      savePosts()
      renderPosts()
    }
  })
}

function clearForm() {
  document.getElementById('title').value = ""
  document.getElementById('description').value = ""
  selectedBg = ""
  let images = document.getElementsByClassName("bgImg")
  for (let i = 0; i < images.length; i++) {
    images[i].className = "bgImg"
  }
}

loadPosts()
renderPosts()
// document.getElementById('welcomeUser').innerText = "Hi, " + loggedInUser + "!"

function signup() {
  let email = document.getElementById('signupEmail').value.trim()
  let password = document.getElementById('signupPassword').value.trim()

  if (!email || !password) {
    Swal.fire('Oops!', 'Please enter both email and password', 'warning')
    return
  }

  let users = JSON.parse(localStorage.getItem('users')) || []

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      Swal.fire('Oops!', 'This email is already registered', 'error')
      return
    }
  }
  users.push({ email: email, password: password })
  localStorage.setItem('users', JSON.stringify(users))

  Swal.fire('', 'Your account has been created!', 'success')
  showLogin() 
}

function login() {
  let email = document.getElementById('loginEmail').value.trim()
  let password = document.getElementById('loginPassword').value.trim()

  if (!email || !password) {
    Swal.fire('Oops!', 'Please enter both email and password', 'warning')
    return
  }

  let users = JSON.parse(localStorage.getItem('users')) || []

  let foundUser = null
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      foundUser = users[i]
      break
    }
  }

  if (foundUser) {
    localStorage.setItem('loggedInUser', foundUser.email)
    showApp() 
  } else {
    Swal.fire('Error!', 'Email or password is incorrect', 'error')
  }
}

function logout() {
  localStorage.removeItem('loggedInUser')
  showAuth() 
}

function showApp() {
  document.getElementById('authSection').style.display = 'none'
  document.getElementById('mainApp').style.display = 'block'

  let user = localStorage.getItem('loggedInUser')
  document.getElementById('welcomeUser').innerText = 'Hi, ' + user + '!'
  
  loadPosts()
  renderPosts()
}

function showAuth() {
  document.getElementById('authSection').style.display = 'block'
  document.getElementById('mainApp').style.display = 'none'
  document.getElementById('welcomeUser').innerText = ''
}

function showSignup() {
  document.getElementById('loginForm').style.display = 'none'
  document.getElementById('signupForm').style.display = 'block'
}

function showLogin() {
  document.getElementById('signupForm').style.display = 'none'
  document.getElementById('loginForm').style.display = 'block'
}

let loggedInUser = localStorage.getItem('loggedInUser')

if (loggedInUser) {
  showApp()  
} else {
  showAuth() 
}
var imageUploader = document.getElementById('imageUploader');
var imagePreview = document.getElementById('imagePreview');
imageUploader.addEventListener('change', function() {
    var file = imageUploader.files[0];
    console.log(file);
    
    if (file) {
        var reader = new FileReader();
        console.log(reader);
        
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            console.log(reader);
             imagePreview.classList.remove('d-none');
             selectedBg = e.target.result
            
        }
        reader.readAsDataURL(file);
    }
});