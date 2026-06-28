import { useMemo, useState } from "react";
import SectionHeading from "../SectionHeading/SectionHeading.jsx";
import styles from "./ContactForm.module.css";

const projectTypes = ["Kitchen renovation", "Bathroom renovation", "Kitchen and bathroom", "Interior renovation", "Other"];
const budgets = ["Not sure yet", "Under $25k", "$25k-$50k", "$50k-$100k", "$100k+"];
const maxFileSize = 5 * 1024 * 1024;
const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

function validate(values, files) {
  const errors = {};
  if (!values.firstName.trim()) errors.firstName = "First name is required.";
  if (!values.lastName.trim()) errors.lastName = "Last name is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Enter a valid email address.";
  if (!values.projectLocation.trim()) errors.projectLocation = "Project address or ZIP code is required.";
  if (!values.projectType) errors.projectType = "Choose a project type.";
  if (!values.description.trim() || values.description.trim().length < 20) errors.description = "Share at least 20 characters about the project.";
  [...files].forEach((file) => {
    if (!allowedTypes.includes(file.type)) errors.photos = "Photos must be JPG, PNG, WebP, or PDF.";
    if (file.size > maxFileSize) errors.photos = "Each file must be 5 MB or smaller.";
  });
  return errors;
}

export default function ContactForm() {
  const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT;
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    projectLocation: "",
    projectType: "",
    budget: "",
    startDate: "",
    description: ""
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const developmentMessage = useMemo(() => !endpoint, [endpoint]);

  const update = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values, files);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (!endpoint) {
      setStatus("missing-endpoint");
      return;
    }

    setStatus("loading");
    const body = new FormData();
    Object.entries(values).forEach(([key, value]) => body.append(key, value));
    files.forEach((file) => body.append("photos", file));

    try {
      const response = await fetch(endpoint, { method: "POST", body });
      if (!response.ok) throw new Error("Form provider rejected the submission.");
      setStatus("success");
      setValues({ firstName: "", lastName: "", email: "", phone: "", projectLocation: "", projectType: "", budget: "", startDate: "", description: "" });
      setFiles([]);
    } catch {
      setStatus("failure");
    }
  };

  const fieldError = (name) => errors[name] && <p className={styles.error}>{errors[name]}</p>;

  return (
    <section id="contact" className={`${styles.section} surface-band`}>
      <div className="section-shell">
        <div className={styles.layout}>
          <SectionHeading eyebrow="Estimate request" title="Tell us what you want to change." />
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            {developmentMessage && <p className={styles.notice}>Development note: configure VITE_CONTACT_FORM_ENDPOINT before launch. The form will not fake a successful submission.</p>}
            <div className={styles.two}>
              <label>First name<input name="firstName" value={values.firstName} onChange={update} aria-invalid={Boolean(errors.firstName)} /></label>
              <label>Last name<input name="lastName" value={values.lastName} onChange={update} aria-invalid={Boolean(errors.lastName)} /></label>
            </div>
            {fieldError("firstName") || fieldError("lastName")}
            <div className={styles.two}>
              <label>Email<input name="email" type="email" value={values.email} onChange={update} aria-invalid={Boolean(errors.email)} /></label>
              <label>Phone<input name="phone" type="tel" value={values.phone} onChange={update} /></label>
            </div>
            {fieldError("email")}
            <label>Project address or ZIP code<input name="projectLocation" value={values.projectLocation} onChange={update} aria-invalid={Boolean(errors.projectLocation)} /></label>
            {fieldError("projectLocation")}
            <div className={styles.two}>
              <label>Project type<select name="projectType" value={values.projectType} onChange={update} aria-invalid={Boolean(errors.projectType)}><option value="">Select one</option>{projectTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
              <label>Estimated budget<select name="budget" value={values.budget} onChange={update}><option value="">Select one</option>{budgets.map((budget) => <option key={budget}>{budget}</option>)}</select></label>
            </div>
            {fieldError("projectType")}
            <label>Desired start date<input name="startDate" type="date" value={values.startDate} onChange={update} /></label>
            <label>Project description<textarea name="description" rows="5" value={values.description} onChange={update} aria-invalid={Boolean(errors.description)} /></label>
            {fieldError("description")}
            <label>Optional project photos<input type="file" multiple accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={(event) => setFiles([...event.target.files])} aria-invalid={Boolean(errors.photos)} /></label>
            {fieldError("photos")}
            <p className={styles.hint}>Uploads depend on the selected form provider and its file handling limits.</p>
            <button type="submit" disabled={status === "loading"}>{status === "loading" ? "Sending..." : "Request an Estimate"}</button>
            {status === "success" && <p className={styles.success}>Thanks. Your request was sent.</p>}
            {status === "failure" && <p className={styles.error}>The form could not be sent. Please try again or use the email placeholder in the footer.</p>}
            {status === "missing-endpoint" && <p className={styles.error}>A form endpoint must be configured before submissions can be sent.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
