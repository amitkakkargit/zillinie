import { useEffect, useMemo, useState } from "react";
import {
  getLookupData,
  getStaff,
  getCustomers,
  saveMeasurement,
} from "../services/zillinieApi";

interface LookupData {
  productTypes: Array<Record<string, any>>;
}

interface StaffMember {
  StaffId: number;
  TailorName: string;
}

interface Customer {
  id: number;
  name: string;
  mobile: string;
}

const emptyForm = {
  orderNumber: "",
  productType: "",
  measurementTakenBy: "",
  customerMobile: "",
  customerName: "",
  customerId: 0,
  trialDate: "",
  deliveryDate: "",
  remarks: "",
  lengthU: "",
  chestU: "",
  waistU: "",
  hipU: "",
  shoulderU: "",
  sleeveU: "",
  neckU: "",
  cuffU: "",
  bicepU: "",
  wristU: "",
  lengthL: "",
  waistL: "",
  hipL: "",
  frontL: "",
  allRoundL: "",
  thighL: "",
  bottomL: "",
  kneeL: "",
  calfL: "",
};

function Measurement() {
  const [lookupData, setLookupData] = useState<LookupData>({
    productTypes: [],
  });
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState(() => ({ ...emptyForm }));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([getLookupData(), getStaff(), getCustomers()])
      .then(([lookupResult, staffResult, customerResult]) => {
        setLookupData({ productTypes: lookupResult.productTypes ?? [] });
        setStaffList(staffResult ?? []);
        setCustomers(customerResult ?? []);
      })
      .catch(() => setError("Could not load measurement lookup data."))
      .finally(() => setLoading(false));
  }, []);

  const matchedCustomer = useMemo(() => {
    return customers.find(
      (customer) => customer.mobile === form.customerMobile.trim(),
    );
  }, [customers, form.customerMobile]);

  useEffect(() => {
    if (matchedCustomer) {
      setForm((current) => ({
        ...current,
        customerId: matchedCustomer.id,
        customerName: matchedCustomer.name,
      }));
    }
  }, [matchedCustomer]);

  const handleChange = (key: keyof typeof form, value: string | number) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.orderNumber || !form.productType || !form.measurementTakenBy) {
      setError("Order number, product type, and staff picker are required.");
      return;
    }
    if (!form.customerId) {
      setError(
        "Please enter a customer mobile number and select an existing customer.",
      );
      return;
    }

    setSaving(true);
    try {
      const response = await saveMeasurement({
        orderNumber: Number(form.orderNumber),
        productType: form.productType,
        measurementTakenBy: Number(form.measurementTakenBy),
        customerId: Number(form.customerId),
        trialDate: form.trialDate,
        deliveryDate: form.deliveryDate,
        lengthU: form.lengthU,
        chestU: form.chestU,
        waistU: form.waistU,
        hipU: form.hipU,
        shoulderU: form.shoulderU,
        sleeveU: form.sleeveU,
        neckU: form.neckU,
        cuffU: form.cuffU,
        bicepU: form.bicepU,
        wristU: form.wristU,
        lengthL: form.lengthL,
        waistL: form.waistL,
        hipL: form.hipL,
        frontL: form.frontL,
        allRoundL: form.allRoundL,
        thighL: form.thighL,
        bottomL: form.bottomL,
        kneeL: form.kneeL,
        calfL: form.calfL,
        remarks: form.remarks,
        filePath: "",
        totalAmount: 0,
        advanceAmount: 0,
        branchId: "",
        measurementDate: new Date().toISOString(),
      });

      setMessage("Measurement saved successfully.");
      setForm({
        ...emptyForm,
        customerMobile: form.customerMobile,
        customerName: form.customerName,
        customerId: form.customerId,
      });
      console.log(response);
    } catch (saveError) {
      console.error(saveError);
      setError("Unable to save measurement record.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page measurement-page">
      <h1>Measurement</h1>
      {loading && <p>Loading measurement lookup data...</p>}
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <section className="measurement-form-section">
          <div className="field-group">
            <label>Customer mobile</label>
            <input
              type="text"
              value={form.customerMobile}
              onChange={(e) => handleChange("customerMobile", e.target.value)}
              placeholder="Enter customer mobile"
            />
          </div>
          <div className="field-group">
            <label>Customer name</label>
            <input type="text" value={form.customerName} disabled />
          </div>
          <div className="field-group">
            <label>Order number</label>
            <input
              type="number"
              value={form.orderNumber}
              onChange={(e) => handleChange("orderNumber", e.target.value)}
            />
          </div>
          <div className="field-group">
            <label>Product type</label>
            <select
              value={form.productType}
              onChange={(e) => handleChange("productType", e.target.value)}
            >
              <option value="">Select a product type</option>
              {lookupData.productTypes.map((productType) => (
                <option
                  key={
                    productType.ProductId ??
                    productType.Id ??
                    productType.ProductTypeId
                  }
                  value={
                    productType.ProductId ??
                    productType.Id ??
                    productType.ProductTypeId
                  }
                >
                  {productType.ProductName ??
                    productType.Name ??
                    productType.ProductType}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label>Measurement taken by</label>
            <select
              value={form.measurementTakenBy}
              onChange={(e) =>
                handleChange("measurementTakenBy", e.target.value)
              }
            >
              <option value="">Select staff member</option>
              {staffList.map((staff) => (
                <option key={staff.StaffId} value={staff.StaffId}>
                  {staff.TailorName}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label>Trial date</label>
            <input
              type="date"
              value={form.trialDate}
              onChange={(e) => handleChange("trialDate", e.target.value)}
            />
          </div>
          <div className="field-group">
            <label>Delivery date</label>
            <input
              type="date"
              value={form.deliveryDate}
              onChange={(e) => handleChange("deliveryDate", e.target.value)}
            />
          </div>
          <div className="field-group full-width">
            <label>Remarks</label>
            <textarea
              value={form.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              rows={3}
            />
          </div>
        </section>

        <section className="measurement-fields-section">
          <h2>Upper body measurements</h2>
          <div className="field-grid">
            <div className="field-group">
              <label>Length U</label>
              <input
                type="text"
                value={form.lengthU}
                onChange={(e) => handleChange("lengthU", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Chest U</label>
              <input
                type="text"
                value={form.chestU}
                onChange={(e) => handleChange("chestU", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Waist U</label>
              <input
                type="text"
                value={form.waistU}
                onChange={(e) => handleChange("waistU", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Hip U</label>
              <input
                type="text"
                value={form.hipU}
                onChange={(e) => handleChange("hipU", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Shoulder U</label>
              <input
                type="text"
                value={form.shoulderU}
                onChange={(e) => handleChange("shoulderU", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Sleeve U</label>
              <input
                type="text"
                value={form.sleeveU}
                onChange={(e) => handleChange("sleeveU", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Neck U</label>
              <input
                type="text"
                value={form.neckU}
                onChange={(e) => handleChange("neckU", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Cuff U</label>
              <input
                type="text"
                value={form.cuffU}
                onChange={(e) => handleChange("cuffU", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Bicep U</label>
              <input
                type="text"
                value={form.bicepU}
                onChange={(e) => handleChange("bicepU", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Wrist U</label>
              <input
                type="text"
                value={form.wristU}
                onChange={(e) => handleChange("wristU", e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="measurement-fields-section">
          <h2>Lower body measurements</h2>
          <div className="field-grid">
            <div className="field-group">
              <label>Length L</label>
              <input
                type="text"
                value={form.lengthL}
                onChange={(e) => handleChange("lengthL", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Waist L</label>
              <input
                type="text"
                value={form.waistL}
                onChange={(e) => handleChange("waistL", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Hip L</label>
              <input
                type="text"
                value={form.hipL}
                onChange={(e) => handleChange("hipL", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Front L</label>
              <input
                type="text"
                value={form.frontL}
                onChange={(e) => handleChange("frontL", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>All Round L</label>
              <input
                type="text"
                value={form.allRoundL}
                onChange={(e) => handleChange("allRoundL", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Thigh L</label>
              <input
                type="text"
                value={form.thighL}
                onChange={(e) => handleChange("thighL", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Bottom L</label>
              <input
                type="text"
                value={form.bottomL}
                onChange={(e) => handleChange("bottomL", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Knee L</label>
              <input
                type="text"
                value={form.kneeL}
                onChange={(e) => handleChange("kneeL", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Calf L</label>
              <input
                type="text"
                value={form.calfL}
                onChange={(e) => handleChange("calfL", e.target.value)}
              />
            </div>
          </div>
        </section>

        <button type="submit" disabled={saving}>
          {saving ? "Saving measurement..." : "Save Measurement"}
        </button>
      </form>
    </div>
  );
}

export default Measurement;
