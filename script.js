$(document).ready(function () {
  // Function to show the "please wait" modal
  //   $("#pleaseWaitModal").show();
  //   $("#successModal").show();
  // Click event for the "OK" button in the success modal
  $("#okButton").click(function () {
    hideSuccessModal(); // Hide the success modal when "OK" is clicked
  });
  // Find the form by its ID
  var form = $("#myForm");
  // Add a submit event listener to the form
  console.log("run3");
  form.submit(function (e) {
    e.preventDefault(); // Prevent the default form submission
    // Show the "please wait" modal before the request is sent
    showPleaseWaitModal();
    // Your custom function to execute when the form is submitted
    performCustomFunction();
    // You can also submit the form to its action URL here if needed
    // form.submit();
  });

  $('input[type="file"]').change(function () {
    console.log("gg");
    const fileInput = $(this);
    const fileNameDisplay = fileInput.siblings(".file-name");
    console.log("fileinput: " + fileInput);
    console.log("fileNameDisplay: " + fileNameDisplay);
    if (fileInput[0].files.length > 0) {
      const fileName = fileInput[0].files[0].name;
      fileNameDisplay.text(fileName);
      console.log("hh");
    } else {
      fileNameDisplay.text("No file selectedss");
      console.log("ii");
    }
  });
});
function showPleaseWaitModal() {
  $("#pleaseWaitModal").show();
}

// Function to hide the "please wait" modal
function hidePleaseWaitModal() {
  $("#pleaseWaitModal").hide();
}
// Function to show the success modal
function showSuccessModal() {
  $("#successModal").show();
}

// Function to hide the success modal
function hideSuccessModal() {
  $("#successModal").hide();
}

function performCustomFunction() {
  console.log("submittes fffggfffggg");

  // This line declares a variable called "url" and assigns it a value of "Api_Endpoint_Url"
  //   let url =
  //     "https://script.google.com/macros/s/AKfycbwE92N4Rmltk7Jhn_1X1ursu8Ck1yNh9wtFe0G6H8oOuPAM4svonLt2VRYTpp1B8rlInQ/exec";
  let url =
    "https://script.google.com/macros/s/AKfycby0nuLdK1VKxQEQGBZlzonbIGFepBpFbnWoI9uMb1yf0Kj-Oh8Fisy4Uz4m7KHDkTeI/exec";

  //getting other attributes
  let cust_comment = document.getElementById("comments").value;
  let full_name = document.getElementById("full_name").value;
  let tag = document.getElementById("tag_bagage").value;
  let routing = document.getElementById("routing").value;
  let date = document.getElementById("date").value;

  let imageArray = [];

  let fileInputs = [
    document.getElementById("image_url1"),
    document.getElementById("image_url2"),
    document.getElementById("image_url3"),
  ];

  // Use a Promise to wait for all images to be processed
  Promise.all(fileInputs.map(processImage)).then((imageData) => {
    // Create a data object with image properties and other data
    let data = {
      images: imageData,
      cust_comment: cust_comment,
      full_name: full_name,
      tag: tag,
      routing: routing,
      date: date,
    };

    // console.log("complete data json: " + JSON.stringify(data));
    // console.log("complete data: " + JSON.stringify(data));

    //   // Send a single POST request with all the data
    // This line sends a POST request to the URL specified in the "url" variable, with the "obj" object as the request body
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    })
      // This line waits for the response from the server and converts it to text
      .then((r) => r.text())
      // This line logs the response data to the console
      .then((data) => {
        if (data.includes("Form submitted successfullllllly!!!!!.")) {
          hidePleaseWaitModal();
          console.log(data);
          showSuccessModal();
          // If the data contains the specific text, reset the form
          document.getElementById("myForm").reset();
          $(".file-name").text("No file selected");
        } else {
          console.log("error");
        }
      })
      .catch((error) => {
        // Handle errors and hide the modal
        hidePleaseWaitModal();
        console.error(error);
      });
  });

  function processImage(fileInput) {
    return new Promise((resolve) => {
      let file = fileInput.files[0];
      if (file) {
        let fr = new FileReader();
        fr.addEventListener("loadend", () => {
          let res = fr.result;
          let spt = res.split("base64,")[1];
          imageArray.push({
            base64: spt,
            type: file.type,
            name: file.name,
          });
          resolve({
            base64: spt,
            type: file.type,
            name: file.name,
          });
        });
        fr.readAsDataURL(file);
      } else {
        resolve(null); // Resolve with null for files without data
      }
    });
  }
}
