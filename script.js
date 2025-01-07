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

// web app's Firebase configuration (copy&pasted from firestore configs)
const firebaseConfig = {
  apiKey: "AIzaSyAX4QpdbnZN93m-JdF9pYriCTFzwmLphY",
  authDomain: "vini-oldagram.firebaseapp.com",
  projectId: "vini-oldagram",
  storageBucket: "vini-oldagram.appspot.com",
  messagingSenderId: "190841291304",
  appId: "1:190841291304:web:90655405cc1ab4857ad31d",
};

const app = initializeApp(firebaseConfig); // Initialize Firebase
const db = getFirestore(app); // Initialize Firestore
const postsRef = collection(db, "posts"); // Reference the 'posts' collection. Firebase treats them as "documents"
const oldagram = document.querySelector(".oldagram");

// Arrow function. Works similarly to a traditional function but it seems better suited for modern JavaScript. It doesn't need a "return" if there's just 1 expression, which here is the "template string" that goes in the DOM to display the interactive buttons. It is also declared with a "const" instead of "function". Traditional functions are still preferable for more complex functions, which this one is not.
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

// using an async function in this event listening so I have access to the "await" keyword. With the "await" I'm able to "pause" the function while it retrieves data from firestore database. When this event listener was a regular function, all I was retrieving from the database was a "promise" not the data itself that I wanted. And so trying to use that data was giving me errors since I didn't have data to use, I was using only the promise. Promises become either resolved or errors. In my case without the "await" they were errors.
oldagram.addEventListener("click", async (e) => {
  const likeButton = e.target.closest(".like-btn"); //checks if what was clicked or its parent has the class that is inside the selector of .closest()
  if (likeButton) {
    const postId = likeButton.dataset.id; // Get the document ID which is the id from the data-id attritubte in the html. Not the database ID. However, the code later is the one that "coincidently" used the ID from the firestore document to also be the id for the data-id
    
    // Reference the document in Firestore
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef); // fetches the document data: object, metadata etc..

    if (postSnap.exists()) {
      const postData = postSnap.data(); // Get document actual data, that which was inserted in the fields.
      const isLiked = postData.liked; // has the value of the field "liked" which is either true or false.
      let currentLikes = postData.likes; // Get the current number of likes from firestore's document>field

      // Toggle the `liked` field and update `likes`
      if (!isLiked) {
        currentLikes++;
        await updateDoc(postRef, { liked: true, likes: currentLikes });
        likeButton.querySelector("img").src = "img/pink-icon-heart.png";
      } else {
        // currentLikes++ seems a lot nicer to read than currentLikes--. However, I wanted to try using it.
        currentLikes--;
        await updateDoc(postRef, { liked: false, likes: currentLikes });
        likeButton.querySelector("img").src = "img/icon-heart.png";
      }

      // Update the likes count in the UI by first locating the html element with the class="likes-icon" that's wrapped inside a strong tag.
      const likesElement = likeButton.closest(".post-footer").querySelector(".likes-icon strong");
      // textContent here seems to be more appropriate since there are no HTML tags being sent. As opposed to my other InnerHTML expressions where I did send HTML tags to manipulate the DOM
      likesElement.textContent = `${currentLikes} likes`;
    } else {
      // this is suppose to never happen. But seemed like a nice little precaution to add.
      console.error("No such document!");
    }
  }
});


// Fetch all posts from Firestore. Async functions for the function to work asynchronously. It returns a promise and allows for the use of "await" which pauses the function until the promise is either resolved or returns an error.
async function getPosts() {
  const querySnapshot = await getDocs(postsRef); // Fetch documents from the collection "posts" of the database I declared way above.
  let finalPostHTML = ``; // this is to avoid manipulating the DOM for each instance of the forEach statement below. 

   querySnapshot.forEach((doc) => {
    const post = doc.data(); // Get document data
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