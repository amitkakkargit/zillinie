import { useRef } from "react";

function Print2() {
  const printRef = useRef<HTMLDivElement | null>(null);

  const doPrint = () => {
    if (!printRef.current) return;
    const w = window.open("", "_blank", "width=800,height=600");
    if (!w) return;
    w.document.write(`<!doctype html><html><head><title>Print</title>`);
    w.document.write(`<style>body{font-family:sans-serif}</style>`);
    w.document.write("</head><body>");
    w.document.write(printRef.current.innerHTML);
    w.document.write("</body></html>");
    w.document.close();
    setTimeout(() => w.print(), 250);
  };

  return (
    <div className="page print-page">
      <h1>Print Preview 2</h1>
      <div ref={printRef}>
        <h2>Receipt</h2>
        <p>Receipt layout sample</p>
      </div>
      <button onClick={doPrint}>Print</button>
    </div>
  );
}

export default Print2;
