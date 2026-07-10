import { useRef, useState } from "react";
import { contactDetails } from "../../data/site.js";
import SectionHeading from "../SectionHeading/SectionHeading.jsx";
import styles from "./ContactForm.module.css";

const contactEmail = contactDetails.email;
const contactEndpoint = "/api/contact";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  projectLocation: "",
  projectType: "",
  budget: "",
  startDate: "",
  description: ""
};

const projectTypes = [
  "Kitchen renovation",
  "Bathroom renovation",
  "Kitchen and bathroom",
  "Interior renovation",
  "Other"
];

const budgets = [
  "Not sure yet",
  "Under $25k",
  "$25k-$50k",
  "$50k-$100k",
  "$100k+"
];

const maxFileSize = 5 * 1024 * 1024;
const maxFiles = 5;

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf"
];

function validate(values, files) {
  const errors = {};

  if (!values.firstName.trim()) {
    errors.firstName = "First name is required.";
  }

  if (!values.lastName.trim()) {
    errors.lastName = "Last name is required.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.projectLocation.trim()) {
    errors.projectLocation =
      "Project address or ZIP code is required.";
  }

  if (!values.projectType) {
    errors.projectType = "Choose a project type.";
  }

  if (values.description.trim().length < 20) {
    errors.description =
      "Share at least 20 characters about the project.";
  }

  if (files.length > maxFiles) {
    errors.photos = `You may upload up to ${maxFiles} files.`;
  }

  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      errors.photos =
        "Files must be JPG, PNG, WebP, or PDF.";
      break;
    }

    if (file.size > maxFileSize) {
      errors.photos =
        "Each file must be 5 MB or smaller.";
      break;
    }
  }

  return errors;
}

