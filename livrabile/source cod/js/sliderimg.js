let fileInput = document.getElementById("fileInput");
let imageContainer = document.getElementById("images");
let numOfFiles = document.getElementById("num-of-files");

function preview() {
  imageContainer.innerHTML = "";

  if (fileInput.files.length > 3) {
    numOfFiles.textContent = "Maxim 3 Imagini Selectate";
  } else {
    numOfFiles.textContent = `${fileInput.files.length} Imagini Selectate`;
  }

  for (let i = 0; i < fileInput.files.length; i++) {
    if (i >= 3) {
      break; // Limit the number of images to 3
    }

    let reader = new FileReader();
    let figure = document.createElement("figure");
    let figCap = document.createElement("figcaption");
    figCap.innerText = fileInput.files[i].name;
    figure.appendChild(figCap);

    reader.onload = () => {
      let img = document.createElement("img");
      img.setAttribute("src", reader.result);
      figure.insertBefore(img, figCap);
    };

    let removeWrapper = document.createElement("div");
    removeWrapper.classList.add("remove-wrapper");

    let removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove-button");

    removeButton.addEventListener("click", () => {
      removeImage(i);
    });

    removeWrapper.appendChild(removeButton);
    figure.appendChild(removeWrapper);

    imageContainer.appendChild(figure);
    reader.readAsDataURL(fileInput.files[i]);
  }
}

function removeImage(index) {
  let selectedFiles = Array.from(fileInput.files);
  selectedFiles.splice(index, 1);
  fileInput.value = "";

  let newFileList = new DataTransfer();
  selectedFiles.forEach((file) => newFileList.items.add(file));

  if ("files" in fileInput) {
    fileInput.files = newFileList.files;
  }

  preview();
}

fileInput.addEventListener("change", preview);
