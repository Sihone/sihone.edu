import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useTranslation } from "react-i18next";
import { Button } from '@mui/material';
import { CloudDownload } from '@mui/icons-material';
import { useSnackbar } from "notistack";

const PdfDownloader = ({elementId , fileName, landscape}) => {

    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const downloadPdfDocument = () => {
        const element = document.getElementById(elementId);
        // html2canvas(input)
        //     .then((canvas) => {
        //         const imgData = canvas.toDataURL('image/png');
        //         const pdf = new jsPDF();
        //         pdf.addImage(imgData, 'JPEG', 0, 0);
        //         // pdf.output('dataurlnewwindow');
        //         pdf.save(`${fileName}.pdf`);
        //         // const orientation = landscape ? 'l' : 'p';
        //         // const pdf = new jsPDF(orientation, 'mm','a4');
        //         // pdf.addImage(imgData, 'JPEG', 0, 0);
        //         // pdf.save(`${fileName}.pdf`);
        //         enqueueSnackbar(t("main.download pdf success"), { variant: "success" });
        //     })
        html2canvas(element, { scale: 2 }) // Higher scale improves quality
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'px',
              format: [canvas.width, canvas.height], // Size of the PDF
            });

            // Add the image of the canvas to the PDF
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

            // Save the PDF
            pdf.save(`${fileName}.pdf`);
            enqueueSnackbar(t("main.download pdf success"), { variant: "success" });
            
          });
    }

    return (
        <Button
            onClick={downloadPdfDocument}
            color="primary"
            variant="contained"
            startIcon={<CloudDownload />}
        >
            {t("main.download pdf")}
        </Button>
    )
}

export default PdfDownloader;
