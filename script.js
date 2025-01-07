// Import Firebase app and Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc   // needed for updating Firestore. Works similarly to "set()"
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

const oldagram = document.querySelector(".oldagram");
const interactiveIcons = (docId) => `
  <div class="icons-wrapper">
    <button class="icon-btn like-btn" data-id="${docId}">
      <img class="interactive-icon" src="img/icon-heart.png" alt="Heart-shaped like button"/>
    </button>
    <button class="icon-btn">
      <img class="interactive-icon" src="img/icon-comment.png" alt="Comment button" />
    </button>
    <button class="icon-btn">
      <img class="interactive-icon" src="img/icon-dm.png" alt="Share button" />
    </button>
  </div>
`;

// Call the function to display the posts
getPosts();

const heroHeader = document.querySelector(".hero-header");
heroHeader.addEventListener("click", (e)=>{
console.log("Header clicked");

});

oldagram.addEventListener("click", async (e) => {
  const likeButton = e.target.closest(".like-btn"); // Check if the clicked element is a like button
  if (likeButton) {
    const postId = likeButton.dataset.id; // Get the document ID
    console.log("Liked post ID:", postId);

    // Reference the document in Firestore
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data(); // Get document data
      const isLiked = postData.liked; // Check if the post is currently liked
      let currentLikes = postData.likes; // Get the current number of likes

      // Toggle the `liked` field and update `likes`
      if (!isLiked) {
        currentLikes += 1; // Increment likes
        await updateDoc(postRef, { liked: true, likes: currentLikes });
        likeButton.querySelector("img").src = "img/pink-icon-heart.png"; // Pink heart
      } else {
        currentLikes -= 1; // Decrement likes
        await updateDoc(postRef, { liked: false, likes: currentLikes });
        likeButton.querySelector("img").src = "img/icon-heart.png"; // Outline heart
      }

      // Update the likes count in the UI
      const likesElement = likeButton.closest(".post-footer").querySelector(".likes-icon strong");
      likesElement.textContent = `${currentLikes} likes`;
    } else {
      console.error("No such document!");
    }
  }
});


// Fetch all posts from Firestore. Async functions for the function to work asynchronously. It returns a promise and allows for the use of "await" which pauses the function until the promise is either resolved or returns an error.
async function getPosts() {
  const querySnapshot = await getDocs(postsRef); // Fetch documents from the collection
  let finalPostHTML = ``;
   console.log("Log 1: " + querySnapshot.size);
   console.log("Log 2: " + querySnapshot.docs);

   querySnapshot.forEach((doc) => {
    const post = doc.data(); // Get document data
    console.log(post);
    console.log(doc.id); // does work as expected. ChatGPT if possible change only this line
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
                ${interactiveIcons(doc.id)}
                <p class="likes-icon"><strong>${post.likes} likes</strong></p>
                <p><strong>${post.username}</strong> ${post.comment}</p>
            </footer>
        </section>
    `;
    finalPostHTML += postHTML;
  });
  oldagram.innerHTML = finalPostHTML;
}


