// Import Firebase app and Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAX4QpdbnZN93m-JdF9pYriCTFzwmLphY",
  authDomain: "vini-oldagram.firebaseapp.com",
  projectId: "vini-oldagram",
  storageBucket: "vini-oldagram.appspot.com",
  messagingSenderId: "190841291304",
  appId: "1:190841291304:web:90655405cc1ab4857ad31d",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore
// Reference the 'posts' collection
const postsRef = collection(db, "posts");
const likeBtn = 'src="img/icon-heart.png"'; //unnecessarily used for now.
// turn likeBtnLiked between true and false for users to like and remove their liked inside an event listener for click
let likeBtnLiked = false; //unused
const interactiveIcons = `
<div class="icons-wrapper">
    <button id="like-btn" class="icon-btn">
        <img class="interactive-icon" ${likeBtn} alt="Heart-shapped like button."/>
    </button>
    <button class="icon-btn">
        <img class="interactive-icon" src="img/icon-comment.png" alt="dialogue-balloon-shapped comment button."/>
    </button>
    <button class="icon-btn">
        <img class="interactive-icon" src="img/icon-dm.png" alt="Paperplane-shapped share button."/>
    </button>
</div>
`;

// Fetch all posts from Firestore. Async functions for the function to work asynchronously. It returns a promise and allows for the use of "await" which pauses the function until the promise is either resolved or returns an error.
async function getPosts() {
  const querySnapshot = await getDocs(postsRef); // Fetch documents from the collection
  const oldagram = document.querySelector(".oldagram"); // Find the container for posts
  let finalPostHTML = ``;
  //  console.log(querySnapshot.size);
  //  console.log(querySnapshot.docs);
  //  note to self: study firebase harder. I couldn't console.log the information above despite trying everything I could with the knowledge I have now.
  querySnapshot.forEach((doc) => {
    const post = doc.data(); // Get document data

    // console.log("Post data:", post);
    // the console.log above returns data with the "Post data:" added to it but it doesn't witout. I couldn't comprehend why. Apparently the console keeps the information hidden for some reason. Research more about it.
    // Create the HTML structure for each post
    const postHTML = `
        <section class="post">
          <header class="post-header">
            <img class="avatar-img" src="${post.avatar}" alt="${post.name}'s avatar">
            <div class="name-and-location">
              <p class="name">${post.name}</p>
              <p class="location">${post.location}</p>
            </div>
          </header>
          <figure>
            <img class="post-img" src="${post.post}" alt="Post by ${post.name}">
          </figure>
          <footer class="post-footer">
            ${interactiveIcons}
            <p class="likes-icon"><strong>${post.likes} likes</strong></p>
            <p><strong>${post.username}</strong> ${post.comment}</p>
          </footer>
        </section>
      `;

    // Append the post HTML to the Oldagram container
    finalPostHTML += postHTML;
  });
  oldagram.innerHTML = finalPostHTML;
}

// Call the function to display the posts
getPosts();