export default function ContactForm() {
  const fileInputRef = useRef(null);

  const [values, setValues] = useState(initialValues);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");

  const update = (event) => {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: value
    }));

    setErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[name];

      return nextErrors;
    });

    if (status !== "idle") {
      setStatus("idle");
      setServerError("");
    }
  };

  const updateFiles = (event) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    setFiles(selectedFiles);

    setErrors((current) => {
      if (!current.photos) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors.photos;

      return nextErrors;
    });

    if (status !== "idle") {
      setStatus("idle");
      setServerError("");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const nextErrors = validate(values, files);

    setErrors(nextErrors);
    setServerError("");

    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("loading");

    const formData = new FormData();

    Object.entries(values).forEach(([name, value]) => {
      formData.append(name, value.trim());
    });

    const browserFormData = new FormData(formElement);

    formData.append(
      "botcheck",
      String(browserFormData.get("botcheck") || "")
    );

    files.forEach((file) => {
      formData.append("photos", file, file.name);
    });

    try {
      const response = await fetch(contactEndpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const responseText = await response.text();

        console.error(
          "Contact API returned a non-JSON response:",
          responseText
        );

        throw new Error(
          "The contact endpoint returned the website instead of the contact function. Confirm that functions/api/contact.js is deployed."
        );
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "The form could not be sent."
        );
      }

      setValues(initialValues);
      setFiles([]);
      setErrors({});
      setServerError("");
      setStatus("success");

      formElement.reset();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Contact form submission error:", error);

      setServerError(
        error instanceof Error
          ? error.message
          : "The form could not be sent."
      );

      setStatus("failure");
    }
  };

  const fieldError = (name) => {
    if (!errors[name]) {
      return null;
    }

    return (
      <p
        id={`${name}-error`}
        className={styles.error}
        role="alert"
      >
        {errors[name]}
      </p>
    );
  };

  return (
    <section
      id="contact"
      className={`${styles.section} surface-band`}
    >
      <div className="section-shell">
        <div className={styles.layout}>
          <SectionHeading
            eyebrow="Estimate request"
            title="Tell us what you want to change."
          />

          <form
            className={styles.form}
            onSubmit={onSubmit}
            noValidate
          >
            {import.meta.env.DEV && (
              <p className={styles.notice}>
                Local development note: the contact form
                posts to <code>/api/contact</code>. Run the
                site through Cloudflare Pages development
                tooling to test the server function.
              </p>
            )}

            <input
              className={styles.honeypot}
              type="text"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className={styles.two}>
              <label>
                First name
                <input
                  type="text"
                  name="firstName"
                  value={values.firstName}
                  onChange={update}
                  autoComplete="given-name"
                  aria-invalid={Boolean(errors.firstName)}
                  aria-describedby={
                    errors.firstName
                      ? "firstName-error"
                      : undefined
                  }
                />
              </label>

              <label>
                Last name
                <input
                  type="text"
                  name="lastName"
                  value={values.lastName}
                  onChange={update}
                  autoComplete="family-name"
                  aria-invalid={Boolean(errors.lastName)}
                  aria-describedby={
                    errors.lastName
                      ? "lastName-error"
                      : undefined
                  }
                />
              </label>
            </div>

            {fieldError("firstName")}
            {fieldError("lastName")}

            <div className={styles.two}>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={update}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email
                      ? "email-error"
                      : undefined
                  }
                />
              </label>

              <label>
                Phone
                <input
                  type="tel"
                  name="phone"
                  value={values.phone}
                  onChange={update}
                  autoComplete="tel"
                />
              </label>
            </div>

            {fieldError("email")}

            <label>
              Project address or ZIP code
              <input
                type="text"
                name="projectLocation"
                value={values.projectLocation}
                onChange={update}
                autoComplete="postal-code"
                aria-invalid={Boolean(
                  errors.projectLocation
                )}
                aria-describedby={
                  errors.projectLocation
                    ? "projectLocation-error"
                    : undefined
                }
              />
            </label>

            {fieldError("projectLocation")}

            <div className={styles.two}>
              <label>
                Project type
                <select
                  name="projectType"
                  value={values.projectType}
                  onChange={update}
                  aria-invalid={Boolean(
                    errors.projectType
                  )}
                  aria-describedby={
                    errors.projectType
                      ? "projectType-error"
                      : undefined
                  }
                >
                  <option value="">Select one</option>

                  {projectTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Estimated budget
                <select
                  name="budget"
                  value={values.budget}
                  onChange={update}
                >
                  <option value="">Select one</option>

                  {budgets.map((budget) => (
                    <option
                      key={budget}
                      value={budget}
                    >
                      {budget}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {fieldError("projectType")}

            <label>
              Desired start date
              <input
                type="date"
                name="startDate"
                value={values.startDate}
                onChange={update}
              />
            </label>

            <label>
              Project description
              <textarea
                name="description"
                rows="5"
                value={values.description}
                onChange={update}
                aria-invalid={Boolean(
                  errors.description
                )}
                aria-describedby={
                  errors.description
                    ? "description-error"
                    : undefined
                }
              />
            </label>

            {fieldError("description")}

            <label>
              Optional project photos
              <input
                ref={fileInputRef}
                type="file"
                name="photos"
                multiple
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                onChange={updateFiles}
                aria-invalid={Boolean(errors.photos)}
                aria-describedby={
                  errors.photos
                    ? "photos-error"
                    : "photos-hint"
                }
              />
            </label>

            {fieldError("photos")}

            <p
              id="photos-hint"
              className={styles.hint}
            >
              Upload up to five JPG, PNG, WebP, or PDF
              files. Each file must be 5 MB or smaller.
            </p>

            <button
              type="submit"
              disabled={status === "loading"}
              aria-busy={status === "loading"}
            >
              {status === "loading"
                ? "Sending..."
                : "Request an Estimate"}
            </button>

            {status === "success" && (
              <p
                className={styles.success}
                role="status"
              >
                Thanks. Your request was sent.
              </p>
            )}

            {status === "failure" && (
              <p
                className={styles.error}
                role="alert"
              >
                {serverError} Please try again or email{" "}
                <a href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>{" "}
                directly.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}