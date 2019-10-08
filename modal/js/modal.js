/*Get the modal*/
var modal = document.getElementById("myModal");

/*Get the Button that Opens the Modal*/
var btn = document.getElementById("help__btn");


/*Get the <span> element that closes the Model*/
var span = document.getElementsByClassName("close")[0];

/*When the User cliks on the button, open the modal*/
btn.onclick = function () {
    modal.style.display = "block";
};

/* When the user clicks on <span> (x), close the modal */
span.onclick = function (event) {
    modal.style.display = "none";
};

/* When the user clicks anywhere outside of the modal, close it */
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
