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
        const input = document.getElementById(elementId);
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const orientation = landscape ? 'l' : 'p';
                const pdf = new jsPDF(orientation, 'mm','a4');
                pdf.addImage(imgData, 'JPEG', 0, 0);
                pdf.save(`${fileName}.pdf`);
                enqueueSnackbar(t("main.download pdf success"), { variant: "success" });
            })
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