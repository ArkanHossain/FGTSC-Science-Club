
const printBtn = document.getElementById("print");

printBtn.addEventListener("click", async () => {
    const card = document.getElementById("card");

    try {
        await document.fonts.ready;

        const rect = card.getBoundingClientRect();
        const width = Math.ceil(rect.width);
        const height = Math.ceil(rect.height);

        const pdfWidth = (width + 3) * 25.4 / 96;
        const pdfHeight = (height + 3) * 25.4 / 96;

        const options = {
            margin: 0,
            filename: "my-card.pdf",

            image: {
                type: "jpeg",
                quality: 1
            },

            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",

                scrollX: 0,
                scrollY: 0,

                width: width,
                height: height,

                windowWidth: width,
                windowHeight: height,

                x: 0,
                y: 0
            },

            jsPDF: {
                unit: "mm",
                format: [pdfWidth, pdfHeight],
                orientation: "landscape"
            },

            pagebreak: {
                mode: []
            }
        };

        await html2pdf()
            .set(options)
            .from(card)
            .save();

    } catch (error) {
        console.error("PDF generation failed:", error);
    }
});
