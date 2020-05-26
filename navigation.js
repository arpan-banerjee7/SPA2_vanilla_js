(function () {
  // A global variable storing the cached partial HTML pages.
  var partialsCache = {};
  // Sets the "active" class on the active navigation link.
  setActiveLink = (fragmentId) => {
    var navbarDiv = document.getElementById("navitem");
    links = navbarDiv.children;
    for (let i = 0; i < links.length; i++) {
      link = links[i];
      pageName = link.getAttribute("href").substr(1);
      if (pageName === fragmentId) {
        link.setAttribute("class", "active");
      } else {
        link.removeAttribute("class");
      }
    }
  };

  // Updates dynamic content based on the fragment identifier.
  navigate = () => {
    var contentDiv = document.getElementById("content"),
      // Isolate the fragment identifier using substr.
      // This gets rid of the "#" character.
      fragmentId = location.hash.substr(1);
    // Content for each navigation link.

    // Toggle the "active" class on the link currently navigated to.
    setActiveLink(fragmentId);
    // Set the "content" div innerHTML based on the fragment identifier.
    //contentDiv.innerHTML = getContent(fragmentId);
    getContent(fragmentId, function (content) {
      contentDiv.innerHTML = content;
    });
  };

  // Gets the appropriate content for the given fragment identifier.
  //   getContent = (fragment) => {
  //     var partials = {
  //       home: "This is the Home page. Welcome to my site.",
  //       about: "This is the About page.",
  //       contact: "This is the Contact page.",
  //     };
  //     return partials[fragment];
  //   };

  // function getContent(fragmentId, callback){

  //     // Content for each navigation link.
  //     var partials = {
  //       home: "This is the Home page. Welcome to my site.",
  //       about: "This is the About page.",
  //       contact: "This is the Contact page."
  //     };

  //     // Look up the partial for the given fragment id.
  //     callback(partials[fragmentId]);
  //   }

  // Encapsulates an HTTP GET request using XMLHttpRequest.
  // Fetches the file at the given path, then
  // calls the callback with the text content of the file.
  function fetchFile(path, callback) {
    // Create a new AJAX request for fetching the partial HTML file.
    var request = new XMLHttpRequest();

    // Call the callback with the content loaded from the file.
    request.onload = function () {
      callback(request.responseText);
    };

    // Fetch the partial HTML file for the given fragment id.
    request.open("GET", path);
    request.send(null);
  }

  // Gets the appropriate content for the given fragment identifier.
  // This function implements a simple cache.
  function getContent(fragmentId, callback) {
    // If the page has been fetched before,
    if (partialsCache[fragmentId]) {
      // pass the previously fetched content to the callback.
      callback(partialsCache[fragmentId]);
    } else {
      // If the page has not been fetched before, fetch it.
      fetchFile(fragmentId + ".html", function (content) {
        // Store the fetched content in the cache.
        partialsCache[fragmentId] = content;

        // Pass the newly fetched content to the callback.
        callback(content);
      });
    }
  }

  // If no fragment identifier is provided,
  if (!location.hash) {
    // default to #home
    location.hash = "#home";
  }

  // Navigate once to the initial hash value.
  navigate();

  // Navigate whenever the fragment identifier value changes.
  window.addEventListener("hashchange", navigate);
})();
