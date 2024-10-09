import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useTranslation } from "react-i18next";
import { Button } from '@mui/material';
import { CloudDownload, Print } from '@mui/icons-material';
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

const PrintAndPdfDownloader = ({elementId, replaceOptions, fileName, color, orientation, print}) => {

    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    
    const [revertOptions, setRevertOptions] = useState({});
    
    useEffect(() => {
      const element = document.getElementById(elementId);
      for (let option in replaceOptions) {
        const _element = element.getElementsByClassName(replaceOptions[option].id)[0];
        if (_element) {
          setRevertOptions({ ...revertOptions, 
            [replaceOptions[option].id]: _element.innerHTML,
          });
        }
      }
    }, [replaceOptions, elementId]);
    
    const getReplacedContent = () => {
      const element = document.getElementById(elementId);
        
        if (element && replaceOptions) {
          for (let option in replaceOptions) {
            if (element.getElementsByClassName(replaceOptions[option].id).length > 0) {
              for (let i = 0; i < element.getElementsByClassName(replaceOptions[option].id).length; i++) {
                const _element2 = element.getElementsByClassName(replaceOptions[option].id)[i];
                _element2.innerHTML = replaceOptions[option].html;
              }
            }
          }
        }
        
        return element;
      }
    
    const printDocument = () => {
        const mywindow = window.open('', 'PRINT', 'height=400,width=600');
        
        const css = '@page { size: landscape; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';
        style.media = 'print';

        if (style.styleSheet){
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
        
        const body = getReplacedContent();

        mywindow.document.write('<html>');
        mywindow.document.write(head.innerHTML);
        mywindow.document.write('<body >');
        mywindow.document.write(body.innerHTML);
        mywindow.document.write('</body></html>');
    
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/
    
        mywindow.print();
        mywindow.close();
        enqueueSnackbar(t("main.print success"), { variant: "success" });
        revertPdfDocument();
        return true;
    }
    const downloadPdfDocument = () => {
        const element = getReplacedContent();
        
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
              orientation: orientation || 'portrait',
              unit: 'px',
              format: [canvas.width, canvas.height], // Size of the PDF
            });

            // Add the image of the canvas to the PDF
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

            // Save the PDF
            pdf.save(`${fileName}.pdf`);
            enqueueSnackbar(t("main.download pdf success"), { variant: "success" });
            
          });

        revertPdfDocument();
    }
    
    const revertPdfDocument = () => {
        for (let key in revertOptions) {
          const _elements = document.getElementById(elementId).getElementsByClassName(key);
          for (let i = 0; i < _elements.length; i++) {
            _elements[i].innerHTML = revertOptions[key];
          }
        }
    }

    return (
        <Button
            onClick={print ? printDocument : downloadPdfDocument}
            color={color || "primary"}
            variant="contained"
            startIcon={print ? <Print /> : <CloudDownload />}
            sx={{ mr: 2, py: 1 }}
        >
            {print ? t("main.print") : t("main.download pdf")}
        </Button>
    )
}

export default PrintAndPdfDownloader;
