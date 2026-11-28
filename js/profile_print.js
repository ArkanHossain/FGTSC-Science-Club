
const printBtn = document.getElementById("print");

printBtn.addEventListener("click", async () => {
    const card = document.getElementById("card");

    try {
        await document.fonts.ready;

        const width = card.offsetWidth;
        const height = card.offsetHeight;

        const pdfWidth = width * 25.4 / 96;
        const pdfHeight = height * 25.4 / 96;

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
                scrollY: 0
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
            .toPdf()
            .get("pdf")
            .then(pdf => {
                // Ensure only one page
                while (pdf.internal.getNumberOfPages() > 1) {
                    pdf.deletePage(pdf.internal.getNumberOfPages());
                }
            })
            .save();

    } catch (error) {
        console.error("PDF generation failed:", error);
    }
});
