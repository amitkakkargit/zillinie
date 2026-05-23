import { useRef } from "react";

function Print1() {
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
      <h1>Print Preview 1</h1>
      <div ref={printRef}>
        <h2>Invoice Header</h2>
        <p>Company details here</p>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sample</td>
              <td>1</td>
              <td>100</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button onClick={doPrint}>Print</button>
    </div>
  );
}

export default Print1;
