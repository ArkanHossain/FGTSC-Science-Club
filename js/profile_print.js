const printBtn = document.getElementById("print");

printBtn.addEventListener("click", () => {

    const card = document.getElementById("card");

    const width = card.offsetWidth;
    const height = card.offsetHeight;

    const options = {
        margin: 0,
        filename: "my-card.pdf",

        image: {
            type: "jpeg",
            quality: 1
        },

        html2canvas: {
            scale: 2,
            useCORS: true
        },

        jsPDF: {
            unit: "px",
            format: [width, height],
            orientation: "landscape"
        }
    };

    html2pdf().set(options).from(card).save();

});