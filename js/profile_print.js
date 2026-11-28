document.getElementById("print").addEventListener("click", function () {
    const card = document.getElementById("card");

    html2canvas(card, {
        scale: 2,
        backgroundColor: null,
        useCORS: true
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = "card.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});